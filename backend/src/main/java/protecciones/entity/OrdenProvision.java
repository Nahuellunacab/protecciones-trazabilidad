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
}