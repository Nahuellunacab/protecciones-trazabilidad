package protecciones.controller;

import org.springframework.web.bind.annotation.*;
import protecciones.entity.Modelo;
import protecciones.service.ModeloService;

import java.util.List;

@RestController
@RequestMapping("/api/modelos")
public class ModeloController {

    private final ModeloService modeloService;

    public ModeloController(ModeloService modeloService) {
        this.modeloService = modeloService;
    }

    @GetMapping
    public List<Modelo> obtenerTodos() {
        return modeloService.obtenerTodos();
    }

    @PostMapping
    public Modelo guardar(@RequestBody Modelo modelo) {
        return modeloService.guardar(modelo);
    }
}