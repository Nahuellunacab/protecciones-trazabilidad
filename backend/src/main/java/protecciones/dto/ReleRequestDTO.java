package protecciones.dto;

import jakarta.validation.constraints.NotBlank; // Para validar que el campo no esté vacío o solo contenga espacios en blanco.
import jakarta.validation.constraints.NotNull;  // Para validar que el campo no sea nulo.
import jakarta.validation.constraints.Positive; // Para validar que el número sea positivo (mayor que cero).

public class ReleRequestDTO {

    @NotBlank(message = "El número de serie es obligatorio")
    private String numeroSerie;

    @Positive(message = "La garantía debe ser mayor a cero")
    private Integer garantiaMeses;

    @NotNull(message = "El modelo es obligatorio")
    private Long modeloId;

    private Long remitoId;

    public ReleRequestDTO() {
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public Integer getGarantiaMeses() {
        return garantiaMeses;
    }

    public Long getModeloId() {
        return modeloId;
    }

    public Long getRemitoId() {
        return remitoId;
    }

    public void setNumeroSerie(String numeroSerie) {
        this.numeroSerie = numeroSerie;
    }

    public void setGarantiaMeses(Integer garantiaMeses) {
        this.garantiaMeses = garantiaMeses;
    }

    public void setModeloId(Long modeloId) {
        this.modeloId = modeloId;
    }

    public void setRemitoId(Long remitoId) {
        this.remitoId = remitoId;
    }
}