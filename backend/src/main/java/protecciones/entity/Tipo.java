package protecciones.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tipo")
public class Tipo {

    @Id // indica que el campo "id" es la clave primaria de la entidad.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Especifica que el valor del campo "id" se generará automáticamente por la base de datos utilizando una estrategia de identidad, lo que significa que se incrementará automáticamente con cada nuevo registro insertado.
    private Long id;

    @Column(nullable = false) // Especifica que el campo "nombre" no puede ser nulo en la base de datos, lo que garantiza que cada registro de tipo tenga un nombre válido.
    private String nombre;

    public Tipo() { // Constructor vacío necesario para que JPA pueda crear instancias de la entidad.
    }

    public Tipo(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}