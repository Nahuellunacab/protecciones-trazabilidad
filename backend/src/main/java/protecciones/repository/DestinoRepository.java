package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.Destino;

public interface DestinoRepository extends JpaRepository<Destino, Long> {
}