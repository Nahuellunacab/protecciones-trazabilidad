package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import protecciones.entity.Modelo;

import java.util.List;

public interface ModeloRepository
        extends JpaRepository<Modelo, Long> {

    List<Modelo> findByMarcaId(Long marcaId);
}