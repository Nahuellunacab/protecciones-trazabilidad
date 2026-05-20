package protecciones.service;

import org.springframework.stereotype.Service;

import protecciones.dto.MovimientoResponseDTO;
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

import java.util.List;

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

    public ReleService(ReleRepository releRepository,
                       ModeloRepository modeloRepository,
                       RemitoRepository remitoRepository,
                       MovimientoRepository movimientoRepository) {

        this.releRepository = releRepository;
        this.modeloRepository = modeloRepository;
        this.remitoRepository = remitoRepository;
        this.movimientoRepository = movimientoRepository;
    }

    public List<ReleResponseDTO> obtenerTodos() {

        return releRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public ReleResponseDTO guardar(ReleRequestDTO dto) {

        Modelo modelo = modeloRepository.findById(dto.getModeloId())
                .orElseThrow(() ->
                        new RuntimeException("Modelo no encontrado"));

        Remito remito = null;

        if (dto.getRemitoId() != null) {

            remito = remitoRepository.findById(dto.getRemitoId())
                    .orElseThrow(() ->
                            new RuntimeException("Remito no encontrado"));
        }

        Rele rele = new Rele();

        rele.setNumeroSerie(dto.getNumeroSerie());
        rele.setGarantiaMeses(dto.getGarantiaMeses());
        rele.setModelo(modelo);
        rele.setRemito(remito);

        Rele releGuardado = releRepository.save(rele);

        return mapToResponseDTO(releGuardado);
    }

    public ReleResponseDTO buscarPorNumeroSerie(String numeroSerie) {

        Rele rele = releRepository.findByNumeroSerie(numeroSerie)
                .orElseThrow(() ->
                        new RuntimeException("Relé no encontrado"));

        return mapToResponseDTO(rele);
    }

    public List<MovimientoResponseDTO> obtenerHistorial(Long releId) {

        return movimientoRepository
                .findByReleIdOrderByFechaMovimientoDesc(releId)
                .stream()
                .map(this::mapMovimientoToDTO)
                .toList();
    }

    private ReleResponseDTO mapToResponseDTO(Rele rele) {

        return new ReleResponseDTO(
                rele.getId(),
                rele.getNumeroSerie(),
                rele.getGarantiaMeses(),
                rele.getModelo().getNombre(),
                rele.getModelo().getMarca().getNombre()
        );
    }

    public MovimientoResponseDTO obtenerEstadoActual(Long releId) {

        Movimiento movimiento = movimientoRepository
                .findTopByReleIdOrderByFechaMovimientoDesc(releId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "El relé no tiene movimientos"));

        return mapMovimientoToDTO(movimiento);    
    }

    public List<ReleResponseDTO> obtenerPorEstadoActual(
        String estadoNombre) {

        return releRepository.findAll()
                .stream()
                .filter(rele -> {

                    return movimientoRepository
                            .findTopByReleIdOrderByFechaMovimientoDesc(
                                    rele.getId())
                            .map(movimiento ->
                                    movimiento.getEstado()
                                            .getNombre()
                                            .equalsIgnoreCase(estadoNombre))
                            .orElse(false);
                })
                .map(this::mapToResponseDTO)
                .toList();
    }

    public Page<ReleResponseDTO> obtenerPaginados(
            int page,
            int size,
            String sort) {

        String[] sortParams = sort.split(",");

        String campo = sortParams[0];

        Sort.Direction direccion =
                sortParams.length > 1 &&
                sortParams[1].equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(direccion, campo)
        );

        return releRepository.findAll(pageable)
                .map(this::mapToResponseDTO);
    }

    public List<ReleResponseDTO> buscarPorSerialParcial(
            String serial) {

        return releRepository
                .findByNumeroSerieContainingIgnoreCase(serial)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    private MovimientoResponseDTO mapMovimientoToDTO(
                Movimiento movimiento) {

        return new MovimientoResponseDTO(

                movimiento.getId(),

                movimiento.getRele()
                        .getNumeroSerie(),

                movimiento.getFechaMovimiento(),

                movimiento.getEstado()
                        .getNombre(),

                movimiento.getPosicion()
                        .getNombre(),

                movimiento.getUsuario() != null
                        ? movimiento.getUsuario()
                                .getNombre()
                        : null,

                movimiento.getNotas()
        );
        }
}