package protecciones.service;

import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.stereotype.Service;

import protecciones.dto.MarcaRequestDTO;
import protecciones.dto.MarcaResponseDTO;

import protecciones.entity.Marca;

import protecciones.exception.BusinessException;

import protecciones.repository.MarcaRepository;

import java.util.List;

@Service
public class MarcaService {

    private final MarcaRepository
            marcaRepository;

    public MarcaService(
            MarcaRepository marcaRepository
    ) {

        this.marcaRepository =
                marcaRepository;
    }

    public List<MarcaResponseDTO>
    obtenerTodas() {

        return marcaRepository
                .findAllByOrderByNombreAsc()
                .stream()
                .map(marca ->
                        new MarcaResponseDTO(
                                marca.getId(),
                                marca.getNombre()
                        )
                )
                .toList();
    }

    public MarcaResponseDTO guardar(
            MarcaRequestDTO dto
    ) {

        validarDuplicado(
                dto.getNombre()
        );

        Marca marca = new Marca();

        marca.setNombre(
                dto.getNombre().trim()
        );

        Marca guardada =
                marcaRepository.save(marca);

        return mapToDTO(guardada);
    }

    public MarcaResponseDTO actualizar(
            Long id,
            MarcaRequestDTO dto
    ) {

        Marca marca =
                marcaRepository.findById(id)
                        .orElseThrow();

        marcaRepository
                .findByNombreIgnoreCase(
                        dto.getNombre()
                )
                .ifPresent(existente -> {

                    if (!existente.getId()
                            .equals(id)) {

                        throw new BusinessException(
                                "Ya existe una marca con ese nombre"
                        );
                    }
                });

        marca.setNombre(
                dto.getNombre().trim()
        );

        Marca actualizada =
                marcaRepository.save(marca);

        return mapToDTO(actualizada);
    }

    public void eliminar(Long id) {

        try {

            marcaRepository.deleteById(id);

        } catch (
                DataIntegrityViolationException ex
        ) {

            throw ex;
        }
    }

    private void validarDuplicado(
            String nombre
    ) {

        marcaRepository
                .findByNombreIgnoreCase(
                        nombre.trim()
                )
                .ifPresent(marca -> {

                    throw new BusinessException(
                            "La marca ya existe"
                    );
                });
    }

    private MarcaResponseDTO mapToDTO(
            Marca marca
    ) {

        return new MarcaResponseDTO(
                marca.getId(),
                marca.getNombre()
        );
    }
}