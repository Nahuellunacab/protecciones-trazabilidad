package protecciones.dto;

public class ProveedorResponseDTO {

    private Long id;

    private String nombre;

    private String domicilio;

    private String telefono;

    public ProveedorResponseDTO(

            Long id,
            String nombre,
            String domicilio,
            String telefono
    ) {

        this.id = id;
        this.nombre = nombre;
        this.domicilio = domicilio;
        this.telefono = telefono;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDomicilio() {
        return domicilio;
    }

    public String getTelefono() {
        return telefono;
    }
}