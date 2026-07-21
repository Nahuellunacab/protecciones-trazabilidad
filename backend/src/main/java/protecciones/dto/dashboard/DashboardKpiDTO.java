package protecciones.dto.dashboard;

public class DashboardKpiDTO {

    private long totalReles;

    private long relesActivos;

    private long relesBaja;

    private long garantiasVencidas;

    private long garantiasProximasAVencer;

    private long relesSinDocumentacion;

    private long relesDocumentacionSinArchivo;

    private long remitosPendientes;

    private long ordenesPendientes;

    private long relesSinHistorial;

    public DashboardKpiDTO(
            long totalReles,
            long relesActivos,
            long relesBaja,
            long garantiasVencidas,
            long garantiasProximasAVencer,
            long relesSinDocumentacion,
            long relesDocumentacionSinArchivo,
            long remitosPendientes,
            long ordenesPendientes,
            long relesSinHistorial
    ) {

        this.totalReles =
                totalReles;

        this.relesActivos =
                relesActivos;

        this.relesBaja =
                relesBaja;

        this.garantiasVencidas =
                garantiasVencidas;

        this.garantiasProximasAVencer =
                garantiasProximasAVencer;

        this.relesSinDocumentacion =
                relesSinDocumentacion;

        this.relesDocumentacionSinArchivo =
                relesDocumentacionSinArchivo;

        this.remitosPendientes =
                remitosPendientes;

        this.ordenesPendientes =
                ordenesPendientes;

        this.relesSinHistorial =
                relesSinHistorial;
    }

    public long getTotalReles() {
        return totalReles;
    }

    public long getRelesActivos() {
        return relesActivos;
    }

    public long getRelesBaja() {
        return relesBaja;
    }

    public long getGarantiasVencidas() {
        return garantiasVencidas;
    }

    public long getGarantiasProximasAVencer() {
        return garantiasProximasAVencer;
    }

    public long getRelesSinDocumentacion() {
        return relesSinDocumentacion;
    }

    public long getRelesDocumentacionSinArchivo() {
        return relesDocumentacionSinArchivo;
    }

    public long getRemitosPendientes() {
        return remitosPendientes;
    }

    public long getOrdenesPendientes() {
        return ordenesPendientes;
    }

    public long getRelesSinHistorial() {
        return relesSinHistorial;
    }
}
