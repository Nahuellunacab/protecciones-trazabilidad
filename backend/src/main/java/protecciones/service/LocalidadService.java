package protecciones.service;

import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.stereotype.Service;

import protecciones.dto.LocalidadRequestDTO;
import protecciones.dto.LocalidadResponseDTO;

import protecciones.entity.Localidad;
import protecciones.entity.Provincia;

import protecciones.exception.BusinessException;

import protecciones.repository.LocalidadRepository;
import protecciones.repository.ProvinciaRepository;

import java.util.List;

@Service
public class LocalidadService {

    private final LocalidadRepository
            localidadRepository;

    private final ProvinciaRepository
            provinciaRepository;

    public LocalidadService(

            LocalidadRepository localidadRepository,

            ProvinciaRepository provinciaRepository
    ) {

        this.localidadRepository =
                localidadRepository;

        this.provinciaRepository =
                provinciaRepository;
    }

    public List<LocalidadResponseDTO>
    obtenerTodas() {

        return localidadRepository
                .findAllByOrderByNombreAsc()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public LocalidadResponseDTO guardar(
            LocalidadRequestDTO dto
    ) {

        validarDuplicado(

                dto.getNombre(),
                dto.getProvinciaId()
        );

        Provincia provincia =
                provinciaRepository
                        .findById(
                                dto.getProvinciaId()
                        )
                        .orElseThrow();

        Localidad localidad =
                new Localidad();

        localidad.setNombre(
                dto.getNombre().trim()
        );

        localidad.setProvincia(
                provincia
        );

        Localidad guardada =
                localidadRepository.save(
                        localidad
                );

        return mapToDTO(
                guardada
        );
    }

    public LocalidadResponseDTO actualizar(

            Long id,
            LocalidadRequestDTO dto
    ) {

        Localidad localidad =
                localidadRepository
                        .findById(id)
                        .orElseThrow();

        localidadRepository
                .findByNombreIgnoreCaseAndProvinciaId(

                        dto.getNombre(),
                        dto.getProvinciaId()
                )
                .ifPresent(existente -> {

                    if (!existente.getId()
                            .equals(id)) {

                        throw new BusinessException(
                                "La localidad ya existe en esa provincia"
                        );
                    }
                });

        Provincia provincia =
                provinciaRepository
                        .findById(
                                dto.getProvinciaId()
                        )
                        .orElseThrow();

        localidad.setNombre(
                dto.getNombre().trim()
        );

        localidad.setProvincia(
                provincia
        );

        Localidad actualizada =
                localidadRepository.save(
                        localidad
                );

        return mapToDTO(
                actualizada
        );
    }

    public void eliminar(
            Long id
    ) {

        try {

            localidadRepository
                    .deleteById(id);

        } catch (
                DataIntegrityViolationException ex
        ) {

            throw new BusinessException(
                    "No se puede eliminar la localidad porque tiene destinos asociados"
            );
        }
    }

    private void validarDuplicado(

            String nombre,
            Long provinciaId
    ) {

        localidadRepository
                .findByNombreIgnoreCaseAndProvinciaId(

                        nombre.trim(),
                        provinciaId
                )
                .ifPresent(localidad -> {

                    throw new BusinessException(
                            "La localidad ya existe en esa provincia"
                    );
                });
    }

    private LocalidadResponseDTO
    mapToDTO(
            Localidad localidad
    ) {

        return new LocalidadResponseDTO(

                localidad.getId(),

                localidad.getNombre(),

                localidad.getProvincia()
                        .getNombre()
        );
    }
}