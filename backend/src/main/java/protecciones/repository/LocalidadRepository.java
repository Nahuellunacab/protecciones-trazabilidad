package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import protecciones.entity.Localidad;

import java.util.List;
import java.util.Optional;

public interface LocalidadRepository
        extends JpaRepository<Localidad, Long> {

    List<Localidad>
    findAllByOrderByNombreAsc();

    List<Localidad>
    findByProvinciaIdOrderByNombreAsc(
            Long provinciaId
    );

    Optional<Localidad>
    findByNombreIgnoreCaseAndProvinciaId(

            String nombre,
            Long provinciaId
    );
}