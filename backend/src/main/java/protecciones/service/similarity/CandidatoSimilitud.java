package protecciones.service.similarity;

/**
 * Candidato generico a comparar por SimilarityService: cualquier
 * catalogo con nombre libre (Destino, Posicion, Localidad, Marca,
 * Modelo, Proveedor, etc.) se representa aqui solo por id + nombre,
 * sin acoplar el motor de similitud a ninguna entidad JPA concreta.
 */
public class CandidatoSimilitud {

    private final Long id;

    private final String nombre;

    public CandidatoSimilitud(
            Long id,
            String nombre
    ) {

        this.id = id;
        this.nombre = nombre;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }
}
