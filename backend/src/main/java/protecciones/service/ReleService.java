package protecciones.service;

import org.springframework.stereotype.Service;
import protecciones.entity.Rele;
import protecciones.repository.ReleRepository;

import java.util.List;

@Service
public class ReleService {

    private final ReleRepository releRepository;

    public ReleService(ReleRepository releRepository) {
        this.releRepository = releRepository;
    }

    public List<Rele> obtenerTodos() {
        return releRepository.findAll();
    }

    public Rele guardar(Rele rele) {
        return releRepository.save(rele);
    }
}