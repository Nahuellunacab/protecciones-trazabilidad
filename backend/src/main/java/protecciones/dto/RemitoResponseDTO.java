package protecciones.dto;

import java.time.LocalDate;

public class RemitoResponseDTO {

    private Long id;

    private String numeroRemito;

    private LocalDate fecha;

    private Long proveedorId;

    private String proveedor;

    private Long cantidadReles;

    private Boolean tieneArchivo;

    public RemitoResponseDTO(

            Long id,
            String numeroRemito,
            LocalDate fecha,
            Long proveedorId,
            String proveedor,
            Long cantidadReles,
            Boolean tieneArchivo
    ) {

        this.id = id;
        this.numeroRemito = numeroRemito;
        this.fecha = fecha;
        this.proveedorId = proveedorId;
        this.proveedor = proveedor;
        this.cantidadReles = cantidadReles;
        this.tieneArchivo = tieneArchivo;
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

    public Long getProveedorId() {
        return proveedorId;
    }

    public String getProveedor() {
        return proveedor;
    }

    public Long getCantidadReles() {
        return cantidadReles;
    }

    public Boolean getTieneArchivo() {
        return tieneArchivo;
    }
}
