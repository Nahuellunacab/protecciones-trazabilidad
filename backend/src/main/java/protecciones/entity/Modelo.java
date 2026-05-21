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

    @Column(name = "tension_desde")
    private Integer tensionDesde;

    @Column(name = "tension_hasta")
    private Integer tensionHasta;

    @Column(name = "tipo_tension")
    private String tipoTension;

    @ManyToOne
    @JoinColumn(
            name = "tipo_id",
            nullable = false
    )
    private Tipo tipo;

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

            Integer tensionDesde,

            Integer tensionHasta,

            String tipoTension,

            Tipo tipo,

            Marca marca
    ) {

        this.id = id;

        this.nombre = nombre;

        this.tensionDesde = tensionDesde;

        this.tensionHasta = tensionHasta;

        this.tipoTension = tipoTension;

        this.tipo = tipo;

        this.marca = marca;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Integer getTensionDesde() {
        return tensionDesde;
    }

    public Integer getTensionHasta() {
        return tensionHasta;
    }

    public String getTipoTension() {
        return tipoTension;
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

    public void setTensionDesde(
            Integer tensionDesde
    ) {

        this.tensionDesde = tensionDesde;
    }

    public void setTensionHasta(
            Integer tensionHasta
    ) {

        this.tensionHasta = tensionHasta;
    }

    public void setTipoTension(
            String tipoTension
    ) {

        this.tipoTension = tipoTension;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    public void setMarca(Marca marca) {
        this.marca = marca;
    }
}