package protecciones.entity;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity
@Table(name = "rele")
public class Rele {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_serie", nullable = false, unique = true)
    private String numeroSerie;

    @Column(name = "codigo_configuracion", length = 500)
    private String codigoConfiguracion;

    @Column(name = "garantia_meses")
    private Integer garantiaMeses;

    @Column(name = "inicio_garantia")
    private LocalDate inicioGarantia;

    @Column(name = "fin_garantia")
    private LocalDate finGarantia;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "motivo_baja")
    private String motivoBaja;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    @ManyToOne
    @JoinColumn(name = "modelo_id", nullable = false)
    private Modelo modelo;

    @ManyToOne
    @JoinColumn(name = "remito_id")
    private Remito remito;

    @ManyToOne
    @JoinColumn(name = "orden_provision_id")
    private OrdenProvision ordenProvision;

    @Column(name = "tipo_ingreso")
    private String tipoIngreso;

    public Rele() {
    }

    public Rele(
            Long id,
            String numeroSerie,
            String codigoConfiguracion,
            Integer garantiaMeses,
            LocalDate inicioGarantia,
            LocalDate finGarantia,
            Modelo modelo,
            Remito remito
    ) {

        this.id = id;
        this.numeroSerie = numeroSerie;
        this.codigoConfiguracion = codigoConfiguracion;
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

    public Boolean getActivo() {
        return activo;
    }

    public String getMotivoBaja() {
        return motivoBaja;
    }

    public LocalDateTime getFechaBaja() {
        return fechaBaja;
    }

    public Modelo getModelo() {
        return modelo;
    }

    public Remito getRemito() {
        return remito;
    }

    public String getTipoIngreso() {
        return tipoIngreso;
    }

    public OrdenProvision getOrdenProvision() {
        return ordenProvision;
    }

    public String getCodigoConfiguracion() {
        return codigoConfiguracion;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNumeroSerie(String numeroSerie) {
        this.numeroSerie = numeroSerie;
    }

    public void setCodigoConfiguracion(
        String codigoConfiguracion
    ) {
        this.codigoConfiguracion =
                codigoConfiguracion;
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

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public void setMotivoBaja(String motivoBaja) {
        this.motivoBaja = motivoBaja;
    }

    public void setFechaBaja(LocalDateTime fechaBaja) {
        this.fechaBaja = fechaBaja;
    }

    public void setModelo(Modelo modelo) {
        this.modelo = modelo;
    }

    public void setRemito(Remito remito) {
        this.remito = remito;
    }

    public void setTipoIngreso(
            String tipoIngreso
    ) {

        this.tipoIngreso =
                tipoIngreso;
    }

    public void setOrdenProvision(
            OrdenProvision ordenProvision
    ) {
        this.ordenProvision = ordenProvision;
    }
}