package protecciones.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.RemitoRequestDTO;
import protecciones.dto.RemitoResponseDTO;

import protecciones.service.RemitoService;

import java.util.List;

@RestController
@RequestMapping("/api/remitos")
public class RemitoController {

    private final RemitoService
            remitoService;

    public RemitoController(
            RemitoService remitoService
    ) {

        this.remitoService =
                remitoService;
    }

    @GetMapping
    public List<RemitoResponseDTO>
    obtenerTodos() {

        return remitoService
                .obtenerTodos();
    }

    @PostMapping
    public ResponseEntity<
            RemitoResponseDTO
    >
    guardar(

            @Valid
            @RequestBody
            RemitoRequestDTO dto
    ) {

        RemitoResponseDTO response =
                remitoService
                        .guardar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    public RemitoResponseDTO
    actualizar(

            @PathVariable Long id,

            @Valid
            @RequestBody
            RemitoRequestDTO dto
    ) {

        return remitoService
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

        remitoService
                .eliminar(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}