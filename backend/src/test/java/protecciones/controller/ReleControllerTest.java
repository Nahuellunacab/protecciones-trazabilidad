package protecciones.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import protecciones.config.CorsConfig;
import protecciones.config.SecurityConfig;
import protecciones.dto.BajaReleRequestDTO;
import protecciones.dto.ReleRequestDTO;
import protecciones.dto.ReleResponseDTO;
import protecciones.exception.BusinessException;
import protecciones.security.JwtService;
import protecciones.service.ReleService;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReleController.class)
@Import({JwtService.class, SecurityConfig.class, CorsConfig.class})
class ReleControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private ReleService releService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @BeforeEach
    void configurarMockMvcConSpringSecurity() {

        mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
    }

    private ReleRequestDTO dtoValido() {

        ReleRequestDTO dto = new ReleRequestDTO();
        dto.setNumeroSerie("SN-001");
        dto.setModeloId(1L);
        dto.setTipoIngreso("NUEVO");
        dto.setPosicionInicialId(1L);
        return dto;
    }

    private ReleResponseDTO respuesta() {

        return new ReleResponseDTO(
                1L, "SN-001", null, null, null, null, null,
                "Modelo X", "Marca X", "EN STOCK", "Estante 1", "Deposito Central",
                1L, null, null, "NUEVO", "SIN GARANTIA", null, true, null, null
        );
    }

    @Test
    void crear_sinAutenticacion_devuelve401() throws Exception {

        mockMvc.perform(
                        post("/api/reles")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dtoValido()))
                )
                .andExpect(status().isUnauthorized());

        verify(releService, never()).guardar(any());
    }

    @Test
    @WithMockUser(authorities = "AUDITOR")
    void crear_comoAuditor_devuelve403() throws Exception {

        mockMvc.perform(
                        post("/api/reles")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dtoValido()))
                )
                .andExpect(status().isForbidden());

        verify(releService, never()).guardar(any());
    }

    @Test
    @WithMockUser(authorities = "OPERADOR")
    void crear_comoOperador_devuelve201ConElReleCreado() throws Exception {

        when(releService.guardar(any()))
                .thenReturn(respuesta());

        mockMvc.perform(
                        post("/api/reles")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dtoValido()))
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.numeroSerie").value("SN-001"))
                .andExpect(jsonPath("$.estadoActual").value("EN STOCK"));
    }

    @Test
    @WithMockUser(authorities = "OPERADOR")
    void crear_sinNumeroSerie_devuelve400PorValidacion() throws Exception {

        ReleRequestDTO dto = dtoValido();
        dto.setNumeroSerie(" ");

        mockMvc.perform(
                        post("/api/reles")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dto))
                )
                .andExpect(status().isBadRequest());

        verify(releService, never()).guardar(any());
    }

    @Test
    @WithMockUser(authorities = "OPERADOR")
    void crear_numeroSerieDuplicado_devuelve400ConMensajeDeNegocio() throws Exception {

        when(releService.guardar(any()))
                .thenThrow(new BusinessException("Ya existe un relé con ese número de serie"));

        mockMvc.perform(
                        post("/api/reles")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dtoValido()))
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Ya existe un relé con ese número de serie"));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void actualizar_comoAdmin_devuelve200ConElReleActualizado() throws Exception {

        when(releService.actualizar(anyLong(), any()))
                .thenReturn(respuesta());

        mockMvc.perform(
                        put("/api/reles/1")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dtoValido()))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.numeroSerie").value("SN-001"));
    }

    @Test
    @WithMockUser(authorities = "AUDITOR")
    void obtenerPorId_comoAuditor_devuelve200() throws Exception {

        when(releService.obtenerPorId(1L))
                .thenReturn(respuesta());

        mockMvc.perform(get("/api/reles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.modelo").value("Modelo X"));
    }

    @Test
    @WithMockUser(authorities = "AUDITOR")
    void obtenerPorId_releInexistente_devuelve400ConMensajeDeNegocio() throws Exception {

        when(releService.obtenerPorId(99L))
                .thenThrow(new BusinessException("Relé no encontrado"));

        mockMvc.perform(get("/api/reles/99"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Relé no encontrado"));
    }

    @Test
    void obtenerPorId_sinAutenticacion_devuelve401() throws Exception {

        mockMvc.perform(get("/api/reles/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(authorities = "AUDITOR")
    void listar_devuelvePaginaConLosReles() throws Exception {

        when(releService.obtenerPaginados(
                0, 10, "id,asc", "", "ACTIVOS", null, null, null, null
        )).thenReturn(new PageImpl<>(
                List.of(respuesta()),
                PageRequest.of(0, 10),
                1
        ));

        mockMvc.perform(get("/api/reles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].numeroSerie").value("SN-001"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    @WithMockUser(authorities = "OPERADOR")
    void baja_comoOperador_devuelve204SinContenido() throws Exception {

        BajaReleRequestDTO dto = new BajaReleRequestDTO();
        dto.setMotivo("Rotura irreparable");

        mockMvc.perform(
                        patch("/api/reles/1/baja")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dto))
                )
                .andExpect(status().isNoContent());

        verify(releService).darDeBaja(1L, "Rotura irreparable");
    }

    @Test
    @WithMockUser(authorities = "OPERADOR")
    void baja_sinMotivo_devuelve400PorValidacion() throws Exception {

        BajaReleRequestDTO dto = new BajaReleRequestDTO();

        mockMvc.perform(
                        patch("/api/reles/1/baja")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dto))
                )
                .andExpect(status().isBadRequest());

        verify(releService, never()).darDeBaja(any(), any());
    }

    @Test
    @WithMockUser(authorities = "AUDITOR")
    void baja_comoAuditor_devuelve403() throws Exception {

        BajaReleRequestDTO dto = new BajaReleRequestDTO();
        dto.setMotivo("Rotura irreparable");

        mockMvc.perform(
                        patch("/api/reles/1/baja")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(dto))
                )
                .andExpect(status().isForbidden());

        verify(releService, never()).darDeBaja(any(), any());
    }
}
