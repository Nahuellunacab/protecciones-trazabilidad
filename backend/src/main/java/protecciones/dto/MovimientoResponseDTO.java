package protecciones.dto;

import java.time.LocalDateTime;

public class MovimientoResponseDTO {

    private Long id;

    private String rele;

    private LocalDateTime fechaMovimiento;

    private String estado;

    private String posicion;

    private String usuario;

    private String notas;

    public MovimientoResponseDTO() {
    }

    public MovimientoResponseDTO(
            Long id,
            String rele,
            LocalDateTime fechaMovimiento,
            String estado,
            String posicion,
            String usuario,
            String notas
    ) {

        this.id = id;
        this.rele = rele;
        this.fechaMovimiento = fechaMovimiento;
        this.estado = estado;
        this.posicion = posicion;
        this.usuario = usuario;
        this.notas = notas;
    }

    public Long getId() {
        return id;
    }

    public String getRele() {
        return rele;
    }

    public LocalDateTime getFechaMovimiento() {
        return fechaMovimiento;
    }

    public String getEstado() {
        return estado;
    }

    public String getPosicion() {
        return posicion;
    }

    public String getUsuario() {
        return usuario;
    }

    public String getNotas() {
        return notas;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setRele(String rele) {
        this.rele = rele;
    }

    public void setFechaMovimiento(
            LocalDateTime fechaMovimiento
    ) {
        this.fechaMovimiento = fechaMovimiento;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public void setPosicion(String posicion) {
        this.posicion = posicion;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }
}