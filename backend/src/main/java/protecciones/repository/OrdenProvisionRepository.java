package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.OrdenProvision;

public interface
OrdenProvisionRepository
extends JpaRepository<
        OrdenProvision,
        Long
> {
}