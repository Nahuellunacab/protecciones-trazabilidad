package protecciones.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ModeloRequestDTO {

    @NotBlank
    private String nombre;

    @NotNull
    private Long marcaId;

    public ModeloRequestDTO() {
    }

    public String getNombre() {
        return nombre;
    }

    public Long getMarcaId() {
        return marcaId;
    }

    public void setNombre(
            String nombre
    ) {

        this.nombre = nombre;
    }

    public void setMarcaId(
            Long marcaId
    ) {

        this.marcaId = marcaId;
    }
}
