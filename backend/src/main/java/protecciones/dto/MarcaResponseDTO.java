package protecciones.dto;

public class MarcaResponseDTO {

    private Long id;

    private String nombre;

    public MarcaResponseDTO(
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