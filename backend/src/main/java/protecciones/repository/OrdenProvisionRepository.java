package protecciones.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import protecciones.entity.OrdenProvision;

public interface
OrdenProvisionRepository
extends JpaRepository<
        OrdenProvision,
        Long
> {
        long countByAsociadoFalse();

        @Query("""
                SELECT op
                FROM OrdenProvision op
                WHERE (
                        :texto IS NULL
                        OR :texto = ''
                        OR LOWER(op.numero) LIKE LOWER(CONCAT('%', :texto, '%'))
                        OR (op.observaciones IS NOT NULL AND LOWER(op.observaciones) LIKE LOWER(CONCAT('%', :texto, '%')))
                )
                AND (
                        :asociado IS NULL
                        OR (:asociado = true AND EXISTS (SELECT 1 FROM Rele rl WHERE rl.ordenProvision = op))
                        OR (:asociado = false AND NOT EXISTS (SELECT 1 FROM Rele rl WHERE rl.ordenProvision = op))
                )
                """)
        Page<OrdenProvision> buscarPaginado(
                @Param("texto") String texto,
                @Param("asociado") Boolean asociado,
                Pageable pageable
        );
}