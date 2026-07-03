package protecciones.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.dto.dashboard.MarcaCantidadDTO;
import protecciones.dto.dashboard.ModeloCantidadDTO;
import protecciones.entity.Rele;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReleRepository
                extends JpaRepository<Rele, Long> {

        boolean existsByNumeroSerie(
                        String numeroSerie);

        boolean existsByNumeroSerieAndIdNot(
                        String numeroSerie,
                        Long id);

        List<Rele> findByActivoTrue();

        Page<Rele> findByActivoTrue(
                        Pageable pageable);

        List<Rele> findByNumeroSerieContainingIgnoreCaseAndActivoTrue(
                        String numeroSerie);

        Optional<Rele> findByNumeroSerieAndActivoTrue(
                        String numeroSerie);

        List<Rele> findByNumeroSerieContainingIgnoreCase(
                        String numeroSerie);

        Optional<Rele> findByNumeroSerie(
                        String numeroSerie);

        long countByModeloIdAndActivoTrue(
                        Long modeloId);

        long countByModeloIdAndActivoFalse(
                        Long modeloId);

        long countByActivoTrue();

        long countByActivoFalse();

        long countByFinGarantiaBefore(
                        LocalDate fecha);

        long countByRemitoId(
                        Long remitoId);

        long countByOrdenProvisionId(
                        Long ordenProvisionId);

        @Query("""
                        SELECT COUNT(r)
                        FROM Rele r
                        WHERE r.remito IS NULL
                        AND r.ordenProvision IS NULL
                        AND r.activo = true
                        """)
        long countSinDocumentacion();

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
                        @Param("texto") String texto);

        @Query("""
                        SELECT r
                        FROM Rele r
                        JOIN r.modelo m
                        JOIN m.marca ma
                        WHERE (:activo IS NULL OR r.activo = :activo)
                        AND (
                                :texto IS NULL
                                OR :texto = ''
                                OR LOWER(r.numeroSerie) LIKE LOWER(CONCAT('%', :texto, '%'))
                                OR LOWER(m.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))
                                OR LOWER(ma.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))
                        )
                        """)
        Page<Rele> buscarPaginado(
                        @Param("texto") String texto,
                        @Param("activo") Boolean activo,
                        Pageable pageable);

        @Query("""
                        SELECT new protecciones.dto.dashboard.MarcaCantidadDTO(
                        m.marca.nombre,
                        COUNT(r)
                        )
                        FROM Rele r
                        JOIN r.modelo m
                        WHERE r.activo = true
                        GROUP BY m.marca.nombre
                        ORDER BY COUNT(r) DESC
                        """)
        List<MarcaCantidadDTO> contarRelesPorMarca();

        @Query("""
                        SELECT new protecciones.dto.dashboard.ModeloCantidadDTO(
                        m.nombre,
                        COUNT(r)
                        )
                        FROM Rele r
                        JOIN r.modelo m
                        WHERE r.activo = true
                        GROUP BY m.nombre
                        ORDER BY COUNT(r) DESC
                        """)
        List<ModeloCantidadDTO> contarRelesPorModelo();

        @Query("""
                        SELECT COUNT(r)
                        FROM Rele r
                        WHERE r.id NOT IN (
                                SELECT DISTINCT m.rele.id
                                FROM Movimiento m
                        )
                        """)
        long countSinHistorial();
}
