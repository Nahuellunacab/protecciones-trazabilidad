package protecciones.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DestinoRequestDTO {

    @NotBlank
    private String nombre;

    @NotNull
    private Long localidadId;

    public DestinoRequestDTO() {
    }

    public String getNombre() {
        return nombre;
    }

    public Long getLocalidadId() {
        return localidadId;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setLocalidadId(Long localidadId) {
        this.localidadId = localidadId;
    }
}