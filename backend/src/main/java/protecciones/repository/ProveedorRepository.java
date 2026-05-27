package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import protecciones.entity.Proveedor;

import java.util.List;
import java.util.Optional;

public interface ProveedorRepository
        extends JpaRepository<Proveedor, Long> {

    List<Proveedor>
    findAllByOrderByNombreAsc();

    Optional<Proveedor>
    findByNombreIgnoreCase(
            String nombre
    );
}