package protecciones.service;

import org.springframework.stereotype.Service;
import protecciones.entity.Localidad;
import protecciones.repository.LocalidadRepository;

import java.util.List;

@Service
public class LocalidadService {

    private final LocalidadRepository localidadRepository;

    public LocalidadService(LocalidadRepository localidadRepository) {
        this.localidadRepository = localidadRepository;
    }

    public List<Localidad> obtenerTodas() {
        return localidadRepository.findAll();
    }

    public Localidad guardar(Localidad localidad) {
        return localidadRepository.save(localidad);
    }
}