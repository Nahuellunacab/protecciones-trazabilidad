package protecciones.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.PosicionRequestDTO;
import protecciones.dto.PosicionResponseDTO;

import protecciones.service.PosicionService;

import java.util.List;

@RestController
@RequestMapping("/api/posiciones")
public class PosicionController {

    private final PosicionService
            posicionService;

    public PosicionController(
            PosicionService posicionService
    ) {

        this.posicionService =
                posicionService;
    }

    @GetMapping
    public List<PosicionResponseDTO>
    obtenerTodas() {

        return posicionService
                .obtenerTodos();
    }

    @GetMapping("/destino/{destinoId}")
        public List<PosicionResponseDTO>
        obtenerPorDestino(
                @PathVariable Long destinoId
        ) {

        return posicionService
                .obtenerPorDestino(
                        destinoId
                );
        }

    @PostMapping
    public ResponseEntity<PosicionResponseDTO>
    guardar(

            @Valid
            @RequestBody
            PosicionRequestDTO dto
    ) {

        PosicionResponseDTO response =
                posicionService
                        .guardar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    public PosicionResponseDTO actualizar(

            @PathVariable Long id,

            @Valid
            @RequestBody
            PosicionRequestDTO dto
    ) {

        return posicionService
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

        posicionService
                .eliminar(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}