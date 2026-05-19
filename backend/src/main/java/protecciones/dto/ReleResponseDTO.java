package protecciones.dto;

public class ReleResponseDTO {

    private Long id;

    private String numeroSerie;

    private Integer garantiaMeses;

    private String modelo;

    private String marca;

    public ReleResponseDTO() {
    }

    public ReleResponseDTO(Long id,
                            String numeroSerie,
                            Integer garantiaMeses,
                            String modelo,
                            String marca) {

        this.id = id;
        this.numeroSerie = numeroSerie;
        this.garantiaMeses = garantiaMeses;
        this.modelo = modelo;
        this.marca = marca;
    }

    public Long getId() {
        return id;
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public Integer getGarantiaMeses() {
        return garantiaMeses;
    }

    public String getModelo() {
        return modelo;
    }

    public String getMarca() {
        return marca;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNumeroSerie(String numeroSerie) {
        this.numeroSerie = numeroSerie;
    }

    public void setGarantiaMeses(Integer garantiaMeses) {
        this.garantiaMeses = garantiaMeses;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }
}