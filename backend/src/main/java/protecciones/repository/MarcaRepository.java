package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import protecciones.entity.Marca;

import java.util.List;
import java.util.Optional;

public interface MarcaRepository
        extends JpaRepository<Marca, Long> {

    List<Marca>
    findAllByOrderByNombreAsc();

    Optional<Marca>
    findByNombreIgnoreCase(
            String nombre
    );
}