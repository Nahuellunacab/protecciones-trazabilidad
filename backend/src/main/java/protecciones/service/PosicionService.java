package protecciones.service;

import org.springframework.stereotype.Service;
import protecciones.entity.Posicion;
import protecciones.repository.PosicionRepository;

import java.util.List;

@Service
public class PosicionService {

    private final PosicionRepository posicionRepository;

    public PosicionService(PosicionRepository posicionRepository) {
        this.posicionRepository = posicionRepository;
    }

    public List<Posicion> obtenerTodos() {
        return posicionRepository.findAll();
    }

    public Posicion guardar(Posicion posicion) {
        return posicionRepository.save(posicion);
    }
}