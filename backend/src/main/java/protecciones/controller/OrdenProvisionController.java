package protecciones.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.OrdenProvisionRequestDTO;
import protecciones.dto.OrdenProvisionResponseDTO;

import protecciones.service.OrdenProvisionService;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes-provision")
public class OrdenProvisionController {

    private final OrdenProvisionService
            ordenProvisionService;

    public OrdenProvisionController(
            OrdenProvisionService ordenProvisionService
    ) {

        this.ordenProvisionService =
                ordenProvisionService;
    }

    @GetMapping
    public List<OrdenProvisionResponseDTO>
    obtenerTodos() {

        return ordenProvisionService
                .obtenerTodos();
    }

    @PostMapping
    public ResponseEntity<
            OrdenProvisionResponseDTO
    >
    guardar(

            @Valid
            @RequestBody
            OrdenProvisionRequestDTO dto
    ) {

        OrdenProvisionResponseDTO response =
                ordenProvisionService
                        .guardar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    public OrdenProvisionResponseDTO
    actualizar(

            @PathVariable Long id,

            @Valid
            @RequestBody
            OrdenProvisionRequestDTO dto
    ) {

        return ordenProvisionService
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

        ordenProvisionService
                .eliminar(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}