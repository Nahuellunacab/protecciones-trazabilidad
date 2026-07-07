package protecciones.dto.dashboard;

public class ProveedorCantidadDTO {

    private String proveedor;

    private long cantidad;

    public ProveedorCantidadDTO(
            String proveedor,
            long cantidad
    ) {

        this.proveedor = proveedor;
        this.cantidad = cantidad;
    }

    public String getProveedor() {
        return proveedor;
    }

    public long getCantidad() {
        return cantidad;
    }
}
