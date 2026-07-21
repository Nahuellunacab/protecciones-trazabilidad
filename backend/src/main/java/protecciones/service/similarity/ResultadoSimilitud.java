package protecciones.service.similarity;

/**
 * Resultado generico de SimilarityService: id/nombre del candidato
 * encontrado y el porcentaje de similitud (entero, 0-100) contra el
 * texto ingresado.
 */
public class ResultadoSimilitud {

    private final Long id;

    private final String nombre;

    private final int similitud;

    public ResultadoSimilitud(
            Long id,
            String nombre,
            int similitud
    ) {

        this.id = id;
        this.nombre = nombre;
        this.similitud = similitud;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public int getSimilitud() {
        return similitud;
    }
}
