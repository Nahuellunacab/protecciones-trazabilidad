package protecciones.dto;

import java.util.List;

// Datos crudos extraidos de un remito, ya sea directamente de la respuesta
// de Gemini (POST /api/remitos/analizar) o reenviados por el frontend para
// revalidar sin volver a llamar a la IA (POST /api/remitos/analizar/revalidar),
// por ejemplo despues de crear una marca/modelo/proveedor faltante desde el
// dialogo de importacion.
public class RemitoDatosExtraidosDTO {

    private String numeroRemito;

    private String fecha;

    private String proveedor;

    private String ordenProvision;

    private List<ReleExtraidoDTO> reles;

    public String getNumeroRemito() {
        return numeroRemito;
    }

    public void setNumeroRemito(
            String numeroRemito
    ) {
        this.numeroRemito = numeroRemito;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(
            String fecha
    ) {
        this.fecha = fecha;
    }

    public String getProveedor() {
        return proveedor;
    }

    public void setProveedor(
            String proveedor
    ) {
        this.proveedor = proveedor;
    }

    public String getOrdenProvision() {
        return ordenProvision;
    }

    public void setOrdenProvision(
            String ordenProvision
    ) {
        this.ordenProvision = ordenProvision;
    }

    public List<ReleExtraidoDTO> getReles() {
        return reles;
    }

    public void setReles(
            List<ReleExtraidoDTO> reles
    ) {
        this.reles = reles;
    }
}
