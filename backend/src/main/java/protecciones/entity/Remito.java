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

    @ManyToOne
    @JoinColumn(name = "proveedor_id", nullable = false)
    private Proveedor proveedor;

    public Remito() {
    }

    public Remito(Long id,
                  String numeroRemito,
                  LocalDate fecha,
                  Proveedor proveedor) {

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

    public Proveedor getProveedor() {
        return proveedor;
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
}