package protecciones.dto.auth;

import jakarta.validation.constraints.NotBlank;

public class CambiarPasswordRequestDTO {

    @NotBlank(message = "La contrasena actual es obligatoria")
    private String passwordActual;

    @NotBlank(message = "La nueva contrasena es obligatoria")
    private String passwordNueva;

    public CambiarPasswordRequestDTO() {
    }

    public String getPasswordActual() {
        return passwordActual;
    }

    public String getPasswordNueva() {
        return passwordNueva;
    }

    public void setPasswordActual(String passwordActual) {
        this.passwordActual = passwordActual;
    }

    public void setPasswordNueva(String passwordNueva) {
        this.passwordNueva = passwordNueva;
    }
}
