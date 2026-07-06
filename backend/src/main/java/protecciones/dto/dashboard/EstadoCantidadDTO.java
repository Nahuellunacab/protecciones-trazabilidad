package protecciones.dto.dashboard;

public class EstadoCantidadDTO {

    private String estado;

    private long cantidad;

    public EstadoCantidadDTO(
            String estado,
            long cantidad
    ) {

        this.estado = estado;
        this.cantidad = cantidad;
    }

    public String getEstado() {
        return estado;
    }

    public long getCantidad() {
        return cantidad;
    }
}
