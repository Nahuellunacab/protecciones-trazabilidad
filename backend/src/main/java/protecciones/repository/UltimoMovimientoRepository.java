package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import protecciones.entity.UltimoMovimiento;

import java.util.List;

public interface UltimoMovimientoRepository
        extends JpaRepository<UltimoMovimiento, Long> {

    @Query("""
            SELECT u.estado.nombre, COUNT(u)
            FROM UltimoMovimiento u
            WHERE u.rele.activo = true
            GROUP BY u.estado.nombre
            ORDER BY COUNT(u) DESC
            """)
    List<Object[]> contarPorEstado();

    @Query("""
            SELECT u.posicion.destino.nombre, COUNT(u)
            FROM UltimoMovimiento u
            WHERE u.rele.activo = true
            GROUP BY u.posicion.destino.nombre
            ORDER BY COUNT(u) DESC
            """)
    List<Object[]> contarPorDestino();

    @Query("""
            SELECT u.posicion.destino.id, COUNT(u)
            FROM UltimoMovimiento u
            WHERE u.rele.activo = true
            GROUP BY u.posicion.destino.id
            """)
    List<Object[]> contarPorDestinoId();
}
