package protecciones.dto;

public class DestinoSimilarDTO {

    private Long id;

    private String nombre;

    private Long localidadId;

    private String localidad;

    private String provincia;

    private long cantidadReles;

    private int similitud;

    public DestinoSimilarDTO(
            Long id,
            String nombre,
            Long localidadId,
            String localidad,
            String provincia,
            long cantidadReles,
            int similitud
    ) {

        this.id = id;
        this.nombre = nombre;
        this.localidadId = localidadId;
        this.localidad = localidad;
        this.provincia = provincia;
        this.cantidadReles = cantidadReles;
        this.similitud = similitud;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Long getLocalidadId() {
        return localidadId;
    }

    public String getLocalidad() {
        return localidad;
    }

    public String getProvincia() {
        return provincia;
    }

    public long getCantidadReles() {
        return cantidadReles;
    }

    public int getSimilitud() {
        return similitud;
    }
}
