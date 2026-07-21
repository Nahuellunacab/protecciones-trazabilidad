package protecciones.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import protecciones.dto.ReleRequestDTO;
import protecciones.dto.ReleResponseDTO;
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
import protecciones.repository.ModeloRepository;
import protecciones.repository.MovimientoRepository;
import protecciones.repository.OrdenProvisionRepository;
import protecciones.repository.PosicionRepository;
import protecciones.repository.ReleRepository;
import protecciones.repository.RemitoRepository;
import protecciones.repository.TransicionEstadoRepository;
import protecciones.security.CurrentUserProvider;

import java.time.LocalDate;
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
class ReleServiceTest {

    @Mock
    private ReleRepository releRepository;

    @Mock
    private ModeloRepository modeloRepository;

    @Mock
    private RemitoRepository remitoRepository;

    @Mock
    private MovimientoRepository movimientoRepository;

    @Mock
    private EstadoRepository estadoRepository;

    @Mock
    private PosicionRepository posicionRepository;

    @Mock
    private OrdenProvisionRepository ordenProvisionRepository;

    @Spy
    private ReleBajaService releBajaService = new ReleBajaService();

    @Mock
    private TransicionEstadoRepository transicionEstadoRepository;

    @Mock
    private CurrentUserProvider currentUserProvider;

    @InjectMocks
    private ReleService releService;

    private Modelo modelo;

    private Posicion posicion;

    private Estado enStock;

    private Usuario usuario;

    @BeforeEach
    void setUp() {

        Marca marca = new Marca(1L, "Marca X");
        modelo = new Modelo(1L, "Modelo X", marca);

        Destino destino = new Destino();
        destino.setNombre("Deposito Central");
        posicion = new Posicion(10L, "Estante 1", destino);

        enStock = new Estado(1L, "EN_STOCK", null);

        usuario = new Usuario(1L, "Ana", "Perez", "ana@epec.com");

        lenient().when(modeloRepository.findById(1L))
                .thenReturn(Optional.of(modelo));

        lenient().when(releRepository.save(any(Rele.class)))
                .thenAnswer(invocation -> {
                    Rele rele = invocation.getArgument(0);
                    if (rele.getId() == null) {
                        rele.setId(100L);
                    }
                    return rele;
                });

        lenient().when(estadoRepository.findByNombreIgnoreCase("EN_STOCK"))
                .thenReturn(Optional.of(enStock));

        lenient().when(posicionRepository.findById(10L))
                .thenReturn(Optional.of(posicion));

        lenient().when(currentUserProvider.obtenerUsuarioActual())
                .thenReturn(usuario);

        lenient().when(movimientoRepository.save(any(Movimiento.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    private ReleRequestDTO dtoValido() {

        ReleRequestDTO dto = new ReleRequestDTO();
        dto.setNumeroSerie("  sn-001  ");
        dto.setCodigoConfiguracion("  cfg-1  ");
        dto.setModeloId(1L);
        dto.setTipoIngreso("NUEVO");
        dto.setPosicionInicialId(10L);
        dto.setCargarGarantia(false);
        return dto;
    }

    @Test
    void guardar_modeloInexistente_lanzaBusinessException() {

        when(modeloRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> releService.guardar(dtoValido()))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Modelo no encontrado");

        verify(releRepository, never()).save(any());
    }

    @Test
    void guardar_numeroSerieDuplicado_lanzaBusinessException() {

        when(releRepository.existsByNumeroSerie("  sn-001  "))
                .thenReturn(true);

        assertThatThrownBy(() -> releService.guardar(dtoValido()))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Ya existe un relé con ese número de serie");

        verify(releRepository, never()).save(any());
    }

    @Test
    void guardar_normalizaNumeroSerieYCodigoConfiguracionAMayusculas() {

        ReleResponseDTO resultado =
                releService.guardar(dtoValido());

        assertThat(resultado.getNumeroSerie()).isEqualTo("SN-001");
        assertThat(resultado.getCodigoConfiguracion()).isEqualTo("CFG-1");
        assertThat(resultado.getActivo()).isTrue();
    }

    @Test
    void guardar_sinPosicionInicial_lanzaBusinessException() {

        ReleRequestDTO dto = dtoValido();
        dto.setPosicionInicialId(null);

        assertThatThrownBy(() -> releService.guardar(dto))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("posición inicial");

        verify(movimientoRepository, never()).save(any());
    }

    @Test
    void guardar_creaElMovimientoInicialEnStockConLaPosicionIndicada() {

        ReleResponseDTO resultado =
                releService.guardar(dtoValido());

        assertThat(resultado.getEstadoActual()).isEqualTo("EN_STOCK");
        assertThat(resultado.getPosicionActual()).isEqualTo("Estante 1");
        assertThat(resultado.getLocalidadActual()).isEqualTo("Deposito Central");

        verify(movimientoRepository, times(1)).save(any(Movimiento.class));
    }

    @Test
    void guardar_conCargarGarantiaTrue_calculaFinGarantiaDesdeInicioMasMeses() {

        ReleRequestDTO dto = dtoValido();
        dto.setCargarGarantia(true);
        dto.setGarantiaMeses(12);
        dto.setInicioGarantia(LocalDate.of(2026, 1, 1));

        ReleResponseDTO resultado =
                releService.guardar(dto);

        assertThat(resultado.getInicioGarantia()).isEqualTo(LocalDate.of(2026, 1, 1));
        assertThat(resultado.getFinGarantia()).isEqualTo(LocalDate.of(2027, 1, 1));
        assertThat(resultado.getGarantiaMeses()).isEqualTo(12);
    }

    @Test
    void guardar_conCargarGarantiaFalse_dejaCamposDeGarantiaEnNull() {

        ReleRequestDTO dto = dtoValido();
        dto.setCargarGarantia(false);
        dto.setGarantiaMeses(12);
        dto.setInicioGarantia(LocalDate.of(2026, 1, 1));

        ReleResponseDTO resultado =
                releService.guardar(dto);

        assertThat(resultado.getGarantiaMeses()).isNull();
        assertThat(resultado.getInicioGarantia()).isNull();
        assertThat(resultado.getFinGarantia()).isNull();
    }

    @Test
    void actualizar_numeroSerieDuplicadoEnOtroRele_lanzaBusinessException() {

        Rele existente = new Rele();
        existente.setId(5L);
        existente.setModelo(modelo);

        when(releRepository.findById(5L))
                .thenReturn(Optional.of(existente));

        when(releRepository.existsByNumeroSerieAndIdNot("SN-999", 5L))
                .thenReturn(true);

        ReleRequestDTO dto = dtoValido();
        dto.setNumeroSerie("SN-999");

        assertThatThrownBy(() -> releService.actualizar(5L, dto))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Ya existe un relé con ese número de serie");
    }

    @Test
    void darDeBaja_releYaInactivo_lanzaBusinessException() {

        Rele rele = new Rele();
        rele.setId(1L);
        rele.setActivo(false);

        when(releRepository.findById(1L))
                .thenReturn(Optional.of(rele));

        assertThatThrownBy(() -> releService.darDeBaja(1L, "motivo"))
                .isInstanceOf(BusinessException.class);

        verify(movimientoRepository, never()).save(any());
    }

    @Test
    void darDeBaja_releSinHistorial_lanzaBusinessException() {

        Rele rele = new Rele();
        rele.setId(1L);
        rele.setActivo(true);

        when(releRepository.findById(1L))
                .thenReturn(Optional.of(rele));

        when(movimientoRepository
                .findTopByReleIdOrderByFechaMovimientoDescIdDesc(1L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> releService.darDeBaja(1L, "motivo"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("historial");
    }

    @Test
    void darDeBaja_transicionNoPermitida_lanzaBusinessException() {

        Rele rele = new Rele();
        rele.setId(1L);
        rele.setActivo(true);

        Movimiento ultimoMovimiento = new Movimiento();
        ultimoMovimiento.setEstado(enStock);
        ultimoMovimiento.setPosicion(posicion);

        Estado baja = new Estado(2L, "BAJA", null);

        when(releRepository.findById(1L))
                .thenReturn(Optional.of(rele));

        when(movimientoRepository
                .findTopByReleIdOrderByFechaMovimientoDescIdDesc(1L))
                .thenReturn(Optional.of(ultimoMovimiento));

        when(estadoRepository.findByNombreIgnoreCase("BAJA"))
                .thenReturn(Optional.of(baja));

        when(transicionEstadoRepository
                .existsByEstadoOrigenIdAndEstadoDestinoId(1L, 2L))
                .thenReturn(false);

        assertThatThrownBy(() -> releService.darDeBaja(1L, "motivo"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("no permitida");

        verify(releBajaService, never()).aplicarBaja(any(), any());
    }

    @Test
    void darDeBaja_caminoFeliz_aplicaBajaYRegistraMovimiento() {

        Rele rele = new Rele();
        rele.setId(1L);
        rele.setActivo(true);

        Movimiento ultimoMovimiento = new Movimiento();
        ultimoMovimiento.setEstado(enStock);
        ultimoMovimiento.setPosicion(posicion);

        Estado baja = new Estado(2L, "BAJA", null);

        when(releRepository.findById(1L))
                .thenReturn(Optional.of(rele));

        when(movimientoRepository
                .findTopByReleIdOrderByFechaMovimientoDescIdDesc(1L))
                .thenReturn(Optional.of(ultimoMovimiento));

        when(estadoRepository.findByNombreIgnoreCase("BAJA"))
                .thenReturn(Optional.of(baja));

        when(transicionEstadoRepository
                .existsByEstadoOrigenIdAndEstadoDestinoId(1L, 2L))
                .thenReturn(true);

        releService.darDeBaja(1L, "  Rotura irreparable  ");

        assertThat(rele.getActivo()).isFalse();
        assertThat(rele.getMotivoBaja()).isEqualTo("Rotura irreparable");
        assertThat(rele.getFechaBaja()).isNotNull();

        verify(releBajaService, times(1))
                .aplicarBaja(rele, "  Rotura irreparable  ");

        verify(movimientoRepository, times(1)).save(any(Movimiento.class));
        verify(releRepository, times(1)).save(rele);
    }
}
