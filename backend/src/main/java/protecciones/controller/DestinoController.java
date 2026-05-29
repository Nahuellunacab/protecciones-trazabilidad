package protecciones.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.DestinoRequestDTO;
import protecciones.dto.DestinoResponseDTO;

import protecciones.service.DestinoService;

import java.util.List;

@RestController
@RequestMapping("/api/destinos")
public class DestinoController {

    private final DestinoService
            destinoService;

    public DestinoController(
            DestinoService destinoService
    ) {

        this.destinoService =
                destinoService;
    }

    @GetMapping
    public List<DestinoResponseDTO>
    obtenerTodos() {

        return destinoService
                .obtenerTodos();
    }

    @GetMapping("/localidad/{localidadId}")
        public List<DestinoResponseDTO>
        obtenerPorLocalidad(
                @PathVariable Long localidadId
        ) {

        return destinoService
                .obtenerPorLocalidad(
                        localidadId
                );
        }

    @PostMapping
    public ResponseEntity<
            DestinoResponseDTO
    >
    guardar(

            @Valid
            @RequestBody
            DestinoRequestDTO dto
    ) {

        DestinoResponseDTO response =
                destinoService.guardar(
                        dto
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    public DestinoResponseDTO
    actualizar(

            @PathVariable
            Long id,

            @Valid
            @RequestBody
            DestinoRequestDTO dto
    ) {

        return destinoService
                .actualizar(
                        id,
                        dto
                );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    eliminar(

            @PathVariable
            Long id
    ) {

        destinoService.eliminar(
                id
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}