package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.Localidad;

public interface LocalidadRepository extends JpaRepository<Localidad, Long> {
}