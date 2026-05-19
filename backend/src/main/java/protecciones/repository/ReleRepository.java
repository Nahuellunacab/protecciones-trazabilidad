package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.Rele;

import java.util.List;
import java.util.Optional;

public interface ReleRepository extends JpaRepository<Rele, Long> {

    Optional<Rele> findByNumeroSerie(String numeroSerie);

    List<Rele> findByNumeroSerieContainingIgnoreCase(
            String numeroSerie);
}