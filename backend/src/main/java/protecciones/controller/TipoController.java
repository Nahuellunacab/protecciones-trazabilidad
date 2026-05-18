package protecciones.controller;

import org.springframework.web.bind.annotation.*;
import protecciones.entity.Tipo;
import protecciones.service.TipoService;

import java.util.List;

@RestController // Anotación que indica que esta clase es un controlador REST en el contexto de Spring, lo que permite manejar solicitudes HTTP y enviar respuestas en formato JSON.
@RequestMapping("/api/tipos") // Anotación que define la ruta base para todas las solicitudes manejadas por este controlador. En este caso, todas las rutas comenzarán con "/api/tipos".
public class TipoController {

    private final TipoService tipoService;

    public TipoController(TipoService tipoService) {
        this.tipoService = tipoService;
    }

    @GetMapping
    public List<Tipo> obtenerTodos() {
        return tipoService.obtenerTodos();
    }

    @PostMapping
    public Tipo guardar(@RequestBody Tipo tipo) {
        return tipoService.guardar(tipo);
    }
}