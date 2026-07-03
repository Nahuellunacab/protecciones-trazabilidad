package protecciones.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import protecciones.entity.Movimiento;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.query.Param;

public interface MovimientoRepository
        extends JpaRepository<Movimiento, Long> {

    List<Movimiento>
    findByReleIdOrderByFechaMovimientoDescIdDesc(
            Long releId
    );

    Optional<Movimiento>
    findTopByReleIdOrderByFechaMovimientoDescIdDesc(
            Long releId
    );

    List<Movimiento>
    findTop10ByOrderByFechaMovimientoDescIdDesc();

    @Query("""

        SELECT m
        FROM Movimiento m
        WHERE NOT EXISTS (
            SELECT 1
            FROM Movimiento m2
            WHERE m2.rele.id = m.rele.id
            AND (
                m2.fechaMovimiento > m.fechaMovimiento
                OR (
                    m2.fechaMovimiento = m.fechaMovimiento
                    AND m2.id > m.id
                )
            )
        )

    """)
    List<Movimiento> findUltimosMovimientos();

    @Query("""

        SELECT m
        FROM Movimiento m
        WHERE m.rele.id IN :releIds
        AND NOT EXISTS (
            SELECT 1
            FROM Movimiento m2
            WHERE m2.rele.id = m.rele.id
            AND (
                m2.fechaMovimiento > m.fechaMovimiento
                OR (
                    m2.fechaMovimiento = m.fechaMovimiento
                    AND m2.id > m.id
                )
            )
        )

    """)
    List<Movimiento> findUltimosMovimientosByReleIds(
            @Param("releIds") List<Long> releIds
    );

    @Query("""

        SELECT m
        FROM Movimiento m
        WHERE LOWER(m.estado.nombre) = LOWER(:estadoNombre)
        AND NOT EXISTS (
            SELECT 1
            FROM Movimiento m2
            WHERE m2.rele.id = m.rele.id
            AND (
                m2.fechaMovimiento > m.fechaMovimiento
                OR (
                    m2.fechaMovimiento = m.fechaMovimiento
                    AND m2.id > m.id
                )
            )
        )

    """)
    List<Movimiento> findUltimosMovimientosByEstado(
            @Param("estadoNombre") String estadoNombre
    );

    @Query("""

        SELECT m.estado.nombre, COUNT(m)
        FROM Movimiento m
        WHERE NOT EXISTS (
            SELECT 1
            FROM Movimiento m2
            WHERE m2.rele.id = m.rele.id
            AND (
                m2.fechaMovimiento > m.fechaMovimiento
                OR (
                    m2.fechaMovimiento = m.fechaMovimiento
                    AND m2.id > m.id
                )
            )
        )
        GROUP BY m.estado.nombre

    """)
    List<Object[]> countUltimosMovimientosPorEstado();

    List<Movimiento>
    findByFechaMovimientoBetweenOrderByFechaMovimientoDesc(

            LocalDateTime desde,

            LocalDateTime hasta
    );

    List<Movimiento>
    findAllByOrderByFechaMovimientoDesc();
}
