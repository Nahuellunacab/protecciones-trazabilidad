package protecciones.repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.Rele;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReleRepository
        extends JpaRepository<Rele, Long> {

    boolean existsByNumeroSerie(
            String numeroSerie
    );

    boolean existsByNumeroSerieAndIdNot(
            String numeroSerie,
            Long id
    );

    List<Rele>
    findByActivoTrue();

    Page<Rele>
    findByActivoTrue(
            Pageable pageable
    );

    List<Rele>
    findByNumeroSerieContainingIgnoreCaseAndActivoTrue(
            String numeroSerie
    );

    Optional<Rele>
    findByNumeroSerieAndActivoTrue(
            String numeroSerie
    );

    List<Rele>
    findByNumeroSerieContainingIgnoreCase(
            String numeroSerie
    );

    Optional<Rele>
    findByNumeroSerie(
            String numeroSerie
    );

    long countByModeloIdAndActivoTrue(
            Long modeloId
    );

    long countByModeloIdAndActivoFalse(
            Long modeloId
    );

    long countByActivoTrue();

    long countByActivoFalse();

    long countByFinGarantiaBefore(
            LocalDate fecha
    );

    @Query("""
        SELECT r
        FROM Rele r
        JOIN r.modelo m
        JOIN m.marca ma
        WHERE r.activo = true
        AND (
                LOWER(r.numeroSerie) LIKE LOWER(CONCAT('%', :texto, '%'))
                OR LOWER(m.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))
                OR LOWER(ma.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))
        )
        """)
        List<Rele> buscarGeneral(
                @Param("texto") String texto
        );
}