package protecciones.service;

import org.springframework.stereotype.Service;

import protecciones.dto.LocalidadResponseDTO;

import protecciones.repository.LocalidadRepository;

import java.util.List;

@Service
public class LocalidadService {

    private final LocalidadRepository
            localidadRepository;

    public LocalidadService(
            LocalidadRepository localidadRepository
    ) {

        this.localidadRepository =
                localidadRepository;
    }

    public List<LocalidadResponseDTO>
    obtenerTodas() {

        return localidadRepository
                .findAll()
                .stream()
                .map(localidad ->

                        new LocalidadResponseDTO(

                                localidad.getId(),

                                localidad.getNombre(),

                                localidad.getProvincia()
                                        .getNombre()
                        )
                )
                .toList();
    }
}