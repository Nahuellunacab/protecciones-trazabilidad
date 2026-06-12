package protecciones.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.Estado;
import java.util.Optional;
public interface EstadoRepository
extends JpaRepository<
        Estado,
        Long
> {    Optional<Estado>
    findByNombreIgnoreCase(
            String nombre
    );
}