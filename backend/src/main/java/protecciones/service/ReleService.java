package protecciones.service;

import org.springframework.stereotype.Service;

import protecciones.dto.MovimientoResponseDTO;
import protecciones.dto.ReleOptionDTO;
import protecciones.dto.ReleRequestDTO;
import protecciones.dto.ReleResponseDTO;

import protecciones.entity.Modelo;
import protecciones.entity.Movimiento;
import protecciones.entity.Rele;
import protecciones.entity.Remito;

import protecciones.repository.ModeloRepository;
import protecciones.repository.MovimientoRepository;
import protecciones.repository.ReleRepository;
import protecciones.repository.RemitoRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class ReleService {

    private final ReleRepository releRepository;

    private final ModeloRepository modeloRepository;

    private final RemitoRepository remitoRepository;

    private final MovimientoRepository movimientoRepository;

    public ReleService(
            ReleRepository releRepository,
            ModeloRepository modeloRepository,
            RemitoRepository remitoRepository,
            MovimientoRepository movimientoRepository
    ) {

        this.releRepository =
                releRepository;

        this.modeloRepository =
                modeloRepository;

        this.remitoRepository =
                remitoRepository;

        this.movimientoRepository =
                movimientoRepository;
    }

    public List<ReleResponseDTO>
    obtenerTodos() {

        return releRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public ReleResponseDTO guardar(
            ReleRequestDTO dto
    ) {

        Modelo modelo =
                modeloRepository.findById(
                        dto.getModeloId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Modelo no encontrado"
                        )
                );

        Remito remito = null;

        if (dto.getRemitoId() != null) {

            remito =
                    remitoRepository.findById(
                            dto.getRemitoId()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Remito no encontrado"
                            )
                    );
        }

        if (
                releRepository.existsByNumeroSerie(
                        dto.getNumeroSerie()
                )
        ) {

            throw new RuntimeException(
                    "Ya existe un relé con ese número de serie"
            );
        }

        Rele rele =
                new Rele();

        rele.setNumeroSerie(
                dto.getNumeroSerie()
        );

        rele.setModelo(
                modelo
        );

        rele.setRemito(
                remito
        );

        rele.setActivo(true);

        if (
                Boolean.TRUE.equals(
                        dto.getCargarGarantia()
                )
        ) {

            rele.setGarantiaMeses(
                    dto.getGarantiaMeses()
            );

            rele.setInicioGarantia(
                    dto.getInicioGarantia()
            );

            if (
                    dto.getInicioGarantia() != null
                            &&
                    dto.getGarantiaMeses() != null
            ) {

                rele.setFinGarantia(

                        dto.getInicioGarantia()
                                .plusMonths(
                                        dto.getGarantiaMeses()
                                )
                );
            }

        } else {

            rele.setGarantiaMeses(null);

            rele.setInicioGarantia(null);

            rele.setFinGarantia(null);
        }

        Rele releGuardado =
                releRepository.save(
                        rele
                );

        return mapToResponseDTO(
                releGuardado
        );
    }

    public ReleResponseDTO
    buscarPorNumeroSerie(
            String numeroSerie
    ) {

        Rele rele =
                releRepository.findByNumeroSerieAndActivoTrue(
                        numeroSerie
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Relé no encontrado"
                        )
                );

        return mapToResponseDTO(
                rele
        );
    }

    public List<MovimientoResponseDTO>
    obtenerHistorial(
            Long releId
    ) {

        return movimientoRepository
                .findByReleIdOrderByFechaMovimientoDesc(
                        releId
                )
                .stream()
                .map(this::mapMovimientoToDTO)
                .toList();
    }

    private ReleResponseDTO
    mapToResponseDTO(
            Rele rele
    ) {

        Modelo modelo =
                rele.getModelo();

        String tension = "";

        if (modelo != null) {

            Integer desde =
                    modelo.getTensionDesde();

            Integer hasta =
                    modelo.getTensionHasta();

            String tipo =
                    modelo.getTipoTension();

            if (
                    desde != null
                            &&
                    hasta != null
            ) {

                tension =
                        desde
                                + " - "
                                + hasta
                                + " "
                                + (
                                tipo != null
                                        ? tipo
                                        : ""
                        );

            } else if (desde != null) {

                tension =
                        desde
                                + " "
                                + (
                                tipo != null
                                        ? tipo
                                        : ""
                        );

            } else {

                tension =
                        tipo != null
                                ? tipo
                                : "";
            }
        }

        Long modeloId =
                modelo != null
                        ? modelo.getId()
                        : null;

        Long remitoId =
                rele.getRemito() != null
                        ? rele.getRemito().getId()
                        : null;

        String estadoActual = "-";
        String posicionActual = "-";
        String localidadActual = "-";

        Optional<Movimiento> ultimoMovimiento =
                movimientoRepository
                        .findTopByReleIdOrderByFechaMovimientoDesc(
                                rele.getId()
                        );

        if (ultimoMovimiento.isPresent()) {

            Movimiento movimiento =
                    ultimoMovimiento.get();

            estadoActual =
                    movimiento.getEstado()
                            .getNombre();

            posicionActual =
                    movimiento.getPosicion()
                            .getNombre();

            localidadActual =
                    movimiento.getPosicion()
                            .getDestino()
                            .getNombre();
        }

        String estadoGarantia =
                "Sin garantía";

        Long mesesRestantesGarantia =
                null;

        if (rele.getFinGarantia() != null) {

            long mesesRestantes =
                    ChronoUnit.MONTHS.between(
                            LocalDate.now(),
                            rele.getFinGarantia()
                    );

            mesesRestantesGarantia =
                    mesesRestantes;

            if (mesesRestantes < 0) {

                estadoGarantia =
                        "VENCIDA";

            } else if (mesesRestantes <= 6) {

                estadoGarantia =
                        "POR VENCER";

            } else {

                estadoGarantia =
                        "VIGENTE";
            }
        }

        return new ReleResponseDTO(

                rele.getId(),

                rele.getNumeroSerie(),

                rele.getGarantiaMeses(),

                rele.getInicioGarantia(),

                rele.getFinGarantia(),

                modelo != null
                        ? modelo.getNombre()
                        : null,

                modelo != null
                        &&
                        modelo.getMarca() != null
                        ? modelo.getMarca()
                        .getNombre()
                        : null,

                tension,

                modelo != null
                        ? modelo.getTipo()
                        .getNombre()
                        : null,

                estadoActual,

                posicionActual,

                localidadActual,

                modeloId,

                remitoId,

                estadoGarantia,

                mesesRestantesGarantia,

                rele.getActivo(),

                rele.getMotivoBaja(),

                rele.getFechaBaja()
        );
    }

    public MovimientoResponseDTO
    obtenerEstadoActual(
            Long releId
    ) {

        Movimiento movimiento =
                movimientoRepository
                        .findTopByReleIdOrderByFechaMovimientoDesc(
                                releId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "El relé no tiene movimientos"
                                )
                        );

        return mapMovimientoToDTO(
                movimiento
        );
    }

    public List<ReleResponseDTO>
    obtenerPorEstadoActual(
            String estadoNombre
    ) {

        return releRepository.findAll()
                .stream()
                .filter(rele ->

                        movimientoRepository
                                .findTopByReleIdOrderByFechaMovimientoDesc(
                                        rele.getId()
                                )
                                .map(movimiento ->

                                        movimiento.getEstado()
                                                .getNombre()
                                                .equalsIgnoreCase(
                                                        estadoNombre
                                                )
                                )
                                .orElse(false)
                )
                .map(this::mapToResponseDTO)
                .toList();
    }

    public Page<ReleResponseDTO>
    obtenerPaginados(
            int page,
            int size,
            String sort
    ) {

        String[] sortParams =
                sort.split(",");

        String campo =
                sortParams[0];

        Sort.Direction direccion =
                sortParams.length > 1
                        &&
                        sortParams[1]
                                .equalsIgnoreCase(
                                        "desc"
                                )
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        Pageable pageable =
                PageRequest.of(

                        page,

                        size,

                        Sort.by(
                                direccion,
                                campo
                        )
                );

        return releRepository
                .findAll(pageable)
                .map(this::mapToResponseDTO);
    }

    public List<ReleResponseDTO>
    buscarPorSerialParcial(
            String serial
    ) {

        return releRepository
                .findByNumeroSerieContainingIgnoreCaseAndActivoTrue(
                        serial
                )
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public List<ReleOptionDTO>
    obtenerOpciones() {

        return releRepository
                .findByActivoTrue()
                .stream()
                .map(rele ->

                        new ReleOptionDTO(

                                rele.getId(),

                                rele.getNumeroSerie(),

                                rele.getModelo()
                                        .getNombre(),

                                rele.getModelo()
                                        .getMarca()
                                        .getNombre(),

                                mapToResponseDTO(rele)
                                        .getTension()
                        )
                )
                .toList();
    }

    public ReleResponseDTO actualizar(
            Long id,
            ReleRequestDTO dto
    ) {

        Rele rele =
                releRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Relé no encontrado"
                                )
                        );

        if (
                releRepository.existsByNumeroSerieAndIdNot(
                        dto.getNumeroSerie(),
                        id
                )
        ) {

            throw new RuntimeException(
                    "Ya existe un relé con ese número de serie"
            );
        }

        Modelo modelo =
                modeloRepository.findById(
                        dto.getModeloId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Modelo no encontrado"
                        )
                );

        Remito remito = null;

        if (dto.getRemitoId() != null) {

            remito =
                    remitoRepository.findById(
                            dto.getRemitoId()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Remito no encontrado"
                            )
                    );
        }

        rele.setNumeroSerie(
                dto.getNumeroSerie()
        );

        rele.setModelo(modelo);

        rele.setRemito(remito);

        if (
                Boolean.TRUE.equals(
                        dto.getCargarGarantia()
                )
        ) {

            rele.setGarantiaMeses(
                    dto.getGarantiaMeses()
            );

            rele.setInicioGarantia(
                    dto.getInicioGarantia()
            );

            if (
                    dto.getInicioGarantia() != null
                            &&
                    dto.getGarantiaMeses() != null
            ) {

                rele.setFinGarantia(
                        dto.getInicioGarantia()
                                .plusMonths(
                                        dto.getGarantiaMeses()
                                )
                );
            }

        } else {

            rele.setGarantiaMeses(null);

            rele.setInicioGarantia(null);

            rele.setFinGarantia(null);
        }

        Rele actualizado =
                releRepository.save(rele);

        return mapToResponseDTO(
                actualizado
        );
    }

    public void darDeBaja(
            Long id,
            String motivo
    ) {

        Rele rele =
                releRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Relé no encontrado"
                                )
                        );

        rele.setActivo(false);

        rele.setMotivoBaja(
                motivo.trim()
        );

        rele.setFechaBaja(
                LocalDateTime.now()
        );

        releRepository.save(rele);
    }

    private MovimientoResponseDTO
    mapMovimientoToDTO(
            Movimiento movimiento
    ) {

        return new MovimientoResponseDTO(

                movimiento.getId(),

                movimiento.getRele()
                        .getNumeroSerie(),

                movimiento.getRele()
                        .getModelo()
                        .getNombre(),

                movimiento.getRele()
                        .getModelo()
                        .getMarca()
                        .getNombre(),

                movimiento.getEstado()
                        .getNombre(),

                "",

                "",

                movimiento.getPosicion()
                        .getDestino()
                        .getNombre(),

                movimiento.getPosicion()
                        .getNombre(),

                movimiento.getUsuario() != null
                        ? movimiento.getUsuario()
                        .getNombre()
                        : null,

                movimiento.getFechaMovimiento(),

                movimiento.getNotas()
        );
    }
}