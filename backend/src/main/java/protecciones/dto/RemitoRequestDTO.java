package protecciones.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class RemitoRequestDTO {

    @NotBlank
    private String numeroRemito;

    @NotNull
    private LocalDate fecha;

    @NotNull
    private Long proveedorId;

    public RemitoRequestDTO() {
    }

    public String getNumeroRemito() {
        return numeroRemito;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public Long getProveedorId() {
        return proveedorId;
    }

    public void setNumeroRemito(
            String numeroRemito
    ) {

        this.numeroRemito =
                numeroRemito;
    }

    public void setFecha(
            LocalDate fecha
    ) {

        this.fecha = fecha;
    }

    public void setProveedorId(
            Long proveedorId
    ) {

        this.proveedorId =
                proveedorId;
    }
}