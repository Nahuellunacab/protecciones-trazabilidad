package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.Estado;

public interface EstadoRepository extends JpaRepository<Estado, Long> {
}