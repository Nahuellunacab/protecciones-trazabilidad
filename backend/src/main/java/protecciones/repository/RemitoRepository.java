package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import protecciones.entity.Remito;

import java.util.List;
import java.util.Optional;

public interface RemitoRepository
        extends JpaRepository<Remito, Long> {

    List<Remito>
    findAllByOrderByFechaDesc();

    Optional<Remito>
    findByNumeroRemitoIgnoreCase(
            String numeroRemito
    );
}