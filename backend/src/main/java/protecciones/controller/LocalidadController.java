package protecciones.controller;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.LocalidadResponseDTO;

import protecciones.service.LocalidadService;

import java.util.List;

@RestController
@RequestMapping("/api/localidades")
public class LocalidadController {

    private final LocalidadService
            localidadService;

    public LocalidadController(
            LocalidadService localidadService
    ) {

        this.localidadService =
                localidadService;
    }

    @GetMapping
    public List<LocalidadResponseDTO>
    obtenerTodas() {

        return localidadService
                .obtenerTodas();
    }
}