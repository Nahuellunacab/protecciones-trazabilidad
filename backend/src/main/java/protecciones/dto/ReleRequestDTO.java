package protecciones.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class ReleRequestDTO {

    @NotBlank(
            message = "El número de serie es obligatorio"
    )
    private String numeroSerie;

    @Size(
            max = 150,
            message = "El código de configuración no puede superar los 150 caracteres"
    )
    private String codigoConfiguracion;

    @Size(
            max = 150,
            message = "El order code no puede superar los 150 caracteres"
    )
    private String orderCode;

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
    @NotBlank(
            message =
                    "El tipo de ingreso es obligatorio"
    )
    private String tipoIngreso;

    private Long posicionInicialId;

    private Long estadoInicialId;

    private Long ordenProvisionId;

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

    public String getTipoIngreso() {
        return tipoIngreso;
    }

    public Long getPosicionInicialId() {
        return posicionInicialId;
    }

    public Long getEstadoInicialId() {
        return estadoInicialId;
    }

    public Long getOrdenProvisionId() {
        return ordenProvisionId;
    }

    public String getCodigoConfiguracion() {
        return codigoConfiguracion;
    }

    public String getOrderCode() {
        return orderCode;
    }

    public void setOrderCode(
            String orderCode
    ) {
        this.orderCode = orderCode;
    }

    public void setNumeroSerie(
            String numeroSerie
    ) {

        this.numeroSerie = numeroSerie;
    }

    public void setCodigoConfiguracion(
        String codigoConfiguracion
    ) {
        this.codigoConfiguracion =
                codigoConfiguracion;
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

    public void setTipoIngreso(
            String tipoIngreso
    ) {

        this.tipoIngreso =
                tipoIngreso;
    }

    public void setPosicionInicialId(
            Long posicionInicialId
    ) {
        this.posicionInicialId =
                posicionInicialId;
    }

    public void setEstadoInicialId(
            Long estadoInicialId
    ) {
        this.estadoInicialId =
                estadoInicialId;
    }

    public void setOrdenProvisionId(
         Long ordenProvisionId
    ) {
        this.ordenProvisionId =
                ordenProvisionId;
    }
}