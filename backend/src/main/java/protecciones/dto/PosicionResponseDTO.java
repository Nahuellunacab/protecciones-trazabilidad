package protecciones.dto;

public class PosicionResponseDTO {

    private Long id;

    private String nombre;

    private String destino;

    public PosicionResponseDTO(
            Long id,
            String nombre,
            String destino
    ) {

        this.id = id;
        this.nombre = nombre;
        this.destino = destino;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDestino() {
        return destino;
    }
}