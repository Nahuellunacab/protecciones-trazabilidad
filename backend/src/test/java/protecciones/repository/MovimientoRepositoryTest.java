package protecciones.repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

import protecciones.entity.Destino;
import protecciones.entity.Estado;
import protecciones.entity.Localidad;
import protecciones.entity.Marca;
import protecciones.entity.Modelo;
import protecciones.entity.Movimiento;
import protecciones.entity.Posicion;
import protecciones.entity.Provincia;
import protecciones.entity.Rele;
import protecciones.entity.Usuario;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class MovimientoRepositoryTest extends RepositoryTestBase {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private MovimientoRepository movimientoRepository;

    private Estado enStock;

    private Estado ensayo;

    private Posicion posicion;

    private Usuario usuario;

    private Modelo modeloCompartido;

    @BeforeEach
    void setUp() {

        Marca marca = entityManager.persistAndFlush(new Marca(null, "Marca Test Movimiento"));
        modeloCompartido = entityManager.persistAndFlush(new Modelo(null, "Modelo Test Movimiento", marca));

        Provincia provincia = entityManager.persistAndFlush(new Provincia(null, "Provincia Test"));
        Localidad localidad = entityManager.persistAndFlush(new Localidad(null, "Localidad Test", provincia));

        Destino destino = new Destino();
        destino.setNombre("Destino Test");
        destino.setLocalidad(localidad);
        destino = entityManager.persistAndFlush(destino);

        posicion = entityManager.persistAndFlush(new Posicion(null, "Posicion Test", destino));

        enStock = entityManager.persistAndFlush(new Estado(null, "TEST_MOV_EN_STOCK", null));
        ensayo = entityManager.persistAndFlush(new Estado(null, "TEST_MOV_ENSAYO", null));

        usuario = new Usuario(null, "Usuario", "Test", "usuario.test.movimiento." + System.nanoTime() + "@epec.com");
        usuario.setRol("OPERADOR");
        usuario.setActivo(true);
        usuario.setNumeroSobre("TEST-" + System.nanoTime());
        usuario = entityManager.persistAndFlush(usuario);
    }

    private Rele crearRele(String numeroSerie) {

        Rele rele = new Rele();
        rele.setNumeroSerie(numeroSerie);
        rele.setModelo(modeloCompartido);
        rele.setTipoIngreso("NUEVO");
        rele.setActivo(true);

        return entityManager.persistAndFlush(rele);
    }

    private Movimiento crearMovimiento(Rele rele, Estado estado, LocalDateTime fecha) {

        Movimiento movimiento = new Movimiento();
        movimiento.setRele(rele);
        movimiento.setEstado(estado);
        movimiento.setPosicion(posicion);
        movimiento.setUsuario(usuario);
        movimiento.setFechaMovimiento(fecha);
        movimiento.setNotas("nota de prueba");

        return entityManager.persistAndFlush(movimiento);
    }

    @Test
    void findTopByReleIdOrderByFechaMovimientoDescIdDesc_devuelveElMasReciente() {

        Rele rele = crearRele("MOV-TEST-001");

        crearMovimiento(rele, enStock, LocalDateTime.of(2026, 1, 1, 10, 0));
        Movimiento masReciente = crearMovimiento(rele, ensayo, LocalDateTime.of(2026, 2, 1, 10, 0));

        Optional<Movimiento> resultado =
                movimientoRepository.findTopByReleIdOrderByFechaMovimientoDescIdDesc(rele.getId());

        assertThat(resultado).isPresent();
        assertThat(resultado.get().getId()).isEqualTo(masReciente.getId());
        assertThat(resultado.get().getEstado().getNombre()).isEqualTo("TEST_MOV_ENSAYO");
    }

    @Test
    void findTopByReleIdOrderByFechaMovimientoDescIdDesc_mismaFecha_desempataPorIdDesc() {

        Rele rele = crearRele("MOV-TEST-002");

        LocalDateTime mismaFecha = LocalDateTime.of(2026, 3, 1, 12, 0);

        crearMovimiento(rele, enStock, mismaFecha);
        Movimiento segundoInsertado = crearMovimiento(rele, ensayo, mismaFecha);

        Optional<Movimiento> resultado =
                movimientoRepository.findTopByReleIdOrderByFechaMovimientoDescIdDesc(rele.getId());

        assertThat(resultado).isPresent();
        assertThat(resultado.get().getId()).isEqualTo(segundoInsertado.getId());
    }

    @Test
    void findByReleIdOrderByFechaMovimientoDescIdDesc_devuelveElHistorialCompletoOrdenadoDescendente() {

        Rele rele = crearRele("MOV-TEST-003");

        crearMovimiento(rele, enStock, LocalDateTime.of(2026, 1, 1, 8, 0));
        crearMovimiento(rele, ensayo, LocalDateTime.of(2026, 1, 2, 8, 0));
        crearMovimiento(rele, enStock, LocalDateTime.of(2026, 1, 3, 8, 0));

        List<Movimiento> historial =
                movimientoRepository.findByReleIdOrderByFechaMovimientoDescIdDesc(rele.getId());

        assertThat(historial).hasSize(3);
        assertThat(historial.get(0).getFechaMovimiento()).isEqualTo(LocalDateTime.of(2026, 1, 3, 8, 0));
        assertThat(historial.get(2).getFechaMovimiento()).isEqualTo(LocalDateTime.of(2026, 1, 1, 8, 0));
    }

    @Test
    void findUltimosMovimientos_devuelveSoloElUltimoMovimientoPorRele() {

        Rele releA = crearRele("MOV-TEST-004-A");
        Rele releB = crearRele("MOV-TEST-004-B");

        crearMovimiento(releA, enStock, LocalDateTime.of(2026, 1, 1, 8, 0));
        Movimiento ultimoDeA = crearMovimiento(releA, ensayo, LocalDateTime.of(2026, 1, 5, 8, 0));

        Movimiento ultimoDeB = crearMovimiento(releB, enStock, LocalDateTime.of(2026, 1, 2, 8, 0));

        List<Movimiento> ultimos = movimientoRepository.findUltimosMovimientos();

        List<Long> idsDeLosReles = List.of(releA.getId(), releB.getId());

        List<Movimiento> ultimosDeNuestrosReles = ultimos.stream()
                .filter(m -> idsDeLosReles.contains(m.getRele().getId()))
                .toList();

        assertThat(ultimosDeNuestrosReles)
                .extracting(Movimiento::getId)
                .containsExactlyInAnyOrder(ultimoDeA.getId(), ultimoDeB.getId());
    }
}
