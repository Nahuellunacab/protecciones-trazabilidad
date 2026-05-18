package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.Provincia;

public interface ProvinciaRepository extends JpaRepository<Provincia, Long> {
}