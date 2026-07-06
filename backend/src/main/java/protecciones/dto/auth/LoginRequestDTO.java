package protecciones.dto.auth;

import jakarta.validation.constraints.NotBlank;

public class LoginRequestDTO {

    @NotBlank(message = "El email o numero de sobre es obligatorio")
    private String identificador;

    @NotBlank(message = "La contrasena es obligatoria")
    private String password;

    public LoginRequestDTO() {
    }

    public String getIdentificador() {
        return identificador;
    }

    public String getPassword() {
        return password;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
