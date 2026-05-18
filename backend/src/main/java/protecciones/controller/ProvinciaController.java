package protecciones.controller;

import org.springframework.web.bind.annotation.*;
import protecciones.entity.Provincia;
import protecciones.service.ProvinciaService;

import java.util.List;

@RestController
@RequestMapping("/api/provincias")
public class ProvinciaController {

    private final ProvinciaService provinciaService;

    public ProvinciaController(ProvinciaService provinciaService) {
        this.provinciaService = provinciaService;
    }

    @GetMapping
    public List<Provincia> obtenerTodas() {
        return provinciaService.obtenerTodas();
    }

    @PostMapping
    public Provincia guardar(@RequestBody Provincia provincia) {
        return provinciaService.guardar(provincia);
    }
}