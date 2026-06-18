package protecciones.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    @Query("""

        SELECT m
        FROM Movimiento m
        WHERE m.fechaMovimiento IN (

            SELECT MAX(m2.fechaMovimiento)
            FROM Movimiento m2
            GROUP BY m2.rele.id
        )

    """)
    List<Movimiento> findUltimosMovimientos();
}