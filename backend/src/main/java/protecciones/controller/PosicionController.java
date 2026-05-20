package protecciones.controller;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.PosicionResponseDTO;

import protecciones.service.PosicionService;

import java.util.List;

@RestController
@RequestMapping("/api/posiciones")
public class PosicionController {

    private final PosicionService
            posicionService;

    public PosicionController(
            PosicionService posicionService
    ) {

        this.posicionService =
                posicionService;
    }

    @GetMapping
    public List<PosicionResponseDTO>
    obtenerTodos() {

        return posicionService
                .obtenerTodos();
    }
}