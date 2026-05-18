package protecciones.controller;

import org.springframework.web.bind.annotation.*;
import protecciones.entity.Rele;
import protecciones.service.ReleService;

import java.util.List;

@RestController
@RequestMapping("/api/reles")
public class ReleController {

    private final ReleService releService;

    public ReleController(ReleService releService) {
        this.releService = releService;
    }

    @GetMapping
    public List<Rele> obtenerTodos() {
        return releService.obtenerTodos();
    }

    @PostMapping
    public Rele guardar(@RequestBody Rele rele) {
        return releService.guardar(rele);
    }
}