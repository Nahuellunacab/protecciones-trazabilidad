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
import protecciones.dto.MovimientoRequestDTO;
import protecciones.dto.MovimientoResponseDTO;
import protecciones.exception.BusinessException;
import protecciones.security.JwtService;
import protecciones.service.MovimientoService;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MovimientoController.class)
@Import({JwtService.class, SecurityConfig.class, CorsConfig.class})
class MovimientoControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private MovimientoService movimientoService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @BeforeEach
    void configurarMockMvcConSpringSecurity() {

        mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
    }

    private MovimientoRequestDTO dtoValido() {

        MovimientoRequestDTO dto = new MovimientoRequestDTO();
        dto.setReleId(1L);
        dto.setEstadoId(2L);
        dto.setPosicionId(3L);
        dto.setNotas("Pasa a ensayo");
        return dto;
    }

    private MovimientoResponseDTO respuesta() {

        return new MovimientoResponseDTO(
                10L, 1L, "SN-001", "Modelo X", "Marca X", "EN_ENSAYO",
                null, null, "Deposito Central", "Banco 1", "Ana Perez",
                LocalDateTime.of(2026, 7, 14, 10, 0), "Pasa a ensayo"
        );
    }

    @Test
    void guardar_sinAutenticacion_devuelve401() throws Exception {

        mockMvc.perform(
                        post("/api/movimientos")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dtoValido()))
                )
                .andExpect(status().isUnauthorized());

        verify(movimientoService, never()).guardar(any());
    }

    @Test
    @WithMockUser(authorities = "AUDITOR")
    void guardar_comoAuditor_devuelve403() throws Exception {

        mockMvc.perform(
                        post("/api/movimientos")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dtoValido()))
                )
                .andExpect(status().isForbidden());

        verify(movimientoService, never()).guardar(any());
    }

    @Test
    @WithMockUser(authorities = "OPERADOR")
    void guardar_comoOperador_devuelve200ConElMovimientoCreado() throws Exception {

        when(movimientoService.guardar(any()))
                .thenReturn(respuesta());

        mockMvc.perform(
                        post("/api/movimientos")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dtoValido()))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("EN_ENSAYO"))
                .andExpect(jsonPath("$.rele").value("SN-001"));
    }

    @Test
    @WithMockUser(authorities = "OPERADOR")
    void guardar_sinEstadoId_devuelve400PorValidacion() throws Exception {

        MovimientoRequestDTO dto = dtoValido();
        dto.setEstadoId(null);

        mockMvc.perform(
                        post("/api/movimientos")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dto))
                )
                .andExpect(status().isBadRequest());

        verify(movimientoService, never()).guardar(any());
    }

    @Test
    @WithMockUser(authorities = "OPERADOR")
    void guardar_transicionNoPermitida_devuelve400ConMensajeDeNegocio() throws Exception {

        when(movimientoService.guardar(any()))
                .thenThrow(new BusinessException("Transición de estado no permitida: EN_STOCK -> INSTALADO"));

        mockMvc.perform(
                        post("/api/movimientos")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dtoValido()))
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Transición de estado no permitida: EN_STOCK -> INSTALADO"));
    }

    @Test
    @WithMockUser(authorities = "AUDITOR")
    void historial_comoAuditor_devuelveElHistorialDelRele() throws Exception {

        when(movimientoService.obtenerTodos())
                .thenReturn(List.of(respuesta()));

        mockMvc.perform(get("/api/movimientos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].rele").value("SN-001"))
                .andExpect(jsonPath("$[0].estado").value("EN_ENSAYO"));
    }

    @Test
    void historial_sinAutenticacion_devuelve401() throws Exception {

        mockMvc.perform(get("/api/movimientos"))
                .andExpect(status().isUnauthorized());
    }
}
