package protecciones.controller;

import org.springframework.web.bind.annotation.*;
import protecciones.entity.Estado;
import protecciones.service.EstadoService;

import java.util.List;

@RestController
@RequestMapping("/api/estados")
public class EstadoController {

    private final EstadoService estadoService;

    public EstadoController(EstadoService estadoService) {
        this.estadoService = estadoService;
    }

    @GetMapping
    public List<Estado> obtenerTodos() {
        return estadoService.obtenerTodos();
    }

    @PostMapping
    public Estado guardar(@RequestBody Estado estado) {
        return estadoService.guardar(estado);
    }
}