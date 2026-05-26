package protecciones.dto;

import jakarta.validation.constraints.NotBlank;

public class BajaReleRequestDTO {

    @NotBlank(
            message = "El motivo de baja es obligatorio"
    )
    private String motivo;

    public BajaReleRequestDTO() {
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
}