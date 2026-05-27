package protecciones.service;

import org.springframework.stereotype.Service;

import protecciones.dto.EstadoResponseDTO;

import protecciones.entity.Estado;
import protecciones.entity.Movimiento;
import protecciones.entity.Rele;
import protecciones.entity.TransicionEstado;

import protecciones.repository.EstadoRepository;
import protecciones.repository.MovimientoRepository;
import protecciones.repository.ReleRepository;
import protecciones.repository.TransicionEstadoRepository;

import java.util.List;
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

    public List<EstadoResponseDTO>
    obtenerEstadosPermitidos(
            Long releId
    ) {

        Rele rele =
                releRepository.findById(
                        releId
                ).orElseThrow(() ->

                        new RuntimeException(
                                "Relé no encontrado"
                        )
                );

        Optional<Movimiento> ultimoMovimiento =
                movimientoRepository
                        .findTopByReleIdOrderByFechaMovimientoDesc(
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