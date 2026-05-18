package protecciones.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "movimiento")
public class Movimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_movimiento")
    private LocalDateTime fechaMovimiento;

    private String notas;

    @ManyToOne
    @JoinColumn(name = "rele_id", nullable = false)
    private Rele rele;

    @ManyToOne
    @JoinColumn(name = "estado_id", nullable = false)
    private Estado estado;

    @ManyToOne
    @JoinColumn(name = "posicion_id", nullable = false)
    private Posicion posicion;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    public Movimiento() {
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getFechaMovimiento() {
        return fechaMovimiento;
    }

    public String getNotas() {
        return notas;
    }

    public Rele getRele() {
        return rele;
    }

    public Estado getEstado() {
        return estado;
    }

    public Posicion getPosicion() {
        return posicion;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFechaMovimiento(LocalDateTime fechaMovimiento) {
        this.fechaMovimiento = fechaMovimiento;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }

    public void setRele(Rele rele) {
        this.rele = rele;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    public void setPosicion(Posicion posicion) {
        this.posicion = posicion;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}