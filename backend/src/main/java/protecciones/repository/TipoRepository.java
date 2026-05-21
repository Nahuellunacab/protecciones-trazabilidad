package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import protecciones.entity.Tipo;

import java.util.List;

public interface TipoRepository
        extends JpaRepository<Tipo, Long> {

    List<Tipo>
    findAllByOrderByNombreAsc();
}