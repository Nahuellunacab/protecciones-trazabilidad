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

    @ManyToOne
    @JoinColumn(
            name = "marca_id",
            nullable = false
    )
    private Marca marca;

    public Modelo() {
    }

    public Modelo(

            Long id,

            String nombre,

            Marca marca
    ) {

        this.id = id;

        this.nombre = nombre;

        this.marca = marca;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
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

    public void setMarca(Marca marca) {
        this.marca = marca;
    }
}
