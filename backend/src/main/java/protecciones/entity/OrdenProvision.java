package protecciones.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "orden_provision")
public class OrdenProvision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            unique = true
    )

    private String numero;

    private String observaciones;

    private Boolean activo = true;

    @Column(name = "nombre_archivo")
    private String nombreArchivo;

    @Column(name = "ruta_archivo")
    private String rutaArchivo;

    public OrdenProvision() {
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

    public Boolean getActivo() {
        return activo;
    }

    public String getNombreArchivo() {
        return nombreArchivo;
    }

    public String getRutaArchivo() {
        return rutaArchivo;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public void setObservaciones(
            String observaciones
    ) {
        this.observaciones = observaciones;
    }

    public void setActivo(
            Boolean activo
    ) {
        this.activo = activo;
    }

    public void setNombreArchivo(String nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    }

    public void setRutaArchivo(String rutaArchivo) {
        this.rutaArchivo = rutaArchivo;
    }
}