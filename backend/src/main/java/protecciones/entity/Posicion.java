package protecciones.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "posicion")
public class Posicion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @ManyToOne
    @JoinColumn(name = "destino_id", nullable = false)
    private Destino destino;

    public Posicion() {
    }

    public Posicion(Long id, String nombre, Destino destino) {
        this.id = id;
        this.nombre = nombre;
        this.destino = destino;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Destino getDestino() {
        return destino;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setDestino(Destino destino) {
        this.destino = destino;
    }
}