package protecciones.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ModeloRequestDTO {

    @NotBlank
    private String nombre;

    @NotNull
    private Integer tensionDesde;

    @NotNull
    private Integer tensionHasta;

    @NotBlank
    private String tipoTension;

    @NotNull
    private Long marcaId;

    @NotNull
    private Long tipoId;

    public ModeloRequestDTO() {
    }

    public String getNombre() {
        return nombre;
    }

    public Integer getTensionDesde() {
        return tensionDesde;
    }

    public Integer getTensionHasta() {
        return tensionHasta;
    }

    public String getTipoTension() {
        return tipoTension;
    }

    public Long getMarcaId() {
        return marcaId;
    }

    public Long getTipoId() {
        return tipoId;
    }

    public void setNombre(
            String nombre
    ) {

        this.nombre = nombre;
    }

    public void setTensionDesde(
            Integer tensionDesde
    ) {

        this.tensionDesde = tensionDesde;
    }

    public void setTensionHasta(
            Integer tensionHasta
    ) {

        this.tensionHasta = tensionHasta;
    }

    public void setTipoTension(
            String tipoTension
    ) {

        this.tipoTension = tipoTension;
    }

    public void setMarcaId(
            Long marcaId
    ) {

        this.marcaId = marcaId;
    }

    public void setTipoId(
            Long tipoId
    ) {

        this.tipoId = tipoId;
    }
}