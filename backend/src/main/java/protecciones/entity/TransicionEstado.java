package protecciones.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "transicion_estado")
public class TransicionEstado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(
            name = "estado_origen_id",
            nullable = false
    )
    private Estado estadoOrigen;

    @ManyToOne
    @JoinColumn(
            name = "estado_destino_id",
            nullable = false
    )
    private Estado estadoDestino;

    public TransicionEstado() {
    }

    public Long getId() {
        return id;
    }

    public Estado getEstadoOrigen() {
        return estadoOrigen;
    }

    public Estado getEstadoDestino() {
        return estadoDestino;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEstadoOrigen(
            Estado estadoOrigen
    ) {
        this.estadoOrigen = estadoOrigen;
    }

    public void setEstadoDestino(
            Estado estadoDestino
    ) {
        this.estadoDestino = estadoDestino;
    }
}