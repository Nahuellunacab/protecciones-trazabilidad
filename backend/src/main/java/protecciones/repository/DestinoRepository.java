package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import protecciones.entity.Destino;

import java.util.List;
import java.util.Optional;

public interface DestinoRepository
        extends JpaRepository<Destino, Long> {

    List<Destino>
    findAllByOrderByNombreAsc();

    Optional<Destino>
    findByNombreIgnoreCase(
            String nombre
    );
}