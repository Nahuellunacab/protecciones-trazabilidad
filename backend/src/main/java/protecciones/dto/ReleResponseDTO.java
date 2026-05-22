package protecciones.dto;

import java.time.LocalDate;

public class ReleResponseDTO {

    private Long id;

    private String numeroSerie;

    private Integer garantiaMeses;

    private LocalDate inicioGarantia;

    private LocalDate finGarantia;

    private String modelo;

    private String marca;

    private String tension;

    private Long modeloId;

    private Long remitoId;

    public ReleResponseDTO(
            Long id,
            String numeroSerie,
            Integer garantiaMeses,
            LocalDate inicioGarantia,
            LocalDate finGarantia,
            String modelo,
            String marca,
            String tension,
            Long modeloId,
            Long remitoId
    ) {

        this.id = id;
        this.numeroSerie = numeroSerie;
        this.garantiaMeses = garantiaMeses;
        this.inicioGarantia = inicioGarantia;
        this.finGarantia = finGarantia;
        this.modelo = modelo;
        this.marca = marca;
        this.tension = tension;
        this.modeloId = modeloId;
        this.remitoId = remitoId;
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

    public LocalDate getInicioGarantia() {
        return inicioGarantia;
    }

    public LocalDate getFinGarantia() {
        return finGarantia;
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

    public Long getModeloId() {
        return modeloId;
    }

    public Long getRemitoId() {
        return remitoId;
    }
}