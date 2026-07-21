package protecciones.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import protecciones.dto.EstadoResponseDTO;
import protecciones.entity.Estado;
import protecciones.entity.Movimiento;
import protecciones.entity.Rele;
import protecciones.entity.TransicionEstado;
import protecciones.exception.BusinessException;
import protecciones.repository.EstadoRepository;
import protecciones.repository.MovimientoRepository;
import protecciones.repository.ReleRepository;
import protecciones.repository.TransicionEstadoRepository;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EstadoServiceTest {

    @Mock
    private EstadoRepository estadoRepository;

    @Mock
    private ReleRepository releRepository;

    @Mock
    private MovimientoRepository movimientoRepository;

    @Mock
    private TransicionEstadoRepository transicionEstadoRepository;

    @InjectMocks
    private EstadoService estadoService;

    private Rele rele;

    @BeforeEach
    void setUp() {

        rele = new Rele();
        rele.setId(1L);
    }

    @Test
    void obtenerEstadosPermitidos_releInexistente_lanzaBusinessException() {

        when(releRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> estadoService.obtenerEstadosPermitidos(1L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Relé no encontrado");

        verify(transicionEstadoRepository, never())
                .findByEstadoOrigenId(anyLong());
    }

    @Test
    void obtenerEstadosPermitidos_releSinMovimientos_devuelveTodosLosEstados() {

        Estado enStock = new Estado(1L, "EN_STOCK", null);
        Estado baja = new Estado(2L, "BAJA", null);

        when(releRepository.findById(1L))
                .thenReturn(Optional.of(rele));

        when(movimientoRepository.findTopByReleIdOrderByFechaMovimientoDescIdDesc(1L))
                .thenReturn(Optional.empty());

        when(estadoRepository.findAll())
                .thenReturn(List.of(enStock, baja));

        List<EstadoResponseDTO> resultado =
                estadoService.obtenerEstadosPermitidos(1L);

        assertThat(resultado)
                .extracting(EstadoResponseDTO::getNombre)
                .containsExactlyInAnyOrder("EN_STOCK", "BAJA");

        verify(transicionEstadoRepository, never())
                .findByEstadoOrigenId(anyLong());
    }

    @Test
    void obtenerEstadosPermitidos_releConMovimiento_devuelveSoloLasTransicionesValidas() {

        Estado enStock = new Estado(1L, "EN_STOCK", null);
        Estado ensayo = new Estado(2L, "EN_ENSAYO", null);
        Estado aprobado = new Estado(3L, "APROBADO", null);

        Movimiento ultimoMovimiento = new Movimiento();
        ultimoMovimiento.setEstado(enStock);

        when(releRepository.findById(1L))
                .thenReturn(Optional.of(rele));

        when(movimientoRepository.findTopByReleIdOrderByFechaMovimientoDescIdDesc(1L))
                .thenReturn(Optional.of(ultimoMovimiento));

        TransicionEstado aEnsayo = new TransicionEstado();
        aEnsayo.setEstadoOrigen(enStock);
        aEnsayo.setEstadoDestino(ensayo);

        TransicionEstado aAprobado = new TransicionEstado();
        aAprobado.setEstadoOrigen(enStock);
        aAprobado.setEstadoDestino(aprobado);

        when(transicionEstadoRepository.findByEstadoOrigenId(1L))
                .thenReturn(List.of(aEnsayo, aAprobado));

        List<EstadoResponseDTO> resultado =
                estadoService.obtenerEstadosPermitidos(1L);

        assertThat(resultado)
                .extracting(EstadoResponseDTO::getNombre)
                .containsExactlyInAnyOrder("EN_ENSAYO", "APROBADO");

        verify(estadoRepository, never()).findAll();
    }
}
