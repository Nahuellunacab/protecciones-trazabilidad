package protecciones.controller;
import org.springframework.web.bind.annotation.*;
import protecciones.dto.MovimientoResponseDTO;
import protecciones.dto.dashboard.DashboardKpiDTO;
import protecciones.service.DashboardService;
import java.util.List;
import protecciones.dto.dashboard.MarcaCantidadDTO;

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

    @GetMapping("/movimientos")
    public List<MovimientoResponseDTO>
    obtenerUltimosMovimientos() {

        return dashboardService
                .obtenerUltimosMovimientos();
    }

    @GetMapping("/marcas")
        public List<MarcaCantidadDTO>
        obtenerRelesPorMarca() {

        return dashboardService
                .obtenerRelesPorMarca();
        }
}