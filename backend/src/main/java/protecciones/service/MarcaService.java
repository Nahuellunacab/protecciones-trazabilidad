package protecciones.service;

import org.springframework.stereotype.Service;
import protecciones.entity.Marca;
import protecciones.repository.MarcaRepository;

import java.util.List;

@Service
public class MarcaService {

    private final MarcaRepository marcaRepository;

    public MarcaService(MarcaRepository marcaRepository) {
        this.marcaRepository = marcaRepository;
    }

    public List<Marca> obtenerTodas() {
        return marcaRepository.findAll();
    }

    public Marca guardar(Marca marca) {
        return marcaRepository.save(marca);
    }
}