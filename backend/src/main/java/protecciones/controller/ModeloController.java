package protecciones.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.ModeloRequestDTO;
import protecciones.dto.ModeloResponseDTO;

import protecciones.service.ModeloService;

import java.util.List;

@RestController
@RequestMapping("/api/modelos")
public class ModeloController {

    private final ModeloService
            modeloService;

    public ModeloController(
            ModeloService modeloService
    ) {

        this.modeloService =
                modeloService;
    }

    @GetMapping
    public List<ModeloResponseDTO>
    obtenerTodos(

            @RequestParam(
                    required = false
            )
            Long marcaId
    ) {

        if (marcaId != null) {

            return modeloService
                    .obtenerPorMarca(
                            marcaId
                    );
        }

        return modeloService
                .obtenerTodos();
    }

    @PostMapping
    public ResponseEntity<ModeloResponseDTO>
    guardar(

            @Valid
            @RequestBody
            ModeloRequestDTO dto
    ) {

        ModeloResponseDTO response =
                modeloService.guardar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    public ModeloResponseDTO
    actualizar(

            @PathVariable
            Long id,

            @Valid
            @RequestBody
            ModeloRequestDTO dto
    ) {

        return modeloService
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

        modeloService.eliminar(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}