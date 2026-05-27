package protecciones.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LocalidadRequestDTO {

    @NotBlank
    private String nombre;

    @NotNull
    private Long provinciaId;

    public LocalidadRequestDTO() {
    }

    public String getNombre() {
        return nombre;
    }

    public Long getProvinciaId() {
        return provinciaId;
    }

    public void setNombre(
            String nombre
    ) {

        this.nombre = nombre;
    }

    public void setProvinciaId(
            Long provinciaId
    ) {

        this.provinciaId =
                provinciaId;
    }
}