package protecciones.dto;

public class ValidacionItemDTO {

    private String mensaje;

    private String severidad;

    public ValidacionItemDTO(
            String mensaje,
            String severidad
    ) {

        this.mensaje = mensaje;
        this.severidad = severidad;
    }

    public String getMensaje() {
        return mensaje;
    }

    public String getSeveridad() {
        return severidad;
    }
}
