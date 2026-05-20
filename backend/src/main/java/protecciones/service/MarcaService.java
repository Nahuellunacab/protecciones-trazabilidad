package protecciones.service;

import org.springframework.stereotype.Service;

import protecciones.dto.MarcaResponseDTO;
import protecciones.repository.MarcaRepository;

import java.util.List;

@Service
public class MarcaService {

    private final MarcaRepository marcaRepository;

    public MarcaService(
            MarcaRepository marcaRepository
    ) {

        this.marcaRepository = marcaRepository;
    }

    public List<MarcaResponseDTO>
    obtenerTodas() {

        return marcaRepository.findAll()
                .stream()
                .map(marca ->
                        new MarcaResponseDTO(
                                marca.getId(),
                                marca.getNombre()
                        )
                )
                .toList();
    }
}