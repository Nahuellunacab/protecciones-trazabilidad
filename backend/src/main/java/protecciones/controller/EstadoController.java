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

    @GetMapping("/transiciones/{releId}")
    public List<EstadoResponseDTO>
    obtenerEstadosPermitidos(
            @PathVariable Long releId
    ) {

        return estadoService
                .obtenerEstadosPermitidos(
                        releId
                );
    }
}