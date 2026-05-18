package protecciones.controller;

import org.springframework.web.bind.annotation.*;
import protecciones.entity.Localidad;
import protecciones.service.LocalidadService;

import java.util.List;

@RestController
@RequestMapping("/api/localidades")
public class LocalidadController {

    private final LocalidadService localidadService;

    public LocalidadController(LocalidadService localidadService) {
        this.localidadService = localidadService;
    }

    @GetMapping
    public List<Localidad> obtenerTodas() {
        return localidadService.obtenerTodas();
    }

    @PostMapping
    public Localidad guardar(@RequestBody Localidad localidad) {
        return localidadService.guardar(localidad);
    }
}