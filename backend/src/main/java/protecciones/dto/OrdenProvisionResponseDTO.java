package protecciones.dto;

public class OrdenProvisionResponseDTO {

    private Long id;

    private String numero;

    private String observaciones;

    public OrdenProvisionResponseDTO(
            Long id,
            String numero,
            String observaciones
    ) {

        this.id = id;
        this.numero = numero;
        this.observaciones = observaciones;
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
}