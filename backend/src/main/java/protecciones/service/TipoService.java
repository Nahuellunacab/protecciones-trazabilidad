package protecciones.service;

import org.springframework.stereotype.Service;

import protecciones.dto.TipoResponseDTO;

import protecciones.entity.Tipo;

import protecciones.repository.TipoRepository;

import java.util.List;

@Service
public class TipoService {

    private final TipoRepository
            tipoRepository;

    public TipoService(
            TipoRepository tipoRepository
    ) {

        this.tipoRepository =
                tipoRepository;
    }

    public List<TipoResponseDTO>
    obtenerTodos() {

        return tipoRepository
                .findAllByOrderByNombreAsc()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    private TipoResponseDTO
    mapToDTO(
            Tipo tipo
    ) {

        return new TipoResponseDTO(

                tipo.getId(),

                tipo.getNombre()
        );
    }
}