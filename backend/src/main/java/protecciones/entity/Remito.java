package protecciones.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "remito")
public class Remito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_remito", nullable = false)
    private String numeroRemito;

    private LocalDate fecha;

    @Column(name = "nombre_archivo")
    private String nombreArchivo;

    @Column(name = "ruta_archivo")
    private String rutaArchivo;

    @Column(nullable = false)
    private Boolean asociado = false;   

    @ManyToOne
    @JoinColumn(name = "proveedor_id", nullable = false)
    private Proveedor proveedor;

    public Remito() {
    }

    public Remito(Long id,
                  String numeroRemito,
                  LocalDate fecha,
                  String nombreArchivo,
                  String rutaArchivo,
                  Proveedor proveedor) {

        this.id = id;
        this.numeroRemito = numeroRemito;
        this.fecha = fecha;
        this.nombreArchivo = nombreArchivo;
        this.rutaArchivo = rutaArchivo;
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

    public Proveedor getProveedor() {
        return proveedor;
    }

    public String getNombreArchivo() {
        return nombreArchivo;
    }

    public String getRutaArchivo() {
        return rutaArchivo;
    }

    public Boolean getAsociado() {
        return asociado;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNumeroRemito(String numeroRemito) {
        this.numeroRemito = numeroRemito;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public void setProveedor(Proveedor proveedor) {
        this.proveedor = proveedor;
    }

    public void setNombreArchivo(String nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    }

    public void setRutaArchivo(String rutaArchivo) {
        this.rutaArchivo = rutaArchivo;
    }

    public void setAsociado(Boolean asociado) {
        this.asociado = asociado;
    }
}