package protecciones.controller;

import org.springframework.web.bind.annotation.*;
import protecciones.entity.Remito;
import protecciones.service.RemitoService;

import java.util.List;

@RestController
@RequestMapping("/api/remitos")
public class RemitoController {

    private final RemitoService remitoService;

    public RemitoController(RemitoService remitoService) {
        this.remitoService = remitoService;
    }

    @GetMapping
    public List<Remito> obtenerTodos() {
        return remitoService.obtenerTodos();
    }

    @PostMapping
    public Remito guardar(@RequestBody Remito remito) {
        return remitoService.guardar(remito);
    }
}