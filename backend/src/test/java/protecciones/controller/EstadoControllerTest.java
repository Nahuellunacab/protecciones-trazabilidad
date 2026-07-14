package protecciones.controller;

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
import protecciones.dto.EstadoResponseDTO;
import protecciones.exception.BusinessException;
import protecciones.security.JwtService;
import protecciones.service.EstadoService;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EstadoController.class)
@Import({JwtService.class, SecurityConfig.class, CorsConfig.class})
class EstadoControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @MockitoBean
    private EstadoService estadoService;

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
    void obtenerEstadosPermitidos_sinAutenticacion_devuelve401() throws Exception {

        mockMvc.perform(get("/api/estados/transiciones/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(authorities = "AUDITOR")
    void obtenerEstadosPermitidos_comoAuditor_devuelveLosEstadosDisponibles() throws Exception {

        when(estadoService.obtenerEstadosPermitidos(1L))
                .thenReturn(List.of(
                        new EstadoResponseDTO(2L, "ENSAYO"),
                        new EstadoResponseDTO(3L, "APROBADO")
                ));

        mockMvc.perform(get("/api/estados/transiciones/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("ENSAYO"))
                .andExpect(jsonPath("$[1].nombre").value("APROBADO"));
    }

    @Test
    @WithMockUser(authorities = "OPERADOR")
    void obtenerEstadosPermitidos_releInexistente_devuelve400ConMensajeDeNegocio() throws Exception {

        when(estadoService.obtenerEstadosPermitidos(99L))
                .thenThrow(new BusinessException("Relé no encontrado"));

        mockMvc.perform(get("/api/estados/transiciones/99"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Relé no encontrado"));
    }

    @Test
    @WithMockUser(authorities = "AUDITOR")
    void obtenerTodos_comoAuditor_devuelveLaListaCompleta() throws Exception {

        when(estadoService.obtenerTodos())
                .thenReturn(List.of(
                        new EstadoResponseDTO(1L, "EN STOCK"),
                        new EstadoResponseDTO(2L, "BAJA")
                ));

        mockMvc.perform(get("/api/estados"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].nombre").value("EN STOCK"));
    }
}
