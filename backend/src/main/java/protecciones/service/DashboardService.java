package protecciones.service;

import org.springframework.stereotype.Service;

import protecciones.dto.MovimientoResponseDTO;
import protecciones.dto.dashboard.DashboardKpiDTO;

import protecciones.entity.Movimiento;

import protecciones.repository.MovimientoRepository;
import protecciones.repository.ReleRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardService {

    private final ReleRepository
            releRepository;

    private final MovimientoRepository
            movimientoRepository;

    private final MovimientoService
            movimientoService;

    public DashboardService(
            ReleRepository releRepository,
            MovimientoRepository movimientoRepository,
            MovimientoService movimientoService
    ) {

        this.releRepository =
                releRepository;

        this.movimientoRepository =
                movimientoRepository;

        this.movimientoService =
                movimientoService;
    }

    public DashboardKpiDTO
    obtenerKpis() {

        long activos =
                releRepository
                        .countByActivoTrue();

        long baja =
                releRepository
                        .countByActivoFalse();

        long garantiasVencidas =
                releRepository
                        .countByFinGarantiaBefore(
                                LocalDate.now()
                        );

        long instalados = 0;

        long reparacion = 0;

        long ensayo = 0;

        List<Movimiento> movimientos =
                movimientoRepository.findAll();

        for (Movimiento mov : movimientos) {

            String estado =
                    mov.getEstado()
                            .getNombre();

            if ("INSTALADO".equalsIgnoreCase(
                    estado
            )) {

                instalados++;
            }

            if ("EN REPARACION".equalsIgnoreCase(
                    estado
            )) {

                reparacion++;
            }

            if ("EN ENSAYO".equalsIgnoreCase(
                    estado
            )) {

                ensayo++;
            }
        }

        return new DashboardKpiDTO(

                activos,

                baja,

                instalados,

                reparacion,

                ensayo,

                garantiasVencidas
        );
    }

    public List<MovimientoResponseDTO>
    obtenerUltimosMovimientos() {

        return movimientoRepository
                .findTop10ByOrderByFechaMovimientoDesc()
                .stream()
                .map(movimientoService::mapToDTO)
                .toList();
    }
}