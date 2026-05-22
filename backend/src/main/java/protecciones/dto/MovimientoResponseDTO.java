package protecciones.dto;

import java.time.LocalDateTime;

public class MovimientoResponseDTO {

    private Long id;

    private String rele;

    private String modelo;

    private String marca;

    private String estado;

    private String provincia;

    private String localidad;

    private String destino;

    private String posicion;

    private String responsable;

    private LocalDateTime fechaMovimiento;

    private String notas;

    public MovimientoResponseDTO(
            Long id,
            String rele,
            String modelo,
            String marca,
            String estado,
            String provincia,
            String localidad,
            String destino,
            String posicion,
            String responsable,
            LocalDateTime fechaMovimiento,
            String notas
    ) {

        this.id = id;
        this.rele = rele;
        this.modelo = modelo;
        this.marca = marca;
        this.estado = estado;
        this.provincia = provincia;
        this.localidad = localidad;
        this.destino = destino;
        this.posicion = posicion;
        this.responsable = responsable;
        this.fechaMovimiento = fechaMovimiento;
        this.notas = notas;
    }

    public Long getId() {
        return id;
    }

    public String getRele() {
        return rele;
    }

    public String getModelo() {
        return modelo;
    }

    public String getMarca() {
        return marca;
    }

    public String getEstado() {
        return estado;
    }

    public String getProvincia() {
        return provincia;
    }

    public String getLocalidad() {
        return localidad;
    }

    public String getDestino() {
        return destino;
    }

    public String getPosicion() {
        return posicion;
    }

    public String getResponsable() {
        return responsable;
    }

    public LocalDateTime getFechaMovimiento() {
        return fechaMovimiento;
    }

    public String getNotas() {
        return notas;
    }
}