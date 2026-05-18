package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.Movimiento;

public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {
}