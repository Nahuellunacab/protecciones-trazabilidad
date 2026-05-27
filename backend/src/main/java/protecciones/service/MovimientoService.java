package protecciones.service;

import org.springframework.stereotype.Service;

import protecciones.dto.MovimientoRequestDTO;
import protecciones.dto.MovimientoResponseDTO;

import protecciones.entity.Estado;
import protecciones.entity.Movimiento;
import protecciones.entity.Posicion;
import protecciones.entity.Rele;
import protecciones.entity.Usuario;

import protecciones.repository.EstadoRepository;
import protecciones.repository.MovimientoRepository;
import protecciones.repository.PosicionRepository;
import protecciones.repository.ReleRepository;
import protecciones.repository.TransicionEstadoRepository;
import protecciones.repository.UsuarioRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MovimientoService {

    private final MovimientoRepository
            movimientoRepository;

    private final ReleRepository
            releRepository;

    private final EstadoRepository
            estadoRepository;

    private final PosicionRepository
            posicionRepository;

    private final UsuarioRepository
            usuarioRepository;

    private final TransicionEstadoRepository
            transicionEstadoRepository;

    public MovimientoService(
            MovimientoRepository movimientoRepository,
            ReleRepository releRepository,
            EstadoRepository estadoRepository,
            PosicionRepository posicionRepository,
            UsuarioRepository usuarioRepository,
            TransicionEstadoRepository transicionEstadoRepository
    ) {

        this.movimientoRepository =
                movimientoRepository;

        this.releRepository =
                releRepository;

        this.estadoRepository =
                estadoRepository;

        this.posicionRepository =
                posicionRepository;

        this.usuarioRepository =
                usuarioRepository;

        this.transicionEstadoRepository =
                transicionEstadoRepository;
    }

    public List<MovimientoResponseDTO>
    obtenerTodos() {

        return movimientoRepository
                .findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public MovimientoResponseDTO guardar(
            MovimientoRequestDTO dto
    ) {

        Rele rele =
                releRepository.findById(
                        dto.getReleId()
                ).orElseThrow();

        if (!Boolean.TRUE.equals(
                rele.getActivo()
        )) {

            throw new RuntimeException(
                    "No se pueden registrar movimientos sobre un relé dado de baja"
            );
        }

        Estado estadoDestino =
                estadoRepository.findById(
                        dto.getEstadoId()
                ).orElseThrow();

        Posicion posicion =
                posicionRepository.findById(
                        dto.getPosicionId()
                ).orElseThrow();

        Usuario usuario =
                usuarioRepository.findById(1L)
                        .orElseThrow();

        Optional<Movimiento> ultimoMovimiento =
                movimientoRepository
                        .findTopByReleIdOrderByFechaMovimientoDesc(
                                rele.getId()
                        );

        if (ultimoMovimiento.isPresent()) {

            Estado estadoActual =
                    ultimoMovimiento
                            .get()
                            .getEstado();

            boolean transicionPermitida =
                    transicionEstadoRepository
                            .existsByEstadoOrigenIdAndEstadoDestinoId(
                                    estadoActual.getId(),
                                    estadoDestino.getId()
                            );

            if (!transicionPermitida) {

                throw new RuntimeException(
                        "Transición de estado no permitida: "
                                + estadoActual.getNombre()
                                + " -> "
                                + estadoDestino.getNombre()
                );
            }
        }

        Movimiento movimiento =
                new Movimiento();

        movimiento.setRele(rele);

        movimiento.setEstado(
                estadoDestino
        );

        movimiento.setPosicion(posicion);

        movimiento.setUsuario(usuario);

        movimiento.setFechaMovimiento(
                LocalDateTime.now()
        );

        movimiento.setNotas(
                dto.getNotas()
        );

        Movimiento guardado =
                movimientoRepository.save(
                        movimiento
                );

        return mapToDTO(guardado);
    }

    private MovimientoResponseDTO mapToDTO(
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

                null,

                null,

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