package protecciones.dto.dashboard;

public class ModeloCantidadDTO {

    private String modelo;

    private long cantidad;

    public ModeloCantidadDTO(
            String modelo,
            long cantidad) {

        this.modelo = modelo;
        this.cantidad = cantidad;
    }

    public String getModelo() {
        return modelo;
    }

    public long getCantidad() {
        return cantidad;
    }
}
