package protecciones.dto;

public class UsuarioResponseDTO {

    private Long id;

    private String nombre;

    private String apellido;

    private String email;

    private String rol;

    private Boolean activo;

    private String numeroSobre;

    public UsuarioResponseDTO(
            Long id,
            String nombre,
            String apellido,
            String email,
            String rol,
            Boolean activo,
            String numeroSobre
    ) {

        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.rol = rol;
        this.activo = activo;
        this.numeroSobre = numeroSobre;
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

    public Boolean getActivo() {
        return activo;
    }

    public String getNumeroSobre() {
        return numeroSobre;
    }
}
