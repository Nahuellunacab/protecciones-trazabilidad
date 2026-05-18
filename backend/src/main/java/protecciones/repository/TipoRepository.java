package protecciones.repository;

import org.springframework.data.jpa.repository.JpaRepository; // Importa la interfaz JpaRepository de Spring Data JPA, que proporciona métodos CRUD (Crear, Leer, Actualizar, Eliminar) y otras operaciones comunes para interactuar con la base de datos.
import protecciones.entity.Tipo;

public interface TipoRepository extends JpaRepository<Tipo, Long> {
}