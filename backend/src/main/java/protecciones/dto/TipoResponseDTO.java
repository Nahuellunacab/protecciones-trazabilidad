package protecciones.dto;

public class TipoResponseDTO {

    private Long id;

    private String nombre;

    public TipoResponseDTO(
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