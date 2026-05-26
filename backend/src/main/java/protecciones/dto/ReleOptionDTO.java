package protecciones.dto;

public class ReleOptionDTO {

    private Long id;

    private String numeroSerie;

    private String modelo;

    private String marca;

    private String tension;

    public ReleOptionDTO(
            Long id,
            String numeroSerie,
            String modelo,
            String marca,
            String tension
    ) {

        this.id = id;
        this.numeroSerie = numeroSerie;
        this.modelo = modelo;
        this.marca = marca;
        this.tension = tension;
    }

    public Long getId() {
        return id;
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public String getModelo() {
        return modelo;
    }

    public String getMarca() {
        return marca;
    }

    public String getTension() {
        return tension;
    }
}