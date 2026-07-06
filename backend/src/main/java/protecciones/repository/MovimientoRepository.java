package protecciones.repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import protecciones.dto.dashboard.UsuarioCantidadDTO;
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

    List<Movimiento>
    findByFechaMovimientoBetweenOrderByFechaMovimientoDesc(

            LocalDateTime desde,

            LocalDateTime hasta
    );

    List<Movimiento>
    findAllByOrderByFechaMovimientoDesc();

    @Query("""

        SELECT m
        FROM Movimiento m
        WHERE (CAST(:desde AS timestamp) IS NULL OR m.fechaMovimiento >= :desde)
        AND (CAST(:hasta AS timestamp) IS NULL OR m.fechaMovimiento <= :hasta)
        ORDER BY m.fechaMovimiento DESC, m.id DESC

    """)
    List<Movimiento> buscarUltimosMovimientos(
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta,
            Pageable pageable
    );

    @Query("""

        SELECT new protecciones.dto.dashboard.UsuarioCantidadDTO(
            CONCAT(m.usuario.nombre, ' ', m.usuario.apellido),
            COUNT(m)
        )
        FROM Movimiento m
        GROUP BY m.usuario.nombre, m.usuario.apellido
        ORDER BY COUNT(m) DESC

    """)
    List<UsuarioCantidadDTO> contarMovimientosPorUsuario();
}
