package protecciones.service;

import org.springframework.stereotype.Service;
import protecciones.entity.Estado;
import protecciones.repository.EstadoRepository;

import java.util.List;

@Service
public class EstadoService {

    private final EstadoRepository estadoRepository;

    public EstadoService(EstadoRepository estadoRepository) {
        this.estadoRepository = estadoRepository;
    }

    public List<Estado> obtenerTodos() {
        return estadoRepository.findAll();
    }

    public Estado guardar(Estado estado) {
        return estadoRepository.save(estado);
    }
}