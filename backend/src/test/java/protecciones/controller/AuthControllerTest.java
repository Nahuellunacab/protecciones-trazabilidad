package protecciones.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import protecciones.config.CorsConfig;
import protecciones.config.SecurityConfig;
import protecciones.dto.UsuarioResponseDTO;
import protecciones.dto.auth.CambiarPasswordRequestDTO;
import protecciones.dto.auth.LoginRequestDTO;
import protecciones.dto.auth.LoginResponseDTO;
import protecciones.exception.BusinessException;
import protecciones.security.JwtService;
import protecciones.service.AuthService;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import({JwtService.class, SecurityConfig.class, CorsConfig.class})
class AuthControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @BeforeEach
    void configurarMockMvcConSpringSecurity() {

        mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
    }

    @Test
    void login_credencialesValidas_devuelveTokenYDatosDeUsuario() throws Exception {

        LoginRequestDTO request = new LoginRequestDTO();
        request.setIdentificador("ana@epec.com");
        request.setPassword("secreta123");

        LoginResponseDTO response = new LoginResponseDTO(
                "jwt-token",
                1L,
                "Ana",
                "Perez",
                "ana@epec.com",
                "OPERADOR",
                "1234"
        );

        when(authService.login(any(), any()))
                .thenReturn(response);

        mockMvc.perform(
                        post("/api/auth/login")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.email").value("ana@epec.com"))
                .andExpect(jsonPath("$.rol").value("OPERADOR"));
    }

    @Test
    void login_credencialesInvalidas_devuelve400ConMensajeDeNegocio() throws Exception {

        LoginRequestDTO request = new LoginRequestDTO();
        request.setIdentificador("ana@epec.com");
        request.setPassword("incorrecta");

        when(authService.login(any(), any()))
                .thenThrow(new BusinessException("Email o contrasena incorrectos"));

        mockMvc.perform(
                        post("/api/auth/login")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email o contrasena incorrectos"));
    }

    @Test
    void login_sinIdentificadorNiPassword_devuelve400PorValidacion() throws Exception {

        LoginRequestDTO request = new LoginRequestDTO();

        mockMvc.perform(
                        post("/api/auth/login")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isBadRequest());
    }

    @Test
    void me_sinAutenticacion_devuelve401() throws Exception {

        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "ana@epec.com", authorities = "OPERADOR")
    void me_autenticado_devuelveElUsuarioActual() throws Exception {

        when(authService.obtenerUsuarioAutenticado("ana@epec.com"))
                .thenReturn(new UsuarioResponseDTO(
                        1L, "Ana", "Perez", "ana@epec.com", "OPERADOR", true, "1234"
                ));

        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("ana@epec.com"))
                .andExpect(jsonPath("$.rol").value("OPERADOR"));
    }

    @Test
    void cambiarPassword_sinAutenticacion_devuelve401() throws Exception {

        CambiarPasswordRequestDTO dto = new CambiarPasswordRequestDTO();
        dto.setPasswordActual("actual");
        dto.setPasswordNueva("nueva123");

        mockMvc.perform(
                        put("/api/auth/password")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dto))
                )
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "ana@epec.com", authorities = "AUDITOR")
    void cambiarPassword_autenticadoComoAuditor_sePermiteAutogestionDePassword() throws Exception {

        CambiarPasswordRequestDTO dto = new CambiarPasswordRequestDTO();
        dto.setPasswordActual("actual");
        dto.setPasswordNueva("nueva123");

        mockMvc.perform(
                        put("/api/auth/password")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dto))
                )
                .andExpect(status().isOk());

        verify(authService).cambiarPassword(eq("ana@epec.com"), any());
    }

    @Test
    @WithMockUser(username = "ana@epec.com", authorities = "OPERADOR")
    void cambiarPassword_sinPasswordNueva_devuelve400PorValidacion() throws Exception {

        CambiarPasswordRequestDTO dto = new CambiarPasswordRequestDTO();
        dto.setPasswordActual("actual");

        mockMvc.perform(
                        put("/api/auth/password")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dto))
                )
                .andExpect(status().isBadRequest());
    }
}
