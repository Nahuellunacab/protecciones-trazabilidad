package protecciones.dto.dashboard;

public class DashboardKpiDTO {

    private long relesActivos;

    private long relesEnStock;

    private long relesBaja;

    private long relesInstalados;

    private long relesReparacion;

    private long relesEnsayo;

    private long garantiasVencidas;

    public DashboardKpiDTO(
            long relesActivos,
            long relesEnStock,
            long relesBaja,
            long relesInstalados,
            long relesReparacion,
            long relesEnsayo,
            long garantiasVencidas
    ) {

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
}