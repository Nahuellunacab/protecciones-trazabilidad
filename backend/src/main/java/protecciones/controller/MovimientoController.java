package protecciones.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.MovimientoRequestDTO;
import protecciones.dto.MovimientoResponseDTO;

import protecciones.service.MovimientoService;

import java.util.List;

@RestController
@RequestMapping("/api/movimientos")
public class MovimientoController {

    private final MovimientoService
            movimientoService;

    public MovimientoController(
            MovimientoService movimientoService
    ) {

        this.movimientoService =
                movimientoService;
    }

    @GetMapping
    public List<MovimientoResponseDTO>
    obtenerTodos() {

        return movimientoService
                .obtenerTodos();
    }

    @PostMapping
    public MovimientoResponseDTO guardar(
            @Valid
            @RequestBody
            MovimientoRequestDTO dto
    ) {

        return movimientoService
                .guardar(dto);
    }
}