package protecciones.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.dto.dashboard.MarcaCantidadDTO;
import protecciones.dto.dashboard.ModeloCantidadDTO;
import protecciones.dto.dashboard.ProveedorCantidadDTO;
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

    // Usado por la carga inteligente por remito (RemitoIAService) para
    // recuperar el modelo correcto a partir de un codigo de configuracion
    // ya cargado en el sistema, aunque el nombre de modelo leido por OCR
    // tenga errores: el codigo de configuracion se trata como fuente de
    // verdad mas confiable que el texto de modelo extraido del documento.
    Optional<Rele>
    findFirstByCodigoConfiguracionIgnoreCase(
            String codigoConfiguracion
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

    long countByActivoTrueAndFinGarantiaBefore(
            LocalDate fecha
    );

    long countByRemitoId(
            Long remitoId
    );

    long countByOrdenProvisionId(
            Long ordenProvisionId
    );

    @Query("""
            SELECT COUNT(r)
            FROM Rele r
            WHERE r.remito IS NULL
            AND r.ordenProvision IS NULL
            AND r.activo = true
            """)
    long countSinDocumentacion();

    @Query("""
            SELECT COUNT(r)
            FROM Rele r
            WHERE r.activo = true
            AND (
                    (r.remito IS NOT NULL AND (r.remito.rutaArchivo IS NULL OR r.remito.rutaArchivo = ''))
                    OR (r.ordenProvision IS NOT NULL AND (r.ordenProvision.rutaArchivo IS NULL OR r.ordenProvision.rutaArchivo = ''))
            )
            """)
    long countDocumentacionSinArchivo();

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

    @Query("""
        SELECT r
        FROM Rele r
        JOIN r.modelo m
        JOIN m.marca ma
        LEFT JOIN r.remito rm
        LEFT JOIN rm.proveedor prov
        WHERE (:activo IS NULL OR r.activo = :activo)
        AND (
                :texto IS NULL
                OR :texto = ''
                OR LOWER(r.numeroSerie) LIKE LOWER(CONCAT('%', :texto, '%'))
                OR LOWER(m.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))
                OR LOWER(ma.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))
                OR (prov.nombre IS NOT NULL AND LOWER(prov.nombre) LIKE LOWER(CONCAT('%', :texto, '%')))
        )
        AND (:marcaId IS NULL OR ma.id = :marcaId)
        AND (:modeloId IS NULL OR m.id = :modeloId)
        AND (
                :estadoNombre IS NULL
                OR :estadoNombre = ''
                OR EXISTS (
                        SELECT 1
                        FROM Movimiento mv
                        WHERE mv.rele.id = r.id
                        AND LOWER(mv.estado.nombre) = LOWER(:estadoNombre)
                        AND NOT EXISTS (
                                SELECT 1
                                FROM Movimiento mv2
                                WHERE mv2.rele.id = mv.rele.id
                                AND (
                                        mv2.fechaMovimiento > mv.fechaMovimiento
                                        OR (
                                                mv2.fechaMovimiento = mv.fechaMovimiento
                                                AND mv2.id > mv.id
                                        )
                                )
                        )
                )
        )
        AND (
                :destinoId IS NULL
                OR EXISTS (
                        SELECT 1
                        FROM Movimiento mv
                        WHERE mv.rele.id = r.id
                        AND mv.posicion.destino.id = :destinoId
                        AND NOT EXISTS (
                                SELECT 1
                                FROM Movimiento mv2
                                WHERE mv2.rele.id = mv.rele.id
                                AND (
                                        mv2.fechaMovimiento > mv.fechaMovimiento
                                        OR (
                                                mv2.fechaMovimiento = mv.fechaMovimiento
                                                AND mv2.id > mv.id
                                        )
                                )
                        )
                )
        )
        """)
    Page<Rele> buscarPaginado(
            @Param("texto") String texto,
            @Param("activo") Boolean activo,
            @Param("marcaId") Long marcaId,
            @Param("modeloId") Long modeloId,
            @Param("estadoNombre") String estadoNombre,
            @Param("destinoId") Long destinoId,
            Pageable pageable
    );

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
            SELECT new protecciones.dto.dashboard.ProveedorCantidadDTO(
            rm.proveedor.nombre,
            COUNT(r)
            )
            FROM Rele r
            JOIN r.remito rm
            WHERE r.activo = true
            GROUP BY rm.proveedor.nombre
            ORDER BY COUNT(r) DESC
            """)
    List<ProveedorCantidadDTO> contarRelesPorProveedor();

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
