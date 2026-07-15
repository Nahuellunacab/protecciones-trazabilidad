package protecciones.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import protecciones.entity.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Usuario> findByNumeroSobre(String numeroSobre);

    boolean existsByNumeroSobre(String numeroSobre);

    @Query("""
            SELECT u
            FROM Usuario u
            WHERE (:activo IS NULL OR u.activo = :activo)
            AND (
                    :texto IS NULL
                    OR :texto = ''
                    OR LOWER(u.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))
                    OR LOWER(u.apellido) LIKE LOWER(CONCAT('%', :texto, '%'))
                    OR LOWER(u.email) LIKE LOWER(CONCAT('%', :texto, '%'))
                    OR LOWER(u.numeroSobre) LIKE LOWER(CONCAT('%', :texto, '%'))
            )
            AND (:rol IS NULL OR :rol = '' OR u.rol = :rol)
            """)
    Page<Usuario> buscarPaginado(
            @Param("texto") String texto,
            @Param("activo") Boolean activo,
            @Param("rol") String rol,
            Pageable pageable
    );
}