package protecciones.service;
import org.springframework.stereotype.Service;
import protecciones.dto.MovimientoResponseDTO;
import protecciones.dto.ReleOptionDTO;
import protecciones.dto.ReleRequestDTO;
import protecciones.dto.ReleResponseDTO;
import protecciones.entity.Estado;
import protecciones.entity.Modelo;
import protecciones.entity.Movimiento;
import protecciones.entity.Posicion;
import protecciones.entity.Rele;
import protecciones.entity.Remito;
import protecciones.entity.Usuario;
import protecciones.repository.ModeloRepository;
import protecciones.repository.MovimientoRepository;
import protecciones.repository.ReleRepository;
import protecciones.repository.RemitoRepository;
import protecciones.repository.EstadoRepository;
import protecciones.repository.PosicionRepository;
import protecciones.repository.UsuarioRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import protecciones.entity.OrdenProvision;
import protecciones.repository.OrdenProvisionRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReleService {

    private final ReleRepository releRepository;

    private final ModeloRepository modeloRepository;

    private final RemitoRepository remitoRepository;

    private final OrdenProvisionRepository
        ordenProvisionRepository;

    private final MovimientoRepository movimientoRepository;

    private final EstadoRepository estadoRepository;

    private final PosicionRepository posicionRepository;

    private final UsuarioRepository usuarioRepository;

    public ReleService(
            ReleRepository releRepository,
            ModeloRepository modeloRepository,
            RemitoRepository remitoRepository,
            MovimientoRepository movimientoRepository,
            EstadoRepository estadoRepository,
            PosicionRepository posicionRepository,
            UsuarioRepository usuarioRepository,
            OrdenProvisionRepository ordenProvisionRepository
    ) {

        this.releRepository =
                releRepository;

        this.modeloRepository =
                modeloRepository;

        this.remitoRepository =
                remitoRepository;

        this.movimientoRepository =
                movimientoRepository;

        this.estadoRepository =
                estadoRepository;

        this.posicionRepository =
                posicionRepository;

        this.usuarioRepository =
                usuarioRepository;

        this.ordenProvisionRepository =
                ordenProvisionRepository;
    }

    public List<ReleResponseDTO>
        obtenerTodos() {

        List<Rele> reles =
                releRepository.findAll();

        Map<Long, Movimiento> ultimosMovimientos =
                movimientoRepository
                        .findUltimosMovimientos()
                        .stream()
                        .collect(
                                Collectors.toMap(
                                        movimiento ->
                                                movimiento.getRele().getId(),

                                        movimiento ->
                                                movimiento
                                )
                        );

        return reles.stream()
                .map(rele ->
                        mapToResponseDTO(
                                rele,
                                ultimosMovimientos.get(
                                        rele.getId()
                                )
                        )
                )
                .toList();
        }

    @Transactional
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

        OrdenProvision ordenProvision = null;

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
                dto.getOrdenProvisionId()
                != null
        ) {

        ordenProvision =
                ordenProvisionRepository
                        .findById(
                                dto.getOrdenProvisionId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Orden de provisión no encontrada"
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
                        .toUpperCase()
                        .trim()
        );

        rele.setCodigoConfiguracion(
                dto.getCodigoConfiguracion()
                        .toUpperCase()
                        .trim()
        );
        rele.setModelo(
                modelo
        );

        rele.setRemito(
                remito
        );

        rele.setOrdenProvision(
                ordenProvision
        );

        rele.setTipoIngreso(
                dto.getTipoIngreso()
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

        Estado estadoInicial =
                estadoRepository
                        .findByNombreIgnoreCase(
                                "EN STOCK"
                        )
                        .orElseThrow(() ->

                                new RuntimeException(
                                        "Estado EN STOCK no encontrado"
                                )
                        );

        Posicion posicionInicial =
                posicionRepository.findById(
                        dto.getPosicionInicialId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Posición inicial no encontrada"
                        )
                );

        Usuario usuarioSistema =
                usuarioRepository.findById(1L)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usuario sistema no encontrado"
                                )
                        );

        Movimiento movimientoInicial =
                new Movimiento();

        movimientoInicial.setRele(
                releGuardado
        );

        movimientoInicial.setEstado(
                estadoInicial
        );

        movimientoInicial.setPosicion(
                posicionInicial
        );

        movimientoInicial.setUsuario(
                usuarioSistema
        );

        movimientoInicial.setFechaMovimiento(
                LocalDateTime.now()
        );

        movimientoInicial.setNotas(
                "Ingreso inicial del relé"
        );

        Movimiento movimientoGuardado =
                movimientoRepository.save(
                        movimientoInicial
                );

        return mapToResponseDTO(
                releGuardado,
                movimientoGuardado
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

        return mapToResponseDTOCompleto(
                rele
        );
    }

    public ReleResponseDTO
    obtenerPorId(
            Long id
    ) {

        Rele rele =
                releRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Relé no encontrado"
                                )
                        );

        return mapToResponseDTOCompleto(rele);
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
                Rele rele,
                Movimiento ultimoMovimiento
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

        Long ordenProvisionId =
                rele.getOrdenProvision() != null
                        ? rele.getOrdenProvision().getId()
                        : null;

        String estadoActual = "SIN HISTORIAL";
        String posicionActual = "NO ASIGNADA";
        String localidadActual = "NO DEFINIDA";

        if (ultimoMovimiento != null) {

                estadoActual =
                        ultimoMovimiento
                                .getEstado()
                                .getNombre();

                posicionActual =
                        ultimoMovimiento
                                .getPosicion()
                                .getNombre();

                localidadActual =
                        ultimoMovimiento
                                .getPosicion()
                                .getDestino()
                                .getNombre();
                } 

        String estadoGarantia =
                "NO REGISTRA";

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
                rele.getCodigoConfiguracion(),

                rele.getGarantiaMeses(),

                rele.getInicioGarantia(),

                rele.getFinGarantia(),

                modelo != null
                        ? modelo.getNombre()
                        : null,

                modelo != null
                        &&
                        modelo.getMarca() != null
                        ? modelo.getMarca().getNombre()
                        : null,

                tension,

                modelo != null
                        ? modelo.getTipo().getNombre()
                        : null,

                estadoActual,

                posicionActual,

                localidadActual,

                modeloId,

                remitoId,

                ordenProvisionId,

                rele.getTipoIngreso(),

                estadoGarantia,

                mesesRestantesGarantia,

                rele.getActivo(),

                rele.getMotivoBaja(),

                rele.getFechaBaja()
                );
    }

    private ReleResponseDTO
        mapToResponseDTOCompleto(
                Rele rele
        ) {

        Movimiento ultimoMovimiento =
                movimientoRepository
                        .findTopByReleIdOrderByFechaMovimientoDesc(
                                rele.getId()
                        )
                        .orElse(null);

        return mapToResponseDTO(
                rele,
                ultimoMovimiento
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
                .map(this::mapToResponseDTOCompleto)
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
                .map(this::mapToResponseDTOCompleto);
    }

    public List<ReleResponseDTO>
        buscarPorSerialParcial(
                String texto
        ) {

        return releRepository
                .buscarGeneral(
                        texto
                )
                .stream()
                .map(this::mapToResponseDTOCompleto)
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

                                mapToResponseDTOCompleto(rele)
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

        OrdenProvision ordenProvision = null;

        if (
                dto.getOrdenProvisionId()
                != null
        ) {

        ordenProvision =
                ordenProvisionRepository
                        .findById(
                                dto.getOrdenProvisionId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Orden de provisión no encontrada"
                                )
                        );
                        ordenProvision.setAsociado(true);

                                ordenProvisionRepository.save(
                                ordenProvision
                                );
        }

        if (dto.getRemitoId() != null) {

            remito =
                    remitoRepository.findById(
                            dto.getRemitoId()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Remito no encontrado"
                            )
                    );
                        remito.setAsociado(true);
                        remitoRepository.save(remito);
        }

        rele.setNumeroSerie(
                dto.getNumeroSerie()
        );
        
        rele.setCodigoConfiguracion(
                dto.getCodigoConfiguracion()
        );

        rele.setModelo(modelo);

        rele.setRemito(remito);

        rele.setOrdenProvision(
                ordenProvision
        );

        rele.setTipoIngreso(
                dto.getTipoIngreso()
        );

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

        return mapToResponseDTOCompleto(
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