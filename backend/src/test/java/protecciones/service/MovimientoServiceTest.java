package protecciones.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import protecciones.dto.MovimientoRequestDTO;
import protecciones.dto.MovimientoResponseDTO;
import protecciones.entity.Destino;
import protecciones.entity.Estado;
import protecciones.entity.Marca;
import protecciones.entity.Modelo;
import protecciones.entity.Movimiento;
import protecciones.entity.Posicion;
import protecciones.entity.Rele;
import protecciones.entity.Usuario;
import protecciones.exception.BusinessException;
import protecciones.repository.EstadoRepository;
import protecciones.repository.MovimientoRepository;
import protecciones.repository.PosicionRepository;
import protecciones.repository.ReleRepository;
import protecciones.repository.TransicionEstadoRepository;
import protecciones.security.CurrentUserProvider;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MovimientoServiceTest {

    @Mock
    private MovimientoRepository movimientoRepository;

    @Mock
    private ReleRepository releRepository;

    @Mock
    private EstadoRepository estadoRepository;

    @Mock
    private PosicionRepository posicionRepository;

    @Mock
    private TransicionEstadoRepository transicionEstadoRepository;

    @Spy
    private ReleBajaService releBajaService = new ReleBajaService();

    @Mock
    private CurrentUserProvider currentUserProvider;

    @InjectMocks
    private MovimientoService movimientoService;

    private Rele rele;

    private Posicion posicion;

    private Usuario usuario;

    @BeforeEach
    void setUp() {

        Marca marca = new Marca(1L, "Marca X");

        Modelo modelo = new Modelo(1L, "Modelo X", marca);

        rele = new Rele();
        rele.setId(1L);
        rele.setNumeroSerie("SN-1");
        rele.setModelo(modelo);
        rele.setActivo(true);

        Destino destino = new Destino();
        destino.setNombre("Deposito Central");

        posicion = new Posicion(1L, "Tablero 1", destino);

        usuario = new Usuario(1L, "Ana", "Perez", "ana@epec.com");

        lenient().when(releRepository.findById(1L))
                .thenReturn(Optional.of(rele));

        lenient().when(posicionRepository.findById(1L))
                .thenReturn(Optional.of(posicion));
    }

    private MovimientoRequestDTO dto(Long estadoId) {

        MovimientoRequestDTO dto = new MovimientoRequestDTO();
        dto.setReleId(1L);
        dto.setEstadoId(estadoId);
        dto.setPosicionId(1L);
        dto.setNotas("nota");
        return dto;
    }

    @Test
    void guardar_releInactivo_lanzaBusinessException() {

        rele.setActivo(false);

        assertThatThrownBy(() -> movimientoService.guardar(dto(2L)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("dado de baja");

        verify(movimientoRepository, never()).save(any());
    }

    @Test
    void guardar_releSinMovimientosPrevios_noValidaTransicionYGuarda() {

        Estado ensayo = new Estado(2L, "EN_ENSAYO", null);

        when(estadoRepository.findById(2L))
                .thenReturn(Optional.of(ensayo));

        when(movimientoRepository
                .findTopByReleIdOrderByFechaMovimientoDescIdDesc(1L))
                .thenReturn(Optional.empty());

        when(currentUserProvider.obtenerUsuarioActual())
                .thenReturn(usuario);

        when(movimientoRepository.save(any(Movimiento.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        MovimientoResponseDTO resultado =
                movimientoService.guardar(dto(2L));

        assertThat(resultado.getEstado()).isEqualTo("EN_ENSAYO");

        verify(transicionEstadoRepository, never())
                .existsByEstadoOrigenIdAndEstadoDestinoId(any(), any());
    }

    @Test
    void guardar_transicionNoPermitida_lanzaBusinessException() {

        Estado enStock = new Estado(1L, "EN_STOCK", null);
        Estado enServicio = new Estado(5L, "INSTALADO", null);

        Movimiento ultimoMovimiento = new Movimiento();
        ultimoMovimiento.setEstado(enStock);

        when(estadoRepository.findById(5L))
                .thenReturn(Optional.of(enServicio));

        when(movimientoRepository
                .findTopByReleIdOrderByFechaMovimientoDescIdDesc(1L))
                .thenReturn(Optional.of(ultimoMovimiento));

        when(transicionEstadoRepository
                .existsByEstadoOrigenIdAndEstadoDestinoId(1L, 5L))
                .thenReturn(false);

        assertThatThrownBy(() -> movimientoService.guardar(dto(5L)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Transición de estado no permitida");

        verify(movimientoRepository, never()).save(any());
    }

    @Test
    void guardar_transicionPermitida_guardaElMovimiento() {

        Estado enStock = new Estado(1L, "EN_STOCK", null);
        Estado ensayo = new Estado(2L, "EN_ENSAYO", null);

        Movimiento ultimoMovimiento = new Movimiento();
        ultimoMovimiento.setEstado(enStock);

        when(estadoRepository.findById(2L))
                .thenReturn(Optional.of(ensayo));

        when(movimientoRepository
                .findTopByReleIdOrderByFechaMovimientoDescIdDesc(1L))
                .thenReturn(Optional.of(ultimoMovimiento));

        when(transicionEstadoRepository
                .existsByEstadoOrigenIdAndEstadoDestinoId(1L, 2L))
                .thenReturn(true);

        when(currentUserProvider.obtenerUsuarioActual())
                .thenReturn(usuario);

        when(movimientoRepository.save(any(Movimiento.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        MovimientoResponseDTO resultado =
                movimientoService.guardar(dto(2L));

        assertThat(resultado.getEstado()).isEqualTo("EN_ENSAYO");
        assertThat(resultado.getPosicion()).isEqualTo("Tablero 1");

        verify(releBajaService, never()).aplicarBaja(any(), any());
        verify(releRepository, never()).save(any());
    }

    @Test
    void guardar_destinoBaja_aplicaBajaAlRele() {

        Estado enStock = new Estado(1L, "EN_STOCK", null);
        Estado baja = new Estado(9L, "BAJA", null);

        Movimiento ultimoMovimiento = new Movimiento();
        ultimoMovimiento.setEstado(enStock);

        when(estadoRepository.findById(9L))
                .thenReturn(Optional.of(baja));

        when(movimientoRepository
                .findTopByReleIdOrderByFechaMovimientoDescIdDesc(1L))
                .thenReturn(Optional.of(ultimoMovimiento));

        when(transicionEstadoRepository
                .existsByEstadoOrigenIdAndEstadoDestinoId(1L, 9L))
                .thenReturn(true);

        when(currentUserProvider.obtenerUsuarioActual())
                .thenReturn(usuario);

        when(movimientoRepository.save(any(Movimiento.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        MovimientoRequestDTO dto = dto(9L);
        dto.setNotas("Rotura irreparable");

        movimientoService.guardar(dto);

        verify(releBajaService, times(1))
                .aplicarBaja(rele, "Rotura irreparable");

        assertThat(rele.getActivo()).isFalse();

        verify(releRepository, times(1)).save(rele);
    }

    @Test
    void guardar_releInexistente_lanzaBusinessException() {

        when(releRepository.findById(99L))
                .thenReturn(Optional.empty());

        MovimientoRequestDTO dto = new MovimientoRequestDTO();
        dto.setReleId(99L);
        dto.setEstadoId(1L);
        dto.setPosicionId(1L);

        assertThatThrownBy(() -> movimientoService.guardar(dto))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Relé no encontrado");
    }

    @Test
    void guardar_estadoInexistente_lanzaBusinessException() {

        when(estadoRepository.findById(2L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> movimientoService.guardar(dto(2L)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Estado no encontrado");
    }

    @Test
    void guardar_posicionInexistente_lanzaBusinessException() {

        Estado ensayo = new Estado(2L, "EN_ENSAYO", null);

        when(estadoRepository.findById(2L))
                .thenReturn(Optional.of(ensayo));

        when(posicionRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> movimientoService.guardar(dto(2L)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Posición no encontrada");
    }
}
