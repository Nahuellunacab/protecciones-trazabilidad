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

    private String tipo;

    private String estadoActual;

    private String posicionActual;

    private String localidadActual;

    private Long modeloId;

    private Long remitoId;

    private String estadoGarantia;

    private Long mesesRestantesGarantia;

    public ReleResponseDTO() {
    }

    public ReleResponseDTO(
            Long id,
            String numeroSerie,
            Integer garantiaMeses,
            LocalDate inicioGarantia,
            LocalDate finGarantia,
            String modelo,
            String marca,
            String tension,
            String tipo,
            String estadoActual,
            String posicionActual,
            String localidadActual,
            Long modeloId,
            Long remitoId,
            String estadoGarantia,
            Long mesesRestantesGarantia
    ) {

        this.id = id;
        this.numeroSerie = numeroSerie;
        this.garantiaMeses = garantiaMeses;
        this.inicioGarantia = inicioGarantia;
        this.finGarantia = finGarantia;
        this.modelo = modelo;
        this.marca = marca;
        this.tension = tension;
        this.tipo = tipo;
        this.estadoActual = estadoActual;
        this.posicionActual = posicionActual;
        this.localidadActual = localidadActual;
        this.modeloId = modeloId;
        this.remitoId = remitoId;
        this.estadoGarantia = estadoGarantia;
        this.mesesRestantesGarantia = mesesRestantesGarantia;
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

    public String getTipo() {
        return tipo;
    }

    public String getEstadoActual() {
        return estadoActual;
    }

    public String getPosicionActual() {
        return posicionActual;
    }

    public String getLocalidadActual() {
        return localidadActual;
    }

    public Long getModeloId() {
        return modeloId;
    }

    public Long getRemitoId() {
        return remitoId;
    }

    public String getEstadoGarantia() {
        return estadoGarantia;
    }

    public Long getMesesRestantesGarantia() {
        return mesesRestantesGarantia;
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

    public void setInicioGarantia(LocalDate inicioGarantia) {
        this.inicioGarantia = inicioGarantia;
    }

    public void setFinGarantia(LocalDate finGarantia) {
        this.finGarantia = finGarantia;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public void setTension(String tension) {
        this.tension = tension;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public void setEstadoActual(String estadoActual) {
        this.estadoActual = estadoActual;
    }

    public void setPosicionActual(String posicionActual) {
        this.posicionActual = posicionActual;
    }

    public void setLocalidadActual(String localidadActual) {
        this.localidadActual = localidadActual;
    }

    public void setModeloId(Long modeloId) {
        this.modeloId = modeloId;
    }

    public void setRemitoId(Long remitoId) {
        this.remitoId = remitoId;
    }

    public void setEstadoGarantia(String estadoGarantia) {
        this.estadoGarantia = estadoGarantia;
    }

    public void setMesesRestantesGarantia(Long mesesRestantesGarantia) {
        this.mesesRestantesGarantia = mesesRestantesGarantia;
    }
}