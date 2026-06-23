package protecciones.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import protecciones.dto.OrdenProvisionRequestDTO;
import protecciones.dto.OrdenProvisionResponseDTO;
import protecciones.entity.OrdenProvision;
import protecciones.exception.BusinessException;
import protecciones.repository.OrdenProvisionRepository;
import protecciones.repository.ReleRepository;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.net.MalformedURLException;

@Service
public class OrdenProvisionService {

    private final OrdenProvisionRepository
            ordenProvisionRepository;

    private final ReleRepository
            releRepository;

    public OrdenProvisionService(
            OrdenProvisionRepository ordenProvisionRepository,
            ReleRepository releRepository
    ) {

        this.ordenProvisionRepository =
                ordenProvisionRepository;

        this.releRepository =
                releRepository;
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
    }

    public void subirArchivo(
            Long ordenProvisionId,
            MultipartFile archivo
    ) {

        try {

            OrdenProvision orden =
                    ordenProvisionRepository
                            .findById(
                                    ordenProvisionId
                            )
                            .orElseThrow();

            Path carpeta =
                    Paths.get(
                            "uploads/ordenes-provision"
                    );

            Files.createDirectories(
                    carpeta
            );

            String nombreArchivo =
                    System.currentTimeMillis()
                    + "_"
                    + archivo.getOriginalFilename();

            Path destino =
                    carpeta.resolve(
                            nombreArchivo
                    );

            Files.copy(
                    archivo.getInputStream(),
                    destino,
                    StandardCopyOption.REPLACE_EXISTING
            );

            orden.setNombreArchivo(
                    archivo.getOriginalFilename()
            );

            orden.setRutaArchivo(
                    destino.toString()
            );

            ordenProvisionRepository.save(
                    orden
            );

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

        try {

            OrdenProvision orden =
                    ordenProvisionRepository
                            .findById(
                                    ordenProvisionId
                            )
                            .orElseThrow();

            Path archivo =
                    Paths.get(
                            orden.getRutaArchivo()
                    );

            return new UrlResource(
                    archivo.toUri()
            );

        } catch (
                MalformedURLException ex
        ) {

            throw new RuntimeException(
                    "Archivo no encontrado"
            );
        }
    }

    public List<OrdenProvisionResponseDTO>
    obtenerDisponibles() {

        return ordenProvisionRepository
                .findByAsociadoFalse()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    private void validarDuplicado(
            String numero
    ) {

        List<OrdenProvision> ordenes =
                ordenProvisionRepository
                        .findAll();

        boolean existe =
                ordenes.stream()
                        .anyMatch(op ->
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

                cantidadReles
        );
    }
}