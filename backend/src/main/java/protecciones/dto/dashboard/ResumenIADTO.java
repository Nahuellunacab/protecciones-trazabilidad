package protecciones.dto.dashboard;

// resumen = null cuando la IA no esta configurada (sin ANTHROPIC_API_KEY) o
// cuando la llamada a Anthropic fallo/timeoutio: el frontend debe ocultar la
// seccion en ese caso, nunca mostrar un error de negocio por esto.
public class ResumenIADTO {

    private String resumen;

    public ResumenIADTO(String resumen) {

        this.resumen =
                resumen;
    }

    public String getResumen() {
        return resumen;
    }
}
