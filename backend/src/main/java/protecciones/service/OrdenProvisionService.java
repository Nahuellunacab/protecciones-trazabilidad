package protecciones.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import protecciones.dto.OrdenProvisionRequestDTO;
import protecciones.dto.OrdenProvisionResponseDTO;
import protecciones.entity.OrdenProvision;
import protecciones.exception.BusinessException;
import protecciones.repository.OrdenProvisionRepository;
import protecciones.repository.ReleRepository;

import java.util.List;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OrdenProvisionService {

    private static final Logger
            log = LoggerFactory.getLogger(OrdenProvisionService.class);

    private final OrdenProvisionRepository
            ordenProvisionRepository;

    private final ReleRepository
            releRepository;

    private final String uploadDir;

    public OrdenProvisionService(
            OrdenProvisionRepository ordenProvisionRepository,
            ReleRepository releRepository,
            @Value("${file.upload-dir}") String uploadDir
    ) {

        this.ordenProvisionRepository =
                ordenProvisionRepository;

        this.releRepository =
                releRepository;

        this.uploadDir = uploadDir;
    }

    public List<OrdenProvisionResponseDTO>
    obtenerTodos() {

        return ordenProvisionRepository
                .findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public OrdenProvisionResponseDTO guardar(
            OrdenProvisionRequestDTO dto
    ) {

        validarDuplicado(
                dto.getNumero()
        );

        OrdenProvision orden =
                new OrdenProvision();

        orden.setNumero(
                dto.getNumero().trim()
        );

        orden.setObservaciones(
                dto.getObservaciones()
        );

        OrdenProvision guardada =
                ordenProvisionRepository.save(
                        orden
                );

        return mapToDTO(
                guardada
        );
    }

    public OrdenProvisionResponseDTO actualizar(
            Long id,
            OrdenProvisionRequestDTO dto
    ) {

        OrdenProvision orden =
                ordenProvisionRepository
                        .findById(id)
                        .orElseThrow();

        validarDuplicado(
                dto.getNumero(),
                id
        );

        orden.setNumero(
                dto.getNumero().trim()
        );

        orden.setObservaciones(
                dto.getObservaciones()
        );

        OrdenProvision actualizada =
                ordenProvisionRepository.save(
                        orden
                );

        return mapToDTO(
                actualizada
        );
    }

    public void eliminar(
            Long id
    ) {

        OrdenProvision orden =
                ordenProvisionRepository
                        .findById(id)
                        .orElseThrow();

        try {

            ordenProvisionRepository
                    .deleteById(id);

        } catch (
                DataIntegrityViolationException ex
        ) {

            throw new BusinessException(
                    "No se puede eliminar la orden porque tiene relés asociados"
            );
        }

        // El registro ya se borro de la base; si el archivo adjunto no se
        // puede borrar del filesystem no vale la pena romper la operacion
        // por esto (en el peor caso queda un archivo huerfano en uploads/).
        if (orden.getRutaArchivo() != null) {

            try {

                Files.deleteIfExists(
                        Paths.get(orden.getRutaArchivo())
                );

            } catch (IOException ex) {

                log.warn(
                        "No se pudo borrar el archivo adjunto de la orden {}: {}",
                        id,
                        ex.getMessage()
                );
            }
        }
    }

    public void subirArchivo(
            Long ordenProvisionId,
            MultipartFile archivo
    ) {

        byte[] pdfBytes =
                ArchivoAdjuntoValidator.prepararParaGuardar(archivo);

        try {

            OrdenProvision orden =
                    ordenProvisionRepository
                            .findById(
                                    ordenProvisionId
                            )
                            .orElseThrow();

            Path carpeta =
                    Paths.get(
                            uploadDir,
                            "ordenes-provision"
                    ).toAbsolutePath()
                    .normalize();

            Files.createDirectories(
                    carpeta
            );

            Path destino =
                    ArchivoAdjuntoValidator.resolverDestinoSeguro(
                            carpeta,
                            UUID.randomUUID() + ".pdf"
                    );

            Files.write(
                    destino,
                    pdfBytes
            );

            // Si ya habia un archivo adjunto (reemplazo), se guarda la
            // ruta vieja para borrarla recien despues de que el nuevo
            // archivo se haya escrito y el registro se haya guardado con
            // exito, asi nunca queda la orden sin ningun archivo valido
            // si algo falla a mitad de camino.
            String rutaAnterior =
                    orden.getRutaArchivo();

            orden.setNombreArchivo(
                    ArchivoAdjuntoValidator.sanitizarNombreOriginal(
                            archivo.getOriginalFilename()
                    )
            );

            orden.setRutaArchivo(
                    destino.toString()
            );

            ordenProvisionRepository.save(
                    orden
            );

            if (rutaAnterior != null) {

                Files.deleteIfExists(
                        Paths.get(rutaAnterior)
                );
            }

        } catch (
                IOException ex
        ) {

            throw new RuntimeException(
                    "Error al guardar archivo"
            );
        }
    }

    public Resource obtenerArchivo(
            Long ordenProvisionId
    ) {

        OrdenProvision orden =
                ordenProvisionRepository
                        .findById(
                                ordenProvisionId
                        )
                        .orElseThrow();

        if (orden.getRutaArchivo() == null) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Archivo no encontrado"
            );
        }

        Path archivo =
                Paths.get(
                        orden.getRutaArchivo()
                );

        if (
                !Files.exists(archivo)
                || !Files.isReadable(archivo)
        ) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Archivo no encontrado"
            );
        }

        return new PathResource(archivo);
    }

    public List<OrdenProvisionResponseDTO>
    obtenerDisponibles() {

        return ordenProvisionRepository
            .findAll()
            .stream()
            .map(this::mapToDTO)
            .toList();
        }

    private void validarDuplicado(
            String numero,
            Long currentId
    ) {

        List<OrdenProvision> ordenes =
                ordenProvisionRepository
                        .findAll();

        boolean existe =
                ordenes.stream()
                        .anyMatch(op ->
                                !op.getId()
                                        .equals(currentId)
                                &&
                                op.getNumero()
                                        .equalsIgnoreCase(
                                                numero.trim()
                                        )
                        );

        if (existe) {

            throw new BusinessException(
                    "La orden de provisión ya existe"
            );
        }
    }

    private void validarDuplicado(
            String numero
    ) {

        validarDuplicado(numero, -1L);
    }

    private OrdenProvisionResponseDTO
    mapToDTO(
            OrdenProvision orden
    ) {

        long cantidadReles =
                releRepository
                        .countByOrdenProvisionId(
                                orden.getId()
                        );

        return new OrdenProvisionResponseDTO(

                orden.getId(),

                orden.getNumero(),

                orden.getObservaciones(),

                cantidadReles,

                orden.getNombreArchivo()
        );
    }
}