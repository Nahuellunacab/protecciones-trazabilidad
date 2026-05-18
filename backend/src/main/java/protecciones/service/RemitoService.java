package protecciones.service;

import org.springframework.stereotype.Service;
import protecciones.entity.Remito;
import protecciones.repository.RemitoRepository;

import java.util.List;

@Service
public class RemitoService {

    private final RemitoRepository remitoRepository;

    public RemitoService(RemitoRepository remitoRepository) {
        this.remitoRepository = remitoRepository;
    }

    public List<Remito> obtenerTodos() {
        return remitoRepository.findAll();
    }

    public Remito guardar(Remito remito) {
        return remitoRepository.save(remito);
    }
}