package protecciones.dto;

public class DestinoResponseDTO {

    private Long id;

    private String nombre;

    private String localidad;

    private String provincia;

    public DestinoResponseDTO(
            Long id,
            String nombre,
            String localidad,
            String provincia
    ) {

        this.id = id;
        this.nombre = nombre;
        this.localidad = localidad;
        this.provincia = provincia;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getLocalidad() {
        return localidad;
    }

    public String getProvincia() {
        return provincia;
    }
}