package protecciones.service;

import org.springframework.stereotype.Service;

import protecciones.dto.EstadoResponseDTO;

import protecciones.repository.EstadoRepository;

import java.util.List;

@Service
public class EstadoService {

    private final EstadoRepository
            estadoRepository;

    public EstadoService(
            EstadoRepository estadoRepository
    ) {

        this.estadoRepository =
                estadoRepository;
    }

    public List<EstadoResponseDTO>
    obtenerTodos() {

        return estadoRepository
                .findAll()
                .stream()
                .map(estado ->

                    new EstadoResponseDTO(

                        estado.getId(),

                        estado.getNombre()
                    )
                )
                .toList();
    }
}