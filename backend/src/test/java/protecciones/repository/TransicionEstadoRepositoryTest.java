package protecciones.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

import protecciones.entity.Estado;
import protecciones.entity.TransicionEstado;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class TransicionEstadoRepositoryTest extends RepositoryTestBase {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TransicionEstadoRepository transicionEstadoRepository;

    private Estado persistirEstado(String nombre) {

        return entityManager.persistAndFlush(
                new Estado(null, nombre, null)
        );
    }

    @Test
    void existsByEstadoOrigenIdAndEstadoDestinoId_transicionExistente_devuelveTrue() {

        Estado origen = persistirEstado("TEST_EN STOCK");
        Estado destino = persistirEstado("TEST_ENSAYO");

        TransicionEstado transicion = new TransicionEstado();
        transicion.setEstadoOrigen(origen);
        transicion.setEstadoDestino(destino);
        entityManager.persistAndFlush(transicion);

        boolean existe = transicionEstadoRepository
                .existsByEstadoOrigenIdAndEstadoDestinoId(origen.getId(), destino.getId());

        assertThat(existe).isTrue();
    }

    @Test
    void existsByEstadoOrigenIdAndEstadoDestinoId_transicionNoDefinida_devuelveFalse() {

        Estado origen = persistirEstado("TEST_EN SERVICIO");
        Estado destino = persistirEstado("TEST_APROBADO");

        boolean existe = transicionEstadoRepository
                .existsByEstadoOrigenIdAndEstadoDestinoId(origen.getId(), destino.getId());

        assertThat(existe).isFalse();
    }

    @Test
    void findByEstadoOrigenId_devuelveSoloLasTransicionesQueSalenDeEseEstado() {

        Estado origen = persistirEstado("TEST_EN STOCK 2");
        Estado destinoA = persistirEstado("TEST_ENSAYO 2");
        Estado destinoB = persistirEstado("TEST_BAJA 2");
        Estado otroOrigen = persistirEstado("TEST_APROBADO 2");

        TransicionEstado aEnsayo = new TransicionEstado();
        aEnsayo.setEstadoOrigen(origen);
        aEnsayo.setEstadoDestino(destinoA);
        entityManager.persistAndFlush(aEnsayo);

        TransicionEstado aBaja = new TransicionEstado();
        aBaja.setEstadoOrigen(origen);
        aBaja.setEstadoDestino(destinoB);
        entityManager.persistAndFlush(aBaja);

        TransicionEstado desdeOtroOrigen = new TransicionEstado();
        desdeOtroOrigen.setEstadoOrigen(otroOrigen);
        desdeOtroOrigen.setEstadoDestino(destinoA);
        entityManager.persistAndFlush(desdeOtroOrigen);

        List<TransicionEstado> resultado =
                transicionEstadoRepository.findByEstadoOrigenId(origen.getId());

        assertThat(resultado)
                .extracting(t -> t.getEstadoDestino().getNombre())
                .containsExactlyInAnyOrder("TEST_ENSAYO 2", "TEST_BAJA 2");
    }
}
