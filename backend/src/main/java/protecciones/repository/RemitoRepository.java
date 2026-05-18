package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.Remito;

public interface RemitoRepository extends JpaRepository<Remito, Long> {
}