package protecciones.service;

import org.springframework.stereotype.Service;

import protecciones.dto.ModeloResponseDTO;
import protecciones.entity.Modelo;
import protecciones.repository.ModeloRepository;

import java.util.List;

@Service
public class ModeloService {

    private final ModeloRepository modeloRepository;

    public ModeloService(
            ModeloRepository modeloRepository
    ) {

        this.modeloRepository = modeloRepository;
    }

    public List<ModeloResponseDTO> obtenerTodos() {

        return modeloRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<ModeloResponseDTO>
    obtenerPorMarca(Long marcaId) {

        return modeloRepository
                .findByMarcaId(marcaId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    private ModeloResponseDTO mapToDTO(
            Modelo modelo
    ) {

        return new ModeloResponseDTO(

                modelo.getId(),

                modelo.getNombre(),

                modelo.getMarca()
                        .getNombre()
        );
    }
}