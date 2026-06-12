package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.OrdenProvision;
import java.util.List;

public interface
OrdenProvisionRepository
extends JpaRepository<
        OrdenProvision,
        Long
> {

    List<OrdenProvision>
    findByAsociadoFalse();
}