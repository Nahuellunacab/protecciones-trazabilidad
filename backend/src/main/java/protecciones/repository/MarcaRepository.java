package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.Marca;

public interface MarcaRepository extends JpaRepository<Marca, Long> {
}