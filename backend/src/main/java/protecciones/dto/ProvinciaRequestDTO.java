package protecciones.dto;

import jakarta.validation.constraints.NotBlank;

public class ProvinciaRequestDTO {

    @NotBlank
    private String nombre;

    public ProvinciaRequestDTO() {
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(
            String nombre
    ) {

        this.nombre = nombre;
    }
}