package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import protecciones.entity.Posicion;

import java.util.List;
import java.util.Optional;

public interface PosicionRepository
        extends JpaRepository<Posicion, Long> {

    List<Posicion>
    findAllByOrderByNombreAsc();

    List<Posicion>
    findByDestinoIdOrderByNombreAsc(
            Long destinoId
    );

    Optional<Posicion>
    findByNombreIgnoreCaseAndDestinoId(

            String nombre,
            Long destinoId
    );
}