package protecciones.controller;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.UsuarioRequestDTO;
import protecciones.dto.UsuarioResponseDTO;

import protecciones.service.UsuarioService;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(
            UsuarioService usuarioService
    ) {

        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<UsuarioResponseDTO>
    obtenerTodos() {

        return usuarioService.obtenerTodos();
    }

    @GetMapping("/paginado")
    public Page<UsuarioResponseDTO>
    obtenerPaginados(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "id,asc")
            String sort,

            @RequestParam(defaultValue = "")
            String texto,

            @RequestParam(defaultValue = "ACTIVOS")
            String filtroEstado,

            @RequestParam(required = false)
            String rol
    ) {

        return usuarioService.obtenerPaginados(
                page,
                size,
                sort,
                texto,
                filtroEstado,
                rol
        );
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO>
    guardar(
            @Valid
            @RequestBody
            UsuarioRequestDTO dto
    ) {

        UsuarioResponseDTO response =
                usuarioService.guardar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    public UsuarioResponseDTO actualizar(
            @PathVariable Long id,

            @Valid
            @RequestBody
            UsuarioRequestDTO dto
    ) {

        return usuarioService.actualizar(
                id,
                dto
        );
    }
}
