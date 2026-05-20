package protecciones.dto;

public class ReleOptionDTO {

    private Long id;

    private String numeroSerie;

    public ReleOptionDTO(
            Long id,
            String numeroSerie
    ) {

        this.id = id;
        this.numeroSerie = numeroSerie;
    }

    public Long getId() {
        return id;
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }
}