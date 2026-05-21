package protecciones.dto;

import jakarta.validation.constraints.NotBlank;

public class MarcaRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    public MarcaRequestDTO() {
    }

    public MarcaRequestDTO(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}