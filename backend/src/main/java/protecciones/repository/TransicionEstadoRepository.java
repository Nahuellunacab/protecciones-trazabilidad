package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import protecciones.entity.TransicionEstado;

import java.util.List;

public interface
TransicionEstadoRepository
extends JpaRepository<
        TransicionEstado,
        Long
> {

    boolean existsByEstadoOrigenIdAndEstadoDestinoId(
            Long origenId,
            Long destinoId
    );

    List<TransicionEstado>
    findByEstadoOrigenId(
            Long estadoOrigenId
    );
}