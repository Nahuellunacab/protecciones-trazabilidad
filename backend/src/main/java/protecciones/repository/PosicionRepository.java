package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.Posicion;

public interface PosicionRepository extends JpaRepository<Posicion, Long> {
}