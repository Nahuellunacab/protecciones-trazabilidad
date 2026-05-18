package protecciones.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "rele")
public class Rele {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_serie", nullable = false, unique = true)
    private String numeroSerie;

    @Column(name = "garantia_meses")
    private Integer garantiaMeses;

    @Column(name = "inicio_garantia")
    private LocalDate inicioGarantia;

    @Column(name = "fin_garantia")
    private LocalDate finGarantia;

    @ManyToOne
    @JoinColumn(name = "modelo_id", nullable = false)
    private Modelo modelo;

    @ManyToOne
    @JoinColumn(name = "remito_id")
    private Remito remito;

    public Rele() {
    }

    public Rele(Long id,
                String numeroSerie,
                Integer garantiaMeses,
                LocalDate inicioGarantia,
                LocalDate finGarantia,
                Modelo modelo,
                Remito remito) {

        this.id = id;
        this.numeroSerie = numeroSerie;
        this.garantiaMeses = garantiaMeses;
        this.inicioGarantia = inicioGarantia;
        this.finGarantia = finGarantia;
        this.modelo = modelo;
        this.remito = remito;
    }

    public Long getId() {
        return id;
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public Integer getGarantiaMeses() {
        return garantiaMeses;
    }

    public LocalDate getInicioGarantia() {
        return inicioGarantia;
    }

    public LocalDate getFinGarantia() {
        return finGarantia;
    }

    public Modelo getModelo() {
        return modelo;
    }

    public Remito getRemito() {
        return remito;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNumeroSerie(String numeroSerie) {
        this.numeroSerie = numeroSerie;
    }

    public void setGarantiaMeses(Integer garantiaMeses) {
        this.garantiaMeses = garantiaMeses;
    }

    public void setInicioGarantia(LocalDate inicioGarantia) {
        this.inicioGarantia = inicioGarantia;
    }

    public void setFinGarantia(LocalDate finGarantia) {
        this.finGarantia = finGarantia;
    }

    public void setModelo(Modelo modelo) {
        this.modelo = modelo;
    }

    public void setRemito(Remito remito) {
        this.remito = remito;
    }
}