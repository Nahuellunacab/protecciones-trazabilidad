package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import protecciones.entity.Movimiento;

import java.util.List;
import java.util.Optional;

public interface MovimientoRepository
        extends JpaRepository<Movimiento, Long> {

    List<Movimiento>
    findByReleIdOrderByFechaMovimientoDesc(
            Long releId
    );

    Optional<Movimiento>
    findTopByReleIdOrderByFechaMovimientoDesc(
            Long releId
    );

    List<Movimiento>
    findTop10ByOrderByFechaMovimientoDesc();
}