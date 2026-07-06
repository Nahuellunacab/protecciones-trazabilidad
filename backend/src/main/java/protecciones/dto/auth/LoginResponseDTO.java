package protecciones.dto.auth;

public class LoginResponseDTO {

    private String token;

    private Long id;

    private String nombre;

    private String apellido;

    private String email;

    private String rol;

    private String numeroSobre;

    public LoginResponseDTO(
            String token,
            Long id,
            String nombre,
            String apellido,
            String email,
            String rol,
            String numeroSobre
    ) {

        this.token = token;
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.rol = rol;
        this.numeroSobre = numeroSobre;
    }

    public String getToken() {
        return token;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getEmail() {
        return email;
    }

    public String getRol() {
        return rol;
    }

    public String getNumeroSobre() {
        return numeroSobre;
    }
}
