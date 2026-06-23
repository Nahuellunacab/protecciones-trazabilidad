package protecciones.service;

import org.springframework.stereotype.Service;

import protecciones.dto.MovimientoResponseDTO;
import protecciones.dto.dashboard.DashboardKpiDTO;
import protecciones.entity.Movimiento;
import protecciones.repository.MovimientoRepository;
import protecciones.repository.ReleRepository;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

        long enStock = 0;

        List<Movimiento> movimientos =
        movimientoRepository
                .findAllByOrderByFechaMovimientoDesc();

        Set<Long> procesados =
                new HashSet<>();

        for (Movimiento mov : movimientos) {

            Long releId =
                    mov.getRele()
                            .getId();

            if (
                    procesados.contains(
                            releId
                    )
            ) {

                continue;
            }

            procesados.add(
                    releId
            );

            String estado =
                    mov.getEstado()
                            .getNombre();

            if (
                    "INSTALADO"
                            .equalsIgnoreCase(
                                    estado
                            )
            ) {

                instalados++;
            }

            if (
                    "EN REPARACION"
                            .equalsIgnoreCase(
                                    estado
                            )
            ) {

                reparacion++;
            }

            if (
                    "EN ENSAYO"
                            .equalsIgnoreCase(
                                    estado
                            )
            ) {

                ensayo++;
            }

            if (
                    "EN STOCK"
                            .equalsIgnoreCase(
                                    estado
                            )
            ) {

                enStock++;
            }
        }

        return new DashboardKpiDTO(

                activos,

                enStock,

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