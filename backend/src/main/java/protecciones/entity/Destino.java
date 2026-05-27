package protecciones.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "destino")
public class Destino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String direccion;

    private String telefono;

    private String coordenadas;

    @ManyToOne
    @JoinColumn(
            name = "localidad_id",
            nullable = false
    )
    private Localidad localidad;

    public Destino() {
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public String getCoordenadas() {
        return coordenadas;
    }

    public Localidad getLocalidad() {
        return localidad;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public void setCoordenadas(String coordenadas) {
        this.coordenadas = coordenadas;
    }

    public void setLocalidad(Localidad localidad) {
        this.localidad = localidad;
    }
}