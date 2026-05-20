package protecciones.service;

import org.springframework.stereotype.Service;

import protecciones.dto.PosicionResponseDTO;

import protecciones.repository.PosicionRepository;

import java.util.List;

@Service
public class PosicionService {

    private final PosicionRepository
            posicionRepository;

    public PosicionService(
            PosicionRepository posicionRepository
    ) {

        this.posicionRepository =
                posicionRepository;
    }

    public List<PosicionResponseDTO>
    obtenerTodos() {

        return posicionRepository
                .findAll()
                .stream()
                .map(posicion ->

                    new PosicionResponseDTO(

                        posicion.getId(),

                        posicion.getNombre(),

                        posicion.getDestino()
                                .getNombre()
                    )
                )
                .toList();
    }
}