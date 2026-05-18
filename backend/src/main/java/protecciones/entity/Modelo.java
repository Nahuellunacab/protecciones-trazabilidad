package protecciones.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "modelo")
public class Modelo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String tension;

    @ManyToOne
    @JoinColumn(name = "tipo_id", nullable = false)
    private Tipo tipo;

    @ManyToOne
    @JoinColumn(name = "marca_id", nullable = false)
    private Marca marca;

    public Modelo() {
    }

    public Modelo(Long id, String nombre, String tension, Tipo tipo, Marca marca) {
        this.id = id;
        this.nombre = nombre;
        this.tension = tension;
        this.tipo = tipo;
        this.marca = marca;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getTension() {
        return tension;
    }

    public Tipo getTipo() {
        return tipo;
    }

    public Marca getMarca() {
        return marca;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setTension(String tension) {
        this.tension = tension;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    public void setMarca(Marca marca) {
        this.marca = marca;
    }
}