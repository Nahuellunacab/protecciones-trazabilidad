package protecciones.dto.dashboard;

public class MarcaCantidadDTO {

    private String marca;

    private long cantidad;

    public MarcaCantidadDTO(
            String marca,
            long cantidad
    ) {

        this.marca = marca;
        this.cantidad = cantidad;
    }

    public String getMarca() {
        return marca;
    }

    public long getCantidad() {
        return cantidad;
    }
}