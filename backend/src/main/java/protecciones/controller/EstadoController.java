package protecciones.controller;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.EstadoResponseDTO;

import protecciones.service.EstadoService;

import java.util.List;

@RestController
@RequestMapping("/api/estados")
public class EstadoController {

    private final EstadoService
            estadoService;

    public EstadoController(
            EstadoService estadoService
    ) {

        this.estadoService =
                estadoService;
    }

    @GetMapping
    public List<EstadoResponseDTO>
    obtenerTodos() {

        return estadoService
                .obtenerTodos();
    }
}