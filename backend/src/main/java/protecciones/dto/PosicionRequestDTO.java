package protecciones.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PosicionRequestDTO {

    @NotBlank
    private String nombre;

    @NotNull
    private Long destinoId;

    public PosicionRequestDTO() {
    }

    public String getNombre() {
        return nombre;
    }

    public Long getDestinoId() {
        return destinoId;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setDestinoId(Long destinoId) {
        this.destinoId = destinoId;
    }
}