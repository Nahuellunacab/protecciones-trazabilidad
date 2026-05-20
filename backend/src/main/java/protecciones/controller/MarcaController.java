package protecciones.controller;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.MarcaResponseDTO;
import protecciones.service.MarcaService;

import java.util.List;

@RestController
@RequestMapping("/api/marcas")
public class MarcaController {

    private final MarcaService marcaService;

    public MarcaController(
            MarcaService marcaService
    ) {

        this.marcaService = marcaService;
    }

    @GetMapping
    public List<MarcaResponseDTO>
    obtenerTodas() {

        return marcaService.obtenerTodas();
    }
}