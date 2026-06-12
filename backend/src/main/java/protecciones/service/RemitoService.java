package protecciones.service;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import protecciones.dto.RemitoRequestDTO;
import protecciones.dto.RemitoResponseDTO;
import protecciones.entity.Proveedor;
import protecciones.entity.Remito;
import protecciones.exception.BusinessException;
import protecciones.repository.ProveedorRepository;
import protecciones.repository.RemitoRepository;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.net.MalformedURLException;

@Service
public class RemitoService {

    private final RemitoRepository
            remitoRepository;

    private final ProveedorRepository
            proveedorRepository;

    public RemitoService(

            RemitoRepository remitoRepository,

            ProveedorRepository proveedorRepository
    ) {

        this.remitoRepository =
                remitoRepository;

        this.proveedorRepository =
                proveedorRepository;
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

        try {

                Remito remito =
                        remitoRepository
                                .findById(
                                        remitoId
                                )
                                .orElseThrow();

                Path carpeta =
                        Paths.get(
                                "uploads/remitos"
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

                        StandardCopyOption
                                .REPLACE_EXISTING
                );

                remito.setNombreArchivo(
                        archivo.getOriginalFilename()
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

        try {

                Remito remito =
                        remitoRepository
                                .findById(
                                        remitoId
                                )
                                .orElseThrow();

                Path archivo =
                        Paths.get(
                                remito.getRutaArchivo()
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

        public List<RemitoResponseDTO>
        obtenerDisponibles() {

        return remitoRepository
                .findByAsociadoFalse()
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

        return new RemitoResponseDTO(

                remito.getId(),

                remito.getNumeroRemito(),

                remito.getFecha(),

                remito.getProveedor()
                        .getNombre()
        );
    }
}