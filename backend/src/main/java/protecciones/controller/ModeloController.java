package protecciones.controller;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.ModeloResponseDTO;
import protecciones.service.ModeloService;

import java.util.List;

@RestController
@RequestMapping("/api/modelos")
public class ModeloController {

    private final ModeloService modeloService;

    public ModeloController(
            ModeloService modeloService
    ) {

        this.modeloService = modeloService;
    }

    @GetMapping
    public List<ModeloResponseDTO>
    obtenerTodos(
            @RequestParam(required = false)
            Long marcaId
    ) {

        if (marcaId != null) {

            return modeloService
                    .obtenerPorMarca(marcaId);
        }

        return modeloService.obtenerTodos();
    }
}