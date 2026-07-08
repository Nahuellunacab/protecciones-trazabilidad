package protecciones.dto;

// Representa un item de rele tal como fue extraido del documento (por
// Gemini) o tal como quedo despues del postprocesamiento de fill-forward,
// antes de validarlo contra los catalogos reales. Se usa tanto para el
// analisis inicial (con archivo) como para la revalidacion (sin archivo,
// despues de que el usuario crea una marca/modelo/proveedor faltante desde
// el dialogo de importacion).
public class ReleExtraidoDTO {

    private String marca;

    private String modelo;

    private String codigoConfiguracion;

    private String numeroSerie;

    public String getMarca() {
        return marca;
    }

    public void setMarca(
            String marca
    ) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(
            String modelo
    ) {
        this.modelo = modelo;
    }

    public String getCodigoConfiguracion() {
        return codigoConfiguracion;
    }

    public void setCodigoConfiguracion(
            String codigoConfiguracion
    ) {
        this.codigoConfiguracion = codigoConfiguracion;
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public void setNumeroSerie(
            String numeroSerie
    ) {
        this.numeroSerie = numeroSerie;
    }
}
