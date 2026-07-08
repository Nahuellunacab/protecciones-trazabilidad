package protecciones.dto;

// Accion de navegacion/filtrado que el Copiloto IA le propone ejecutar al
// frontend. Todos los campos son opcionales (dependen del tipo de accion);
// nunca representa una operacion de escritura: el propio vocabulario de
// "accion" soportado (ver CopilotoIAService) esta limitado a navegar y
// filtrar, nunca a crear/modificar/eliminar nada.
public class CopilotoAccionDTO {

    private String accion;

    private String marca;

    private String modelo;

    private String estado;

    private String proveedor;

    private String destino;

    private String serie;

    private String modulo;

    public String getAccion() {
        return accion;
    }

    public void setAccion(
            String accion
    ) {
        this.accion = accion;
    }

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

    public String getEstado() {
        return estado;
    }

    public void setEstado(
            String estado
    ) {
        this.estado = estado;
    }

    public String getProveedor() {
        return proveedor;
    }

    public void setProveedor(
            String proveedor
    ) {
        this.proveedor = proveedor;
    }

    public String getDestino() {
        return destino;
    }

    public void setDestino(
            String destino
    ) {
        this.destino = destino;
    }

    public String getSerie() {
        return serie;
    }

    public void setSerie(
            String serie
    ) {
        this.serie = serie;
    }

    public String getModulo() {
        return modulo;
    }

    public void setModulo(
            String modulo
    ) {
        this.modulo = modulo;
    }
}
