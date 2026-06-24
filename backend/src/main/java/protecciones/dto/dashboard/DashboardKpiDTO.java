package protecciones.dto.dashboard;

public class DashboardKpiDTO {

    private long relesActivos;

    private long relesEnStock;

    private long relesBaja;

    private long relesInstalados;

    private long relesReparacion;

    private long relesEnsayo;

    private long garantiasVencidas;

    private long relesSinDocumentacion;

    private long remitosPendientes;

    private long ordenesPendientes;

    private long totalReles;

    private long relesSinHistorial;

    public DashboardKpiDTO(
            long totalReles,
            long relesActivos,
            long relesEnStock,
            long relesBaja,
            long relesInstalados,
            long relesReparacion,
            long relesEnsayo,
            long garantiasVencidas,
            long relesSinDocumentacion,
            long remitosPendientes,
            long ordenesPendientes,
            long relesSinHistorial
    ) {

        this.totalReles =
                totalReles;

        this.relesActivos =
                relesActivos;

        this.relesEnStock =
                relesEnStock;

        this.relesBaja =
                relesBaja;

        this.relesInstalados =
                relesInstalados;

        this.relesReparacion =
                relesReparacion;

        this.relesEnsayo =
                relesEnsayo;

        this.garantiasVencidas =
                garantiasVencidas;

        this.relesSinDocumentacion =
                relesSinDocumentacion;

        this.remitosPendientes =
                remitosPendientes;

        this.ordenesPendientes =
                ordenesPendientes;

        this.relesSinHistorial =
                relesSinHistorial;
    }

    public long getRelesActivos() {
        return relesActivos;
    }

    public long getRelesEnStock() {
        return relesEnStock;
    }

    public long getRelesBaja() {
        return relesBaja;
    }

    public long getRelesInstalados() {
        return relesInstalados;
    }

    public long getRelesReparacion() {
        return relesReparacion;
    }

    public long getRelesEnsayo() {
        return relesEnsayo;
    }

    public long getGarantiasVencidas() {
        return garantiasVencidas;
    }

    public long getRelesSinDocumentacion() {
        return relesSinDocumentacion;
    }

    public long getRemitosPendientes() {
        return remitosPendientes;
    }

    public long getOrdenesPendientes() {
        return ordenesPendientes;
    }

    public long getTotalReles() {
    return totalReles;
}

    public long getRelesSinHistorial() {
        return relesSinHistorial;
    }
}