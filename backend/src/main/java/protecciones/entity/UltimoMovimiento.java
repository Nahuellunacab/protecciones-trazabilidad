package protecciones.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Immutable;

import java.time.LocalDateTime;

/**
 * Entidad de solo lectura mapeada sobre la vista vw_ultimo_movimiento
 * (ver V26__create_vista_ultimo_movimiento.sql).
 *
 * Representa el ultimo Movimiento de cada Rele (por fecha desc, id desc
 * como desempate). Existe unicamente para evitar repetir la subquery
 * NOT EXISTS de "ultimo movimiento por rele" en reportes/KPIs nuevos
 * (dashboard). No se usa para escritura: es un espejo de Movimiento,
 * nunca se persiste ni se actualiza a traves de esta entidad.
 */
@Entity
@Immutable
@Table(name = "vw_ultimo_movimiento")
public class UltimoMovimiento {

    @Id
    private Long id;

    @Column(name = "fecha_movimiento")
    private LocalDateTime fechaMovimiento;

    private String notas;

    @ManyToOne
    @JoinColumn(name = "rele_id")
    private Rele rele;

    @ManyToOne
    @JoinColumn(name = "estado_id")
    private Estado estado;

    @ManyToOne
    @JoinColumn(name = "posicion_id")
    private Posicion posicion;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public UltimoMovimiento() {
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
}
