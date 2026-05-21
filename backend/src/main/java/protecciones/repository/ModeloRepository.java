package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import protecciones.entity.Modelo;

import java.util.List;
import java.util.Optional;

public interface ModeloRepository
        extends JpaRepository<Modelo, Long> {

    List<Modelo>
    findByMarcaId(Long marcaId);

    List<Modelo>
    findAllByOrderByNombreAsc();

    Optional<Modelo>
    findByNombreIgnoreCaseAndMarcaId(
            String nombre,
            Long marcaId
    );
}