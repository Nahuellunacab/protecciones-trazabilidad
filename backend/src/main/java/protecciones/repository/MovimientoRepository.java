package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.Movimiento;

import java.util.List;

public interface MovimientoRepository
        extends JpaRepository<Movimiento, Long> {

    List<Movimiento> findByReleIdOrderByFechaMovimientoDesc(Long releId);
}