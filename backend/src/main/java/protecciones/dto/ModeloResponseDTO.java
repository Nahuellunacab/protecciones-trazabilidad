package protecciones.dto;

public class ModeloResponseDTO {

    private Long id;

    private String nombre;

    private String marca;

    public ModeloResponseDTO(
            Long id,
            String nombre,
            String marca
    ) {

        this.id = id;
        this.nombre = nombre;
        this.marca = marca;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getMarca() {
        return marca;
    }
}