package protecciones.controller;

import org.springframework.web.bind.annotation.*;
import protecciones.entity.Posicion;
import protecciones.service.PosicionService;

import java.util.List;

@RestController
@RequestMapping("/api/posiciones")
public class PosicionController {

    private final PosicionService posicionService;

    public PosicionController(PosicionService posicionService) {
        this.posicionService = posicionService;
    }

    @GetMapping
    public List<Posicion> obtenerTodos() {
        return posicionService.obtenerTodos();
    }

    @PostMapping
    public Posicion guardar(@RequestBody Posicion posicion) {
        return posicionService.guardar(posicion);
    }
}