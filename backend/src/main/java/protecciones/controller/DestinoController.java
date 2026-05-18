package protecciones.controller;

import org.springframework.web.bind.annotation.*;
import protecciones.entity.Destino;
import protecciones.service.DestinoService;

import java.util.List;

@RestController
@RequestMapping("/api/destinos")
public class DestinoController {

    private final DestinoService destinoService;

    public DestinoController(DestinoService destinoService) {
        this.destinoService = destinoService;
    }

    @GetMapping
    public List<Destino> obtenerTodos() {
        return destinoService.obtenerTodos();
    }

    @PostMapping
    public Destino guardar(@RequestBody Destino destino) {
        return destinoService.guardar(destino);
    }
}