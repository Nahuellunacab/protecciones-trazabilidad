package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}