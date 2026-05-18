package protecciones.service;

import org.springframework.stereotype.Service;
import protecciones.entity.Tipo;
import protecciones.repository.TipoRepository;

import java.util.List; // Importa la clase List de Java, que se utiliza para manejar colecciones de objetos, en este caso, una lista de objetos Tipo.

@Service
public class TipoService {

    private final TipoRepository tipoRepository;

    // Constructor de la clase TipoService que recibe una instancia de TipoRepository. La anotación @Service indica que esta clase es un componente de servicio en el contexto de Spring, lo que permite que sea detectada y gestionada por el contenedor de Spring.
    public TipoService(TipoRepository tipoRepository) {
        this.tipoRepository = tipoRepository;
    }

    // Método que obtiene todos los objetos Tipo de la base de datos utilizando el método findAll() del repositorio.
    public List<Tipo> obtenerTodos() {
        return tipoRepository.findAll();
    }

    // Método que guarda un nuevo objeto Tipo en la base de datos utilizando el método save() del repositorio. Devuelve el objeto Tipo guardado, que incluye el ID generado automáticamente por la base de datos.
    public Tipo guardar(Tipo tipo) {
        return tipoRepository.save(tipo);
    }
}