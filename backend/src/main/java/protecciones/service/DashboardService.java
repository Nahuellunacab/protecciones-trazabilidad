package protecciones.service;

import org.springframework.stereotype.Service;

import protecciones.dto.MovimientoResponseDTO;
import protecciones.dto.dashboard.DashboardKpiDTO;
import protecciones.dto.dashboard.MarcaCantidadDTO;
import protecciones.dto.dashboard.ModeloCantidadDTO;

import protecciones.repository.MovimientoRepository;
import protecciones.repository.ReleRepository;
import protecciones.repository.RemitoRepository;
import protecciones.repository.OrdenProvisionRepository;

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

    private final RemitoRepository
            remitoRepository;

    private final OrdenProvisionRepository
            ordenProvisionRepository;

    public DashboardService(
            ReleRepository releRepository,
            MovimientoRepository movimientoRepository,
            MovimientoService movimientoService,
            RemitoRepository remitoRepository,
            OrdenProvisionRepository ordenProvisionRepository
    ) {

        this.releRepository =
                releRepository;

        this.movimientoRepository =
                movimientoRepository;

        this.movimientoService =
                movimientoService;

        this.remitoRepository =
                remitoRepository;

        this.ordenProvisionRepository =
                ordenProvisionRepository;
    }

    public DashboardKpiDTO
    obtenerKpis() {

        long totalReles =
                releRepository
                        .count();

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

        long relesSinDocumentacion =
                releRepository
                        .countSinDocumentacion();

        long remitosPendientes =
                remitoRepository
                        .countByAsociadoFalse();

        long ordenesPendientes =
                ordenProvisionRepository
                        .countByAsociadoFalse();

        long relesSinHistorial =
                releRepository
                        .countSinHistorial();

        long instalados = 0;

        long reparacion = 0;

        long ensayo = 0;

        long enStock = 0;

        List<Object[]> estadosActuales =
                movimientoRepository
                        .countUltimosMovimientosPorEstado();

        for (Object[] estadoActual : estadosActuales) {

            String estado =
                    (String) estadoActual[0];

            long cantidad =
                    (Long) estadoActual[1];

            if (
                    "INSTALADO"
                            .equalsIgnoreCase(
                                    estado
                            )
            ) {

                instalados =
                        cantidad;
            }

            if (
                    "EN REPARACION"
                            .equalsIgnoreCase(
                                    estado
                            )
            ) {

                reparacion =
                        cantidad;
            }

            if (
                    "EN ENSAYO"
                            .equalsIgnoreCase(
                                    estado
                            )
            ) {

                ensayo =
                        cantidad;
            }

            if (
                    "EN STOCK"
                            .equalsIgnoreCase(
                                    estado
                            )
            ) {

                enStock =
                        cantidad;
            }
        }

        return new DashboardKpiDTO(

                totalReles,

                activos,

                enStock,

                baja,

                instalados,

                reparacion,

                ensayo,

                garantiasVencidas,

                relesSinDocumentacion,

                remitosPendientes,

                ordenesPendientes,

                relesSinHistorial
        );
    }

    public List<MovimientoResponseDTO>
    obtenerUltimosMovimientos() {

        return movimientoRepository
                .findTop10ByOrderByFechaMovimientoDescIdDesc()
                .stream()
                .map(movimientoService::mapToDTO)
                .toList();
    }

    public List<MarcaCantidadDTO>
    obtenerRelesPorMarca() {

        return releRepository
                .contarRelesPorMarca();
    }

    public List<ModeloCantidadDTO>
    obtenerRelesPorModelo() {

        return releRepository
                .contarRelesPorModelo();
    }
}
