package protecciones.controller;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import protecciones.dto.MovimientoRequestDTO;
import protecciones.dto.MovimientoResponseDTO;
import protecciones.service.MovimientoService;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/movimientos")
public class MovimientoController {

    private final MovimientoService
            movimientoService;

    public MovimientoController(
            MovimientoService movimientoService
    ) {

        this.movimientoService =
                movimientoService;
    }

    @GetMapping
    public List<MovimientoResponseDTO>
    obtenerTodos() {

        return movimientoService
                .obtenerTodos();
    }

    @PostMapping
    public MovimientoResponseDTO guardar(
            @Valid
            @RequestBody
            MovimientoRequestDTO dto
    ) {

        return movimientoService
                .guardar(dto);
    }


@GetMapping("/exportar")
public ResponseEntity<byte[]> exportarExcel() {

    byte[] excel =
            movimientoService.exportarExcel();

    return ResponseEntity.ok()

            .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=movimientos.xlsx"
            )

            .contentType(
                    MediaType.APPLICATION_OCTET_STREAM
            )

            .body(excel);
}
}