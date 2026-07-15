package protecciones.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import protecciones.entity.Remito;

import java.util.List;
import java.util.Optional;

public interface RemitoRepository
        extends JpaRepository<Remito, Long> {

    List<Remito>
    findAllByOrderByFechaDesc();

    Optional<Remito>
    findByNumeroRemitoIgnoreCase(
            String numeroRemito
    );

    long countByAsociadoFalse();

    @Query("""
            SELECT r
            FROM Remito r
            JOIN r.proveedor p
            WHERE (
                    :texto IS NULL
                    OR :texto = ''
                    OR LOWER(r.numeroRemito) LIKE LOWER(CONCAT('%', :texto, '%'))
                    OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))
            )
            AND (:proveedorId IS NULL OR p.id = :proveedorId)
            AND (
                    :asociado IS NULL
                    OR (:asociado = true AND EXISTS (SELECT 1 FROM Rele rl WHERE rl.remito = r))
                    OR (:asociado = false AND NOT EXISTS (SELECT 1 FROM Rele rl WHERE rl.remito = r))
            )
            """)
    Page<Remito> buscarPaginado(
            @Param("texto") String texto,
            @Param("proveedorId") Long proveedorId,
            @Param("asociado") Boolean asociado,
            Pageable pageable
    );
}