package protecciones.dto.dashboard;

public class EstadoSistemaDTO {

    private boolean baseDatosOnline;

    private boolean iaDisponible;

    public EstadoSistemaDTO(
            boolean baseDatosOnline,
            boolean iaDisponible
    ) {

        this.baseDatosOnline =
                baseDatosOnline;

        this.iaDisponible =
                iaDisponible;
    }

    public boolean isBaseDatosOnline() {
        return baseDatosOnline;
    }

    public boolean isIaDisponible() {
        return iaDisponible;
    }
}
