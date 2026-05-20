package protecciones.dto;

import jakarta.validation.constraints.NotNull;

public class MovimientoRequestDTO {

    @NotNull
    private Long releId;

    @NotNull
    private Long estadoId;

    @NotNull
    private Long posicionId;

    private String notas;

    public MovimientoRequestDTO() {
    }

    public Long getReleId() {
        return releId;
    }

    public void setReleId(Long releId) {
        this.releId = releId;
    }

    public Long getEstadoId() {
        return estadoId;
    }

    public void setEstadoId(Long estadoId) {
        this.estadoId = estadoId;
    }

    public Long getPosicionId() {
        return posicionId;
    }

    public void setPosicionId(Long posicionId) {
        this.posicionId = posicionId;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }
}