package protecciones.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import protecciones.dto.ReleRequestDTO;
import protecciones.dto.ReleResponseDTO;
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
    public List<ReleResponseDTO> obtenerTodos() {
        return releService.obtenerTodos();
    }

    @PostMapping
    public ReleResponseDTO guardar(@Valid @RequestBody ReleRequestDTO dto) {
        return releService.guardar(dto);
    }
}