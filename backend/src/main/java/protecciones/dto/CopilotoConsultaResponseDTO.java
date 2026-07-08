package protecciones.dto;

public class CopilotoConsultaResponseDTO {

    private String tipo;

    private String respuesta;

    private CopilotoAccionDTO accion;

    public CopilotoConsultaResponseDTO(
            String tipo,
            String respuesta,
            CopilotoAccionDTO accion
    ) {

        this.tipo = tipo;
        this.respuesta = respuesta;
        this.accion = accion;
    }

    public String getTipo() {
        return tipo;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public CopilotoAccionDTO getAccion() {
        return accion;
    }
}
