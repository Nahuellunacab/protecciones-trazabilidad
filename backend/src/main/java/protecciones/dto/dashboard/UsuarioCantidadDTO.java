package protecciones.dto.dashboard;

public class UsuarioCantidadDTO {

    private String usuario;

    private long cantidad;

    public UsuarioCantidadDTO(
            String usuario,
            long cantidad
    ) {

        this.usuario = usuario;
        this.cantidad = cantidad;
    }

    public String getUsuario() {
        return usuario;
    }

    public long getCantidad() {
        return cantidad;
    }
}
