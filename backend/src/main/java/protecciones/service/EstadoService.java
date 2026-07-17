package protecciones.service;
import org.springframework.stereotype.Service;
import protecciones.dto.EstadoResponseDTO;
import protecciones.entity.Estado;
import protecciones.entity.Movimiento;
import protecciones.entity.Rele;
import protecciones.entity.TransicionEstado;
import protecciones.exception.BusinessException;
import protecciones.repository.EstadoRepository;
import protecciones.repository.MovimientoRepository;
import protecciones.repository.ReleRepository;
import protecciones.repository.TransicionEstadoRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class EstadoService {

    private final EstadoRepository
            estadoRepository;

    private final ReleRepository
            releRepository;

    private final MovimientoRepository
            movimientoRepository;

    private final TransicionEstadoRepository
            transicionEstadoRepository;

    public EstadoService(
            EstadoRepository estadoRepository,
            ReleRepository releRepository,
            MovimientoRepository movimientoRepository,
            TransicionEstadoRepository transicionEstadoRepository
    ) {

        this.estadoRepository =
                estadoRepository;

        this.releRepository =
                releRepository;

        this.movimientoRepository =
                movimientoRepository;

        this.transicionEstadoRepository =
                transicionEstadoRepository;
    }

    public List<EstadoResponseDTO>
    obtenerTodos() {

        return estadoRepository
                .findAll()
                .stream()
                .map(estado ->

                    new EstadoResponseDTO(

                        estado.getId(),

                        estado.getNombre()
                    )
                )
                .toList();
    }

    // Estados que se pueden ofrecer como estado inicial al dar de alta un
    // relé: cualquier estado con al menos una transición saliente en
    // transicion_estado. Esto excluye "BAJA" (terminal, tiene su propio
    // flujo dedicado con reglas propias) y estados historicos como
    // "INSTALADO" que ya no forman parte del grafo vigente (permitirlos
    // dejaria al relé sin ninguna transición válida posterior).
    public List<EstadoResponseDTO>
    obtenerEstadosIniciales() {

        Map<Long, Estado> estadosPorId =
                new LinkedHashMap<>();

        for (
                TransicionEstado transicion
                : transicionEstadoRepository.findAll()
        ) {

            Estado origen =
                    transicion.getEstadoOrigen();

            estadosPorId.putIfAbsent(
                    origen.getId(),
                    origen
            );
        }

        return estadosPorId.values()
                .stream()
                .sorted(
                        (a, b) ->
                                a.getNombre()
                                        .compareTo(b.getNombre())
                )
                .map(estado ->

                        new EstadoResponseDTO(

                                estado.getId(),

                                estado.getNombre()
                        )
                )
                .toList();
    }

    public List<EstadoResponseDTO>
    obtenerEstadosPermitidos(
            Long releId
    ) {

        Rele rele =
                releRepository.findById(
                        releId
                ).orElseThrow(() ->

                        new BusinessException(
                                "Relé no encontrado"
                        )
                );

        Optional<Movimiento> ultimoMovimiento =
                movimientoRepository
                        .findTopByReleIdOrderByFechaMovimientoDescIdDesc(
                                rele.getId()
                        );

        if (ultimoMovimiento.isEmpty()) {

            return obtenerTodos();
        }

        Estado estadoActual =
                ultimoMovimiento
                        .get()
                        .getEstado();

        List<TransicionEstado>
                transiciones =

                transicionEstadoRepository
                        .findByEstadoOrigenId(
                                estadoActual.getId()
                        );

        return transiciones
                .stream()
                .map(transicion ->

                        new EstadoResponseDTO(

                                transicion
                                        .getEstadoDestino()
                                        .getId(),

                                transicion
                                        .getEstadoDestino()
                                        .getNombre()
                        )
                )
                .toList();
    }
}
