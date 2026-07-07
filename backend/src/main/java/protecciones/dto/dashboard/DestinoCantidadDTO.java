package protecciones.dto.dashboard;

public class DestinoCantidadDTO {

    private String destino;

    private long cantidad;

    public DestinoCantidadDTO(
            String destino,
            long cantidad
    ) {

        this.destino = destino;
        this.cantidad = cantidad;
    }

    public String getDestino() {
        return destino;
    }

    public long getCantidad() {
        return cantidad;
    }
}
