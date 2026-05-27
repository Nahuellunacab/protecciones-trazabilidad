package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import protecciones.entity.Provincia;

import java.util.List;
import java.util.Optional;

public interface ProvinciaRepository
        extends JpaRepository<Provincia, Long> {

    List<Provincia>
    findAllByOrderByNombreAsc();

    Optional<Provincia>
    findByNombreIgnoreCase(
            String nombre
    );
}