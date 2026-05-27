package protecciones.dto;

public class ProvinciaResponseDTO {

    private Long id;

    private String nombre;

    public ProvinciaResponseDTO(
            Long id,
            String nombre
    ) {

        this.id = id;
        this.nombre = nombre;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }
}