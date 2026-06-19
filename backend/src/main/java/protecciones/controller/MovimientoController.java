package protecciones.controller;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import protecciones.dto.MovimientoRequestDTO;
import protecciones.dto.MovimientoResponseDTO;
import protecciones.service.MovimientoService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.time.LocalDate;
import org.springframework.web.bind.annotation.RequestParam;

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
public ResponseEntity<byte[]> exportarExcel(

        @RequestParam(required = false)
        LocalDate desde,

        @RequestParam(required = false)
        LocalDate hasta
) {

    byte[] excel =
            movimientoService.exportarExcel(
                    desde,
                    hasta
            );

    return ResponseEntity.ok()

            .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=movimientos.xlsx"
            )

            .body(excel);
}
}