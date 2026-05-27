package protecciones.service;

import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.stereotype.Service;

import protecciones.dto.ProvinciaRequestDTO;
import protecciones.dto.ProvinciaResponseDTO;

import protecciones.entity.Provincia;

import protecciones.exception.BusinessException;

import protecciones.repository.ProvinciaRepository;

import java.util.List;

@Service
public class ProvinciaService {

    private final ProvinciaRepository
            provinciaRepository;

    public ProvinciaService(
            ProvinciaRepository provinciaRepository
    ) {

        this.provinciaRepository =
                provinciaRepository;
    }

    public List<ProvinciaResponseDTO>
    obtenerTodas() {

        return provinciaRepository
                .findAllByOrderByNombreAsc()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public ProvinciaResponseDTO guardar(
            ProvinciaRequestDTO dto
    ) {

        validarDuplicado(
                dto.getNombre()
        );

        Provincia provincia =
                new Provincia();

        provincia.setNombre(
                dto.getNombre().trim()
        );

        Provincia guardada =
                provinciaRepository.save(
                        provincia
                );

        return mapToDTO(
                guardada
        );
    }

    public ProvinciaResponseDTO actualizar(

            Long id,
            ProvinciaRequestDTO dto
    ) {

        Provincia provincia =
                provinciaRepository
                        .findById(id)
                        .orElseThrow();

        provinciaRepository
                .findByNombreIgnoreCase(
                        dto.getNombre()
                )
                .ifPresent(existente -> {

                    if (!existente.getId()
                            .equals(id)) {

                        throw new BusinessException(
                                "La provincia ya existe"
                        );
                    }
                });

        provincia.setNombre(
                dto.getNombre().trim()
        );

        Provincia actualizada =
                provinciaRepository.save(
                        provincia
                );

        return mapToDTO(
                actualizada
        );
    }

    public void eliminar(
            Long id
    ) {

        try {

            provinciaRepository
                    .deleteById(id);

        } catch (
                DataIntegrityViolationException ex
        ) {

            throw new BusinessException(
                    "No se puede eliminar la provincia porque tiene localidades asociadas"
            );
        }
    }

    private void validarDuplicado(
            String nombre
    ) {

        provinciaRepository
                .findByNombreIgnoreCase(
                        nombre.trim()
                )
                .ifPresent(provincia -> {

                    throw new BusinessException(
                            "La provincia ya existe"
                    );
                });
    }

    private ProvinciaResponseDTO
    mapToDTO(
            Provincia provincia
    ) {

        return new ProvinciaResponseDTO(

                provincia.getId(),

                provincia.getNombre()
        );
    }
}