package protecciones.controller;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.TipoResponseDTO;

import protecciones.service.TipoService;

import java.util.List;

@RestController
@RequestMapping("/api/tipos")
public class TipoController {

    private final TipoService
            tipoService;

    public TipoController(
            TipoService tipoService
    ) {

        this.tipoService =
                tipoService;
    }

    @GetMapping
    public List<TipoResponseDTO>
    obtenerTodos() {

        return tipoService
                .obtenerTodos();
    }
}