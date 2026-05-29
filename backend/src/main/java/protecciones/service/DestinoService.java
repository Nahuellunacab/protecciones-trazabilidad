package protecciones.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import protecciones.dto.DestinoRequestDTO;
import protecciones.dto.DestinoResponseDTO;

import protecciones.entity.Destino;
import protecciones.entity.Localidad;

import protecciones.exception.BusinessException;

import protecciones.repository.DestinoRepository;
import protecciones.repository.LocalidadRepository;

import java.util.List;

@Service
public class DestinoService {

    private final DestinoRepository
            destinoRepository;

    private final LocalidadRepository
            localidadRepository;

    public DestinoService(
            DestinoRepository destinoRepository,
            LocalidadRepository localidadRepository
    ) {

        this.destinoRepository =
                destinoRepository;

        this.localidadRepository =
                localidadRepository;
    }

    public List<DestinoResponseDTO>
    obtenerTodos() {

        return destinoRepository
                .findAllByOrderByNombreAsc()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<DestinoResponseDTO>
        obtenerPorLocalidad(
                Long localidadId
        ) {

        return destinoRepository
                .findByLocalidadIdOrderByNombreAsc(
                        localidadId
                )
                .stream()
                .map(this::mapToDTO)
                .toList();
        }

    public DestinoResponseDTO guardar(
            DestinoRequestDTO dto
    ) {

        validarDuplicado(
                dto.getNombre()
        );

        Localidad localidad =
                localidadRepository
                        .findById(
                                dto.getLocalidadId()
                        )
                        .orElseThrow();

        Destino destino =
                new Destino();

        destino.setNombre(
                dto.getNombre().trim()
        );

        destino.setLocalidad(
                localidad
        );

        Destino guardado =
                destinoRepository.save(
                        destino
                );

        return mapToDTO(
                guardado
        );
    }

    public DestinoResponseDTO actualizar(
            Long id,
            DestinoRequestDTO dto
    ) {

        Destino destino =
                destinoRepository.findById(id)
                        .orElseThrow();

        Localidad localidad =
                localidadRepository
                        .findById(
                                dto.getLocalidadId()
                        )
                        .orElseThrow();

        destinoRepository
                .findByNombreIgnoreCase(
                        dto.getNombre()
                )
                .ifPresent(existente -> {

                    if (!existente.getId()
                            .equals(id)) {

                        throw new BusinessException(
                                "Ya existe un destino con ese nombre"
                        );
                    }
                });

        destino.setNombre(
                dto.getNombre().trim()
        );

        destino.setLocalidad(
                localidad
        );

        Destino actualizado =
                destinoRepository.save(
                        destino
                );

        return mapToDTO(
                actualizado
        );
    }

    public void eliminar(
            Long id
    ) {

        try {

            destinoRepository
                    .deleteById(id);

        } catch (
                DataIntegrityViolationException ex
        ) {

            throw new BusinessException(
                    "No se puede eliminar el destino porque tiene posiciones asociadas"
            );
        }
    }

    private void validarDuplicado(
            String nombre
    ) {

        destinoRepository
                .findByNombreIgnoreCase(
                        nombre.trim()
                )
                .ifPresent(destino -> {

                    throw new BusinessException(
                            "El destino ya existe"
                    );
                });

    }

    

    private DestinoResponseDTO
    mapToDTO(
            Destino destino
    ) {

        return new DestinoResponseDTO(

                destino.getId(),

                destino.getNombre(),

                destino.getLocalidad()
                        .getNombre(),

                destino.getLocalidad()
                        .getProvincia()
                        .getNombre()
        );
    }
}