package protecciones.service;

import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.stereotype.Service;

import protecciones.dto.PosicionRequestDTO;
import protecciones.dto.PosicionResponseDTO;

import protecciones.entity.Destino;
import protecciones.entity.Posicion;

import protecciones.exception.BusinessException;

import protecciones.repository.DestinoRepository;
import protecciones.repository.PosicionRepository;

import java.util.List;

@Service
public class PosicionService {

    private final PosicionRepository
            posicionRepository;

    private final DestinoRepository
            destinoRepository;

    public PosicionService(
            PosicionRepository posicionRepository,
            DestinoRepository destinoRepository
    ) {

        this.posicionRepository =
                posicionRepository;

        this.destinoRepository =
                destinoRepository;
    }

    public List<PosicionResponseDTO>
    obtenerTodos() {

        return posicionRepository
                .findAllByOrderByNombreAsc()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public PosicionResponseDTO guardar(
            PosicionRequestDTO dto
    ) {

        validarDuplicado(
                dto.getNombre(),
                dto.getDestinoId()
        );

        Destino destino =
                destinoRepository
                        .findById(
                                dto.getDestinoId()
                        )
                        .orElseThrow();

        Posicion posicion =
                new Posicion();

        posicion.setNombre(
                dto.getNombre().trim()
        );

        posicion.setDestino(
                destino
        );

        Posicion guardada =
                posicionRepository.save(
                        posicion
                );

        return mapToDTO(
                guardada
        );
    }

    public PosicionResponseDTO actualizar(
            Long id,
            PosicionRequestDTO dto
    ) {

        Posicion posicion =
                posicionRepository
                        .findById(id)
                        .orElseThrow();

        posicionRepository
                .findByNombreIgnoreCaseAndDestinoId(

                        dto.getNombre(),
                        dto.getDestinoId()
                )
                .ifPresent(existente -> {

                    if (!existente.getId()
                            .equals(id)) {

                        throw new BusinessException(
                                "La posición ya existe en ese destino"
                        );
                    }
                });

        Destino destino =
                destinoRepository
                        .findById(
                                dto.getDestinoId()
                        )
                        .orElseThrow();

        posicion.setNombre(
                dto.getNombre().trim()
        );

        posicion.setDestino(
                destino
        );

        Posicion actualizada =
                posicionRepository.save(
                        posicion
                );

        return mapToDTO(
                actualizada
        );
    }

    public void eliminar(
            Long id
    ) {

        try {

            posicionRepository
                    .deleteById(id);

        } catch (
                DataIntegrityViolationException ex
        ) {

            throw new BusinessException(
                    "No se puede eliminar la posición porque tiene movimientos asociados"
            );
        }
    }

    private void validarDuplicado(

            String nombre,
            Long destinoId
    ) {

        posicionRepository
                .findByNombreIgnoreCaseAndDestinoId(

                        nombre.trim(),
                        destinoId
                )
                .ifPresent(posicion -> {

                    throw new BusinessException(
                            "La posición ya existe en ese destino"
                    );
                });
    }

    private PosicionResponseDTO
    mapToDTO(
            Posicion posicion
    ) {

        return new PosicionResponseDTO(

                posicion.getId(),

                posicion.getNombre(),

                posicion.getDestino()
                        .getNombre()
        );
    }
}