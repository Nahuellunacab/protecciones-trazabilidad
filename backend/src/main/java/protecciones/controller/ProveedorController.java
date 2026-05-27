package protecciones.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.ProveedorRequestDTO;
import protecciones.dto.ProveedorResponseDTO;

import protecciones.service.ProveedorService;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {

    private final ProveedorService
            proveedorService;

    public ProveedorController(
            ProveedorService proveedorService
    ) {

        this.proveedorService =
                proveedorService;
    }

    @GetMapping
    public List<ProveedorResponseDTO>
    obtenerTodos() {

        return proveedorService
                .obtenerTodos();
    }

    @PostMapping
    public ResponseEntity<
            ProveedorResponseDTO
    >
    guardar(

            @Valid
            @RequestBody
            ProveedorRequestDTO dto
    ) {

        ProveedorResponseDTO response =
                proveedorService
                        .guardar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    public ProveedorResponseDTO
    actualizar(

            @PathVariable Long id,

            @Valid
            @RequestBody
            ProveedorRequestDTO dto
    ) {

        return proveedorService
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

        proveedorService
                .eliminar(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}