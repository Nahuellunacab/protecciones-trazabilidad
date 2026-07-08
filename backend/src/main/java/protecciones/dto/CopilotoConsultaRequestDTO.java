package protecciones.dto;

import jakarta.validation.constraints.NotBlank;

public class CopilotoConsultaRequestDTO {

    @NotBlank(
            message = "El mensaje es obligatorio"
    )
    private String mensaje;

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(
            String mensaje
    ) {
        this.mensaje = mensaje;
    }
}
