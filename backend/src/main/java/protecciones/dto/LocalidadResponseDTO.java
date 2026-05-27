package protecciones.dto;

public class LocalidadResponseDTO {

    private Long id;

    private String nombre;

    private String provincia;

    public LocalidadResponseDTO(
            Long id,
            String nombre,
            String provincia
    ) {

        this.id = id;
        this.nombre = nombre;
        this.provincia = provincia;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getProvincia() {
        return provincia;
    }
}