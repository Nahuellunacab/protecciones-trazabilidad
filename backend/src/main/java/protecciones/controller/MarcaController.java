package protecciones.controller;

import org.springframework.web.bind.annotation.*;
import protecciones.entity.Marca;
import protecciones.service.MarcaService;

import java.util.List;

@RestController
@RequestMapping("/api/marcas")
public class MarcaController {

    private final MarcaService marcaService;

    public MarcaController(MarcaService marcaService) {
        this.marcaService = marcaService;
    }

    @GetMapping
    public List<Marca> obtenerTodas() {
        return marcaService.obtenerTodas();
    }

    @PostMapping
    public Marca guardar(@RequestBody Marca marca) {
        return marcaService.guardar(marca);
    }
}