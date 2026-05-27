package protecciones.dto.dashboard;

public class DashboardKpiDTO {

    private long relesActivos;

    private long relesBaja;

    private long relesInstalados;

    private long relesReparacion;

    private long relesEnsayo;

    private long garantiasVencidas;

    public DashboardKpiDTO(
            long relesActivos,
            long relesBaja,
            long relesInstalados,
            long relesReparacion,
            long relesEnsayo,
            long garantiasVencidas
    ) {

        this.relesActivos = relesActivos;
        this.relesBaja = relesBaja;
        this.relesInstalados = relesInstalados;
        this.relesReparacion = relesReparacion;
        this.relesEnsayo = relesEnsayo;
        this.garantiasVencidas = garantiasVencidas;
    }

    public long getRelesActivos() {
        return relesActivos;
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