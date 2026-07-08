package protecciones.dto;

import java.util.List;

public class RemitoAnalisisResponseDTO {

    private String numeroRemito;

    private String fecha;

    private String proveedor;

    private Long proveedorId;

    private boolean proveedorEncontrado;

    private String ordenProvision;

    private List<ReleDetectadoDTO> reles;

    private List<String> accesoriosIgnorados;

    private int cantidadValidos;

    private int cantidadModelosNuevos;

    private int cantidadConError;

    private int cantidadAccesoriosIgnorados;

    private boolean todosValidos;

    public String getNumeroRemito() {
        return numeroRemito;
    }

    public void setNumeroRemito(
            String numeroRemito
    ) {
        this.numeroRemito = numeroRemito;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(
            String fecha
    ) {
        this.fecha = fecha;
    }

    public String getProveedor() {
        return proveedor;
    }

    public void setProveedor(
            String proveedor
    ) {
        this.proveedor = proveedor;
    }

    public Long getProveedorId() {
        return proveedorId;
    }

    public void setProveedorId(
            Long proveedorId
    ) {
        this.proveedorId = proveedorId;
    }

    public boolean isProveedorEncontrado() {
        return proveedorEncontrado;
    }

    public void setProveedorEncontrado(
            boolean proveedorEncontrado
    ) {
        this.proveedorEncontrado = proveedorEncontrado;
    }

    public String getOrdenProvision() {
        return ordenProvision;
    }

    public void setOrdenProvision(
            String ordenProvision
    ) {
        this.ordenProvision = ordenProvision;
    }

    public List<ReleDetectadoDTO> getReles() {
        return reles;
    }

    public void setReles(
            List<ReleDetectadoDTO> reles
    ) {
        this.reles = reles;
    }

    public List<String> getAccesoriosIgnorados() {
        return accesoriosIgnorados;
    }

    public void setAccesoriosIgnorados(
            List<String> accesoriosIgnorados
    ) {
        this.accesoriosIgnorados = accesoriosIgnorados;
    }

    public int getCantidadValidos() {
        return cantidadValidos;
    }

    public void setCantidadValidos(
            int cantidadValidos
    ) {
        this.cantidadValidos = cantidadValidos;
    }

    public int getCantidadModelosNuevos() {
        return cantidadModelosNuevos;
    }

    public void setCantidadModelosNuevos(
            int cantidadModelosNuevos
    ) {
        this.cantidadModelosNuevos = cantidadModelosNuevos;
    }

    public int getCantidadConError() {
        return cantidadConError;
    }

    public void setCantidadConError(
            int cantidadConError
    ) {
        this.cantidadConError = cantidadConError;
    }

    public int getCantidadAccesoriosIgnorados() {
        return cantidadAccesoriosIgnorados;
    }

    public void setCantidadAccesoriosIgnorados(
            int cantidadAccesoriosIgnorados
    ) {
        this.cantidadAccesoriosIgnorados = cantidadAccesoriosIgnorados;
    }

    public boolean isTodosValidos() {
        return todosValidos;
    }

    public void setTodosValidos(
            boolean todosValidos
    ) {
        this.todosValidos = todosValidos;
    }
}
