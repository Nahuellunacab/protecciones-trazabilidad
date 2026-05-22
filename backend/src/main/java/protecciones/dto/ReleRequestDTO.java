package protecciones.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public class ReleRequestDTO {

    @NotBlank(
            message = "El número de serie es obligatorio"
    )
    private String numeroSerie;

    private Boolean cargarGarantia;

    @Positive(
            message = "La garantía debe ser mayor a cero"
    )
    private Integer garantiaMeses;

    private LocalDate inicioGarantia;

    @NotNull(
            message = "El modelo es obligatorio"
    )
    private Long modeloId;

    private Long remitoId;

    public ReleRequestDTO() {
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public Boolean getCargarGarantia() {
        return cargarGarantia;
    }

    public Integer getGarantiaMeses() {
        return garantiaMeses;
    }

    public LocalDate getInicioGarantia() {
        return inicioGarantia;
    }

    public Long getModeloId() {
        return modeloId;
    }

    public Long getRemitoId() {
        return remitoId;
    }

    public void setNumeroSerie(
            String numeroSerie
    ) {

        this.numeroSerie = numeroSerie;
    }

    public void setCargarGarantia(
            Boolean cargarGarantia
    ) {

        this.cargarGarantia = cargarGarantia;
    }

    public void setGarantiaMeses(
            Integer garantiaMeses
    ) {

        this.garantiaMeses = garantiaMeses;
    }

    public void setInicioGarantia(
            LocalDate inicioGarantia
    ) {

        this.inicioGarantia = inicioGarantia;
    }

    public void setModeloId(
            Long modeloId
    ) {

        this.modeloId = modeloId;
    }

    public void setRemitoId(
            Long remitoId
    ) {

        this.remitoId = remitoId;
    }
}