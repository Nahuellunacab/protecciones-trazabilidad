package protecciones.service;

import org.springframework.stereotype.Service;
import protecciones.entity.Destino;
import protecciones.repository.DestinoRepository;

import java.util.List;

@Service
public class DestinoService {

    private final DestinoRepository destinoRepository;

    public DestinoService(DestinoRepository destinoRepository) {
        this.destinoRepository = destinoRepository;
    }

    public List<Destino> obtenerTodos() {
        return destinoRepository.findAll();
    }

    public Destino guardar(Destino destino) {
        return destinoRepository.save(destino);
    }
}