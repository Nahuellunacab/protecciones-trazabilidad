package protecciones.controller;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import protecciones.dto.MovimientoResponseDTO;
import protecciones.dto.dashboard.DashboardKpiDTO;
import protecciones.service.DashboardService;
import java.time.LocalDate;
import java.util.List;
import protecciones.dto.dashboard.DestinoCantidadDTO;
import protecciones.dto.dashboard.EstadoCantidadDTO;
import protecciones.dto.dashboard.MarcaCantidadDTO;
import protecciones.dto.dashboard.ModeloCantidadDTO;
import protecciones.dto.dashboard.ProveedorCantidadDTO;
import protecciones.dto.dashboard.ResumenIADTO;
import protecciones.dto.dashboard.UsuarioCantidadDTO;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService
            dashboardService;

    public DashboardController(
            DashboardService dashboardService
    ) {

        this.dashboardService =
                dashboardService;
    }

    @GetMapping("/kpis")
    public DashboardKpiDTO
    obtenerKpis() {

        return dashboardService
                .obtenerKpis();
    }

    @GetMapping("/resumen-ia")
    public ResumenIADTO
    obtenerResumenIA() {

        return dashboardService
                .obtenerResumenIA();
    }

    @GetMapping("/movimientos")
    public List<MovimientoResponseDTO>
    obtenerUltimosMovimientos(

            @RequestParam(required = false)
            Integer limite,

            @RequestParam(required = false)
            LocalDate desde,

            @RequestParam(required = false)
            LocalDate hasta
    ) {

        return dashboardService
                .obtenerUltimosMovimientos(
                        limite,
                        desde,
                        hasta
                );
    }

    @GetMapping("/marcas")
        public List<MarcaCantidadDTO>
        obtenerRelesPorMarca() {

        return dashboardService
                .obtenerRelesPorMarca();
        }

    @GetMapping("/modelos")
        public List<ModeloCantidadDTO>
        obtenerRelesPorModelo() {

        return dashboardService
                .obtenerRelesPorModelo();
        }

    @GetMapping("/estados")
    public List<EstadoCantidadDTO>
    obtenerRelesPorEstado() {

        return dashboardService
                .obtenerRelesPorEstado();
    }

    @GetMapping("/destinos")
    public List<DestinoCantidadDTO>
    obtenerRelesPorDestino() {

        return dashboardService
                .obtenerRelesPorDestino();
    }

    @GetMapping("/proveedores")
    public List<ProveedorCantidadDTO>
    obtenerRelesPorProveedor() {

        return dashboardService
                .obtenerRelesPorProveedor();
    }

    @GetMapping("/usuarios")
    public List<UsuarioCantidadDTO>
    obtenerMovimientosPorUsuario() {

        return dashboardService
                .obtenerMovimientosPorUsuario();
    }

    @GetMapping("/exportar")
    public ResponseEntity<byte[]>
    exportarResumen() {

        byte[] excel =
                dashboardService
                        .exportarResumen();

        return ResponseEntity.ok()

                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=dashboard.xlsx"
                )

                .body(excel);
    }

    @GetMapping("/exportar-pdf")
    public ResponseEntity<byte[]>
    exportarResumenPdf() {

        byte[] pdf =
                dashboardService
                        .exportarResumenPdf();

        return ResponseEntity.ok()

                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=dashboard.pdf"
                )

                .contentType(MediaType.APPLICATION_PDF)

                .body(pdf);
    }
}
