package protecciones.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.LocalidadRequestDTO;
import protecciones.dto.LocalidadResponseDTO;

import protecciones.service.LocalidadService;

import java.util.List;

@RestController
@RequestMapping("/api/localidades")
public class LocalidadController {

    private final LocalidadService
            localidadService;

    public LocalidadController(
            LocalidadService localidadService
    ) {

        this.localidadService =
                localidadService;
    }

    @GetMapping
    public List<LocalidadResponseDTO>
    obtenerTodas() {

        return localidadService
                .obtenerTodas();
    }

    @PostMapping
    public ResponseEntity<
            LocalidadResponseDTO
    >
    guardar(

            @Valid
            @RequestBody
            LocalidadRequestDTO dto
    ) {

        LocalidadResponseDTO response =
                localidadService
                        .guardar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    public LocalidadResponseDTO
    actualizar(

            @PathVariable Long id,

            @Valid
            @RequestBody
            LocalidadRequestDTO dto
    ) {

        return localidadService
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

        localidadService
                .eliminar(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}