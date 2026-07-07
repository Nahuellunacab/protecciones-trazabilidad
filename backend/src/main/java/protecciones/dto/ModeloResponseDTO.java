package protecciones.dto;

public class ModeloResponseDTO {

    private Long id;

    private String nombre;

    private Long marcaId;

    private String marca;

    private Long cantidadRelesActivos;

    private Long cantidadRelesBaja;

    private Long cantidadTotalReles;

    public ModeloResponseDTO(

            Long id,

            String nombre,

            Long marcaId,

            String marca,

            Long cantidadRelesActivos,

            Long cantidadRelesBaja,

            Long cantidadTotalReles
    ) {

        this.id = id;

        this.nombre = nombre;

        this.marcaId = marcaId;

        this.marca = marca;

        this.cantidadRelesActivos =
                cantidadRelesActivos;

        this.cantidadRelesBaja =
                cantidadRelesBaja;

        this.cantidadTotalReles =
                cantidadTotalReles;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Long getMarcaId() {
        return marcaId;
    }

    public String getMarca() {
        return marca;
    }

    public Long getCantidadRelesActivos() {
        return cantidadRelesActivos;
    }

    public Long getCantidadRelesBaja() {
        return cantidadRelesBaja;
    }

    public Long getCantidadTotalReles() {
        return cantidadTotalReles;
    }
}
