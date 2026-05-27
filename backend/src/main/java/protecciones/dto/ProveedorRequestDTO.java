package protecciones.dto;

import jakarta.validation.constraints.NotBlank;

public class ProveedorRequestDTO {

    @NotBlank
    private String nombre;

    private String domicilio;

    private String telefono;

    public ProveedorRequestDTO() {
    }

    public String getNombre() {
        return nombre;
    }

    public String getDomicilio() {
        return domicilio;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setNombre(
            String nombre
    ) {

        this.nombre = nombre;
    }

    public void setDomicilio(
            String domicilio
    ) {

        this.domicilio = domicilio;
    }

    public void setTelefono(
            String telefono
    ) {

        this.telefono = telefono;
    }
}