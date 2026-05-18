package protecciones.service;

import org.springframework.stereotype.Service;
import protecciones.entity.Provincia;
import protecciones.repository.ProvinciaRepository;

import java.util.List;

@Service
public class ProvinciaService {

    private final ProvinciaRepository provinciaRepository;

    public ProvinciaService(ProvinciaRepository provinciaRepository) {
        this.provinciaRepository = provinciaRepository;
    }

    public List<Provincia> obtenerTodas() {
        return provinciaRepository.findAll();
    }

    public Provincia guardar(Provincia provincia) {
        return provinciaRepository.save(provincia);
    }
}