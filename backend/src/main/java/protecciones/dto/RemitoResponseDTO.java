package protecciones.dto;

import java.time.LocalDate;

public class RemitoResponseDTO {

    private Long id;

    private String numeroRemito;

    private LocalDate fecha;

    private String proveedor;

    public RemitoResponseDTO(

            Long id,
            String numeroRemito,
            LocalDate fecha,
            String proveedor
    ) {

        this.id = id;
        this.numeroRemito = numeroRemito;
        this.fecha = fecha;
        this.proveedor = proveedor;
    }

    public Long getId() {
        return id;
    }

    public String getNumeroRemito() {
        return numeroRemito;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public String getProveedor() {
        return proveedor;
    }
}