package protecciones.dto;

import jakarta.validation.constraints.NotBlank;

public class OrdenProvisionRequestDTO {

    @NotBlank
    private String numero;

    private String observaciones;

    public String getNumero() {
        return numero;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setNumero(
            String numero
    ) {
        this.numero = numero;
    }

    public void setObservaciones(
            String observaciones
    ) {
        this.observaciones = observaciones;
    }
}