package protecciones.service;

import org.springframework.stereotype.Service;
import protecciones.entity.Modelo;
import protecciones.repository.ModeloRepository;

import java.util.List;

@Service
public class ModeloService {

    private final ModeloRepository modeloRepository;

    public ModeloService(ModeloRepository modeloRepository) {
        this.modeloRepository = modeloRepository;
    }

    public List<Modelo> obtenerTodos() {
        return modeloRepository.findAll();
    }

    public Modelo guardar(Modelo modelo) {
        return modeloRepository.save(modelo);
    }
}