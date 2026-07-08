package protecciones.dto;

import java.util.List;

public class ReleDetectadoDTO {

    private String numeroSerie;

    private String modelo;

    private String marca;

    private String codigoConfiguracion;

    private Long modeloId;

    private Long marcaId;

    private boolean valido;

    private List<ValidacionItemDTO> validaciones;

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public void setNumeroSerie(
            String numeroSerie
    ) {
        this.numeroSerie = numeroSerie;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(
            String modelo
    ) {
        this.modelo = modelo;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(
            String marca
    ) {
        this.marca = marca;
    }

    public String getCodigoConfiguracion() {
        return codigoConfiguracion;
    }

    public void setCodigoConfiguracion(
            String codigoConfiguracion
    ) {
        this.codigoConfiguracion = codigoConfiguracion;
    }

    public Long getModeloId() {
        return modeloId;
    }

    public void setModeloId(
            Long modeloId
    ) {
        this.modeloId = modeloId;
    }

    public Long getMarcaId() {
        return marcaId;
    }

    public void setMarcaId(
            Long marcaId
    ) {
        this.marcaId = marcaId;
    }

    public boolean isValido() {
        return valido;
    }

    public void setValido(
            boolean valido
    ) {
        this.valido = valido;
    }

    public List<ValidacionItemDTO> getValidaciones() {
        return validaciones;
    }

    public void setValidaciones(
            List<ValidacionItemDTO> validaciones
    ) {
        this.validaciones = validaciones;
    }
}
