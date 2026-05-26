package protecciones.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.MovimientoResponseDTO;
import protecciones.dto.ReleOptionDTO;
import protecciones.dto.ReleRequestDTO;
import protecciones.dto.ReleResponseDTO;

import protecciones.service.ReleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.data.domain.Page;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import protecciones.dto.BajaReleRequestDTO;

@RestController
@RequestMapping("/api/reles")
@Tag(name = "Relés", description = "Gestión de relés de protección")
public class ReleController {

    private final ReleService releService;

    public ReleController(ReleService releService) {
        this.releService = releService;
    }

    @GetMapping
    @Operation(summary = "Obtener relés paginados")
    public Page<ReleResponseDTO> obtenerTodos(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "id,asc")
            String sort) {

        return releService.obtenerPaginados(
                page,
                size,
                sort);
    }

    @GetMapping("/serial/{numeroSerie}")
    @Operation(summary = "Buscar relé por número de serie")
    public ReleResponseDTO buscarPorNumeroSerie(
            @PathVariable String numeroSerie) {

        return releService.buscarPorNumeroSerie(numeroSerie);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener relé por ID")
    public ReleResponseDTO obtenerPorId(
            @PathVariable Long id
    ) {

        return releService
                .obtenerPorId(id);
    }

    @GetMapping("/{id}/movimientos")
    @Operation(summary = "Obtener historial de movimientos del relé")
    public List<MovimientoResponseDTO> obtenerHistorial(
            @PathVariable Long id) {

        return releService.obtenerHistorial(id);
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo relé")
    public ResponseEntity<ReleResponseDTO> guardar(
            @Valid @RequestBody ReleRequestDTO dto) {

        ReleResponseDTO response = releService.guardar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{id}/estado-actual")
    @Operation(summary = "Obtener estado actual del relé")
    public MovimientoResponseDTO obtenerEstadoActual(
            @PathVariable Long id) {

        return releService.obtenerEstadoActual(id);
    }

    @GetMapping("/estado/{estado}")
    @Operation(summary = "Obtener relés por estado actual")
    public List<ReleResponseDTO> obtenerPorEstado(
            @PathVariable String estado) {

        return releService.obtenerPorEstadoActual(estado);
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar relés por número de serie")
    public List<ReleResponseDTO> buscarPorSerial(
            @RequestParam String serial) {

        return releService.buscarPorSerialParcial(serial);
    }

    @GetMapping("/opciones")
    public List<ReleOptionDTO>
    obtenerOpciones() {

        return releService
                .obtenerOpciones();
    }

    @PutMapping("/{id}")
    public ReleResponseDTO actualizar(
            @PathVariable Long id,
            @RequestBody ReleRequestDTO dto
    ) {

        return releService.actualizar(
                id,
                dto
        );
    }

    @PatchMapping("/{id}/baja")
    public ResponseEntity<Void>
    darDeBaja(

            @PathVariable
            Long id,

            @Valid
            @RequestBody
            BajaReleRequestDTO dto
    ) {

        releService.darDeBaja(
                id,
                dto.getMotivo()
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}