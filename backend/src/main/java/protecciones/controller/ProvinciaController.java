package protecciones.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.ProvinciaRequestDTO;
import protecciones.dto.ProvinciaResponseDTO;

import protecciones.service.ProvinciaService;

import java.util.List;

@RestController
@RequestMapping("/api/provincias")
public class ProvinciaController {

    private final ProvinciaService
            provinciaService;

    public ProvinciaController(
            ProvinciaService provinciaService
    ) {

        this.provinciaService =
                provinciaService;
    }

    @GetMapping
    public List<ProvinciaResponseDTO>
    obtenerTodas() {

        return provinciaService
                .obtenerTodas();
    }

    @PostMapping
    public ResponseEntity<
            ProvinciaResponseDTO
    >
    guardar(

            @Valid
            @RequestBody
            ProvinciaRequestDTO dto
    ) {

        ProvinciaResponseDTO response =
                provinciaService
                        .guardar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    public ProvinciaResponseDTO
    actualizar(

            @PathVariable Long id,

            @Valid
            @RequestBody
            ProvinciaRequestDTO dto
    ) {

        return provinciaService
                .actualizar(
                        id,
                        dto
                );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    eliminar(
            @PathVariable Long id
    ) {

        provinciaService
                .eliminar(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}