package protecciones.dto;

public class ModeloResponseDTO {

    private Long id;

    private String nombre;

    private Integer tensionDesde;

    private Integer tensionHasta;

    private String tipoTension;

    private Long marcaId;

    private String marca;

    private Long tipoId;

    private String tipo;

    private Long cantidadRelesActivos;

    private Long cantidadRelesBaja;

    private Long cantidadTotalReles;

    public ModeloResponseDTO(

            Long id,

            String nombre,

            Integer tensionDesde,

            Integer tensionHasta,

            String tipoTension,

            Long marcaId,

            String marca,

            Long tipoId,

            String tipo,

            Long cantidadRelesActivos,

            Long cantidadRelesBaja,

            Long cantidadTotalReles
    ) {

        this.id = id;

        this.nombre = nombre;

        this.tensionDesde = tensionDesde;

        this.tensionHasta = tensionHasta;

        this.tipoTension = tipoTension;

        this.marcaId = marcaId;

        this.marca = marca;

        this.tipoId = tipoId;

        this.tipo = tipo;

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

    public Integer getTensionDesde() {
        return tensionDesde;
    }

    public Integer getTensionHasta() {
        return tensionHasta;
    }

    public String getTipoTension() {
        return tipoTension;
    }

    public Long getMarcaId() {
        return marcaId;
    }

    public String getMarca() {
        return marca;
    }

    public Long getTipoId() {
        return tipoId;
    }

    public String getTipo() {
        return tipo;
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