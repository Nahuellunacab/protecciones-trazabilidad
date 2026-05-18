package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import protecciones.entity.Proveedor;

public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
}