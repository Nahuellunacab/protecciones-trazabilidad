package protecciones.controller;

import org.springframework.web.bind.annotation.*;
import protecciones.entity.Movimiento;
import protecciones.service.MovimientoService;

import java.util.List;

@RestController
@RequestMapping("/api/movimientos")
public class MovimientoController {

    private final MovimientoService movimientoService;

    public MovimientoController(MovimientoService movimientoService) {
        this.movimientoService = movimientoService;
    }

    @GetMapping
    public List<Movimiento> obtenerTodos() {
        return movimientoService.obtenerTodos();
    }

    @PostMapping
    public Movimiento guardar(@RequestBody Movimiento movimiento) {
        return movimientoService.guardar(movimiento);
    }
}