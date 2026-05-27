package protecciones.service;

import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.stereotype.Service;

import protecciones.dto.ProveedorRequestDTO;
import protecciones.dto.ProveedorResponseDTO;

import protecciones.entity.Proveedor;

import protecciones.exception.BusinessException;

import protecciones.repository.ProveedorRepository;

import java.util.List;

@Service
public class ProveedorService {

    private final ProveedorRepository
            proveedorRepository;

    public ProveedorService(
            ProveedorRepository proveedorRepository
    ) {

        this.proveedorRepository =
                proveedorRepository;
    }

    public List<ProveedorResponseDTO>
    obtenerTodos() {

        return proveedorRepository
                .findAllByOrderByNombreAsc()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public ProveedorResponseDTO guardar(
            ProveedorRequestDTO dto
    ) {

        validarDuplicado(
                dto.getNombre()
        );

        Proveedor proveedor =
                new Proveedor();

        proveedor.setNombre(
                dto.getNombre().trim()
        );

        proveedor.setDomicilio(
                dto.getDomicilio()
        );

        proveedor.setTelefono(
                dto.getTelefono()
        );

        Proveedor guardado =
                proveedorRepository.save(
                        proveedor
                );

        return mapToDTO(
                guardado
        );
    }

    public ProveedorResponseDTO actualizar(

            Long id,
            ProveedorRequestDTO dto
    ) {

        Proveedor proveedor =
                proveedorRepository
                        .findById(id)
                        .orElseThrow();

        proveedorRepository
                .findByNombreIgnoreCase(
                        dto.getNombre()
                )
                .ifPresent(existente -> {

                    if (!existente.getId()
                            .equals(id)) {

                        throw new BusinessException(
                                "El proveedor ya existe"
                        );
                    }
                });

        proveedor.setNombre(
                dto.getNombre().trim()
        );

        proveedor.setDomicilio(
                dto.getDomicilio()
        );

        proveedor.setTelefono(
                dto.getTelefono()
        );

        Proveedor actualizado =
                proveedorRepository.save(
                        proveedor
                );

        return mapToDTO(
                actualizado
        );
    }

    public void eliminar(
            Long id
    ) {

        try {

            proveedorRepository
                    .deleteById(id);

        } catch (
                DataIntegrityViolationException ex
        ) {

            throw new BusinessException(
                    "No se puede eliminar el proveedor porque tiene remitos asociados"
            );
        }
    }

    private void validarDuplicado(
            String nombre
    ) {

        proveedorRepository
                .findByNombreIgnoreCase(
                        nombre.trim()
                )
                .ifPresent(proveedor -> {

                    throw new BusinessException(
                            "El proveedor ya existe"
                    );
                });
    }

    private ProveedorResponseDTO
    mapToDTO(
            Proveedor proveedor
    ) {

        return new ProveedorResponseDTO(

                proveedor.getId(),

                proveedor.getNombre(),

                proveedor.getDomicilio(),

                proveedor.getTelefono()
        );
    }
}