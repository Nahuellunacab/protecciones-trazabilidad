package protecciones.controller;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import protecciones.dto.UsuarioResponseDTO;
import protecciones.dto.auth.CambiarPasswordRequestDTO;
import protecciones.dto.auth.LoginRequestDTO;
import protecciones.dto.auth.LoginResponseDTO;

import protecciones.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService
    ) {

        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponseDTO login(
            @Valid
            @RequestBody
            LoginRequestDTO dto
    ) {

        return authService.login(dto);
    }

    @GetMapping("/me")
    public UsuarioResponseDTO me(
            Authentication authentication
    ) {

        return authService.obtenerUsuarioAutenticado(
                authentication.getName()
        );
    }

    @PutMapping("/password")
    public void cambiarPassword(
            Authentication authentication,

            @Valid
            @RequestBody
            CambiarPasswordRequestDTO dto
    ) {

        authService.cambiarPassword(
                authentication.getName(),
                dto
        );
    }
}
