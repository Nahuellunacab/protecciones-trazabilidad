package protecciones.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import protecciones.dto.UsuarioResponseDTO;
import protecciones.dto.auth.CambiarPasswordRequestDTO;
import protecciones.dto.auth.LoginRequestDTO;
import protecciones.dto.auth.LoginResponseDTO;
import protecciones.entity.Usuario;
import protecciones.exception.BusinessException;
import protecciones.repository.UsuarioRepository;
import protecciones.security.JwtService;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final UsuarioRepository usuarioRepository;

    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {

        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDTO login(
            LoginRequestDTO dto
    ) {

        UserDetails userDetails;

        try {

            userDetails =
                    (UserDetails) authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    dto.getIdentificador().trim(),
                                    dto.getPassword()
                            )
                    ).getPrincipal();

        } catch (Exception ex) {

            throw new BusinessException(
                    "Email o contrasena incorrectos"
            );
        }

        Usuario usuario =
                usuarioRepository
                        .findByEmail(userDetails.getUsername())
                        .orElseThrow();

        String token =
                jwtService.generarToken(userDetails);

        return new LoginResponseDTO(
                token,
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getNumeroSobre()
        );
    }

    public UsuarioResponseDTO obtenerUsuarioAutenticado(
            String email
    ) {

        Usuario usuario =
                usuarioRepository
                        .findByEmail(email)
                        .orElseThrow();

        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getActivo(),
                usuario.getNumeroSobre()
        );
    }

    public void cambiarPassword(
            String email,
            CambiarPasswordRequestDTO dto
    ) {

        Usuario usuario =
                usuarioRepository
                        .findByEmail(email)
                        .orElseThrow();

        if (!passwordEncoder.matches(
                dto.getPasswordActual(),
                usuario.getPasswordHash()
        )) {

            throw new BusinessException(
                    "La contrasena actual no es correcta"
            );
        }

        usuario.setPasswordHash(
                passwordEncoder.encode(
                        dto.getPasswordNueva()
                )
        );

        usuarioRepository.save(usuario);
    }
}
