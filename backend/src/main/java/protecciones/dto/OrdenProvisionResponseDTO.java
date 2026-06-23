package protecciones.dto;

public class OrdenProvisionResponseDTO {

    private Long id;

    private String numero;

    private String observaciones;

    private Long cantidadReles;

    public OrdenProvisionResponseDTO(
            Long id,
            String numero,
            String observaciones,
            Long cantidadReles
    ) {

        this.id = id;
        this.numero = numero;
        this.observaciones = observaciones;
        this.cantidadReles = cantidadReles;
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
}