package protecciones.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.MarcaRequestDTO;
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

    @PostMapping
    public ResponseEntity<MarcaResponseDTO>
    guardar(
            @Valid
            @RequestBody
            MarcaRequestDTO dto
    ) {

        MarcaResponseDTO response =
                marcaService.guardar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    public MarcaResponseDTO actualizar(
            @PathVariable Long id,

            @Valid
            @RequestBody
            MarcaRequestDTO dto
    ) {

        return marcaService.actualizar(
                id,
                dto
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    eliminar(
            @PathVariable Long id
    ) {

        marcaService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}