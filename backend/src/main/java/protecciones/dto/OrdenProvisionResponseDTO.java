package protecciones.dto;

public class OrdenProvisionResponseDTO {

    private Long id;

    private String numero;

    private String observaciones;

    private Long cantidadReles;

    private String nombreArchivo;

    public OrdenProvisionResponseDTO(

            Long id,

            String numero,

            String observaciones,

            Long cantidadReles,

            String nombreArchivo
    ) {

        this.id = id;
        this.numero = numero;
        this.observaciones = observaciones;
        this.cantidadReles = cantidadReles;
        this.nombreArchivo = nombreArchivo;
    }

    public Long getId() {
        return id;
    }

    public String getNumero() {
        return numero;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public Long getCantidadReles() {
        return cantidadReles;
    }

    public String getNombreArchivo() {
        return nombreArchivo;
    }
}