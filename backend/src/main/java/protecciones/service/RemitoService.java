package protecciones.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import protecciones.dto.RemitoRequestDTO;
import protecciones.dto.RemitoResponseDTO;
import protecciones.entity.Proveedor;
import protecciones.entity.Remito;
import protecciones.exception.BusinessException;
import protecciones.repository.ProveedorRepository;
import protecciones.repository.ReleRepository;
import protecciones.repository.RemitoRepository;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RemitoService {

    private final RemitoRepository
            remitoRepository;

    private final ProveedorRepository
            proveedorRepository;

private final ReleRepository releRepository;

    private final String uploadDir;

    public RemitoService(

            RemitoRepository remitoRepository,

            ProveedorRepository proveedorRepository,

            ReleRepository releRepository,

            @Value("${file.upload-dir}") String uploadDir
    ) {

        this.remitoRepository =
                remitoRepository;

        this.proveedorRepository =
                proveedorRepository;

        this.releRepository = releRepository;

        this.uploadDir = uploadDir;
    }

    public List<RemitoResponseDTO>
    obtenerTodos() {

        return remitoRepository
                .findAllByOrderByFechaDesc()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public RemitoResponseDTO guardar(
            RemitoRequestDTO dto
    ) {

        validarDuplicado(
                dto.getNumeroRemito()
        );

        Proveedor proveedor =
                proveedorRepository
                        .findById(
                                dto.getProveedorId()
                        )
                        .orElseThrow();

        Remito remito =
                new Remito();

        remito.setNumeroRemito(
                dto.getNumeroRemito().trim()
        );

        remito.setFecha(
                dto.getFecha()
        );

        remito.setProveedor(
                proveedor
        );

        Remito guardado =
                remitoRepository.save(
                        remito
                );

        return mapToDTO(
                guardado
        );
    }

    public RemitoResponseDTO actualizar(

            Long id,
            RemitoRequestDTO dto
    ) {

        Remito remito =
                remitoRepository
                        .findById(id)
                        .orElseThrow();

        remitoRepository
                .findByNumeroRemitoIgnoreCase(
                        dto.getNumeroRemito()
                )
                .ifPresent(existente -> {

                    if (!existente.getId()
                            .equals(id)) {

                        throw new BusinessException(
                                "El número de remito ya existe"
                        );
                    }
                });

        Proveedor proveedor =
                proveedorRepository
                        .findById(
                                dto.getProveedorId()
                        )
                        .orElseThrow();

        remito.setNumeroRemito(
                dto.getNumeroRemito().trim()
        );

        remito.setFecha(
                dto.getFecha()
        );

        remito.setProveedor(
                proveedor
        );

        Remito actualizado =
                remitoRepository.save(
                        remito
                );

        return mapToDTO(
                actualizado
        );
    }

    public void eliminar(
            Long id
    ) {

        try {

            remitoRepository
                    .deleteById(id);

        } catch (
                DataIntegrityViolationException ex
        ) {

            throw new BusinessException(
                    "No se puede eliminar el remito porque tiene relés asociados"
            );
        }
    }

    public void subirArchivo(

                Long remitoId,

                MultipartFile archivo
        ) {

        ArchivoAdjuntoValidator.validarPdf(archivo);

        try {

                Remito remito =
                        remitoRepository
                                .findById(
                                        remitoId
                                )
                                .orElseThrow();

                Path carpeta =
                        Paths.get(
                                uploadDir,
                                "remitos"
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
                        archivo.getBytes()
                );

                remito.setNombreArchivo(
                        ArchivoAdjuntoValidator.sanitizarNombreOriginal(
                                archivo.getOriginalFilename()
                        )
                );

                remito.setRutaArchivo(
                        destino.toString()
                );

                remitoRepository.save(
                        remito
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
                Long remitoId
        ) {

        Remito remito =
                remitoRepository
                        .findById(
                                remitoId
                        )
                        .orElseThrow();

        if (remito.getRutaArchivo() == null) {

                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Archivo no encontrado"
                );
        }

        Path archivo =
                Paths.get(
                        remito.getRutaArchivo()
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

        public List<RemitoResponseDTO>
        obtenerDisponibles() {

        return remitoRepository
                .findAllByOrderByFechaDesc()
                .stream()
                .map(this::mapToDTO)
                .toList();
        }

    private void validarDuplicado(
            String numeroRemito
    ) {

        remitoRepository
                .findByNumeroRemitoIgnoreCase(
                        numeroRemito.trim()
                )
                .ifPresent(remito -> {

                    throw new BusinessException(
                            "El número de remito ya existe"
                    );
                });
    }

    private RemitoResponseDTO
        mapToDTO(
                Remito remito
        ) {

        long cantidadReles =
                releRepository
                        .countByRemitoId(
                                remito.getId()
                        );

        boolean tieneArchivo =
                remito.getRutaArchivo() != null;

        return new RemitoResponseDTO(

                remito.getId(),

                remito.getNumeroRemito(),

                remito.getFecha(),

                remito.getProveedor()
                        .getId(),

                remito.getProveedor()
                        .getNombre(),

                cantidadReles,

                tieneArchivo
        );
        }
}