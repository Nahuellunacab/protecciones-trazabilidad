package protecciones.dto.dashboard;

import java.time.LocalDateTime;

// resumen = null cuando la IA no esta configurada (sin GEMINI_API_KEY) o
// cuando la llamada a Gemini fallo/timeoutio: el frontend debe ocultar la
// seccion en ese caso, nunca mostrar un error de negocio por esto.
// generadoEn = momento real en que el backend genero (o regenero) el
// resumen devuelto, no el momento en que este pedido en particular llego:
// como el resumen se cachea 4 horas, la mayoria de los pedidos devuelven
// un resumen generado antes. Null cuando resumen es null.
public class ResumenIADTO {

    private String resumen;

    private LocalDateTime generadoEn;

    public ResumenIADTO(
            String resumen,
            LocalDateTime generadoEn
    ) {

        this.resumen =
                resumen;

        this.generadoEn =
                generadoEn;
    }

    public String getResumen() {
        return resumen;
    }

    public LocalDateTime getGeneradoEn() {
        return generadoEn;
    }
}
