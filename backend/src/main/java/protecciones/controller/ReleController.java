package protecciones.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import protecciones.dto.ReleRequestDTO;
import protecciones.dto.ReleResponseDTO;
import protecciones.service.ReleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/reles")
@Tag(name = "Relés", description = "Gestión de relés de protección")
public class ReleController {

    private final ReleService releService;

    public ReleController(ReleService releService) {
        this.releService = releService;
    }

    @GetMapping
    @Operation(summary = "Obtener todos los relés")
    public List<ReleResponseDTO> obtenerTodos() {
        return releService.obtenerTodos();
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo relé")
    public ReleResponseDTO guardar(@Valid @RequestBody ReleRequestDTO dto) {
        return releService.guardar(dto);
    }
}