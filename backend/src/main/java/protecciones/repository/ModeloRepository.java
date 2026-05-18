package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.Modelo;

public interface ModeloRepository extends JpaRepository<Modelo, Long> {
}