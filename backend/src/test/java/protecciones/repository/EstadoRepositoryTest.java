package protecciones.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

import protecciones.entity.Estado;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class EstadoRepositoryTest extends RepositoryTestBase {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private EstadoRepository estadoRepository;

    @Test
    void findByNombreIgnoreCase_encuentraElEstadoSinImportarMayusculasOMinusculas() {

        entityManager.persistAndFlush(
                new Estado(null, "TEST_ESTADO_ENSAYO", "Estado de prueba")
        );

        Optional<Estado> resultado =
                estadoRepository.findByNombreIgnoreCase("test_estado_ensayo");

        assertThat(resultado).isPresent();
        assertThat(resultado.get().getNombre()).isEqualTo("TEST_ESTADO_ENSAYO");
    }

    @Test
    void findByNombreIgnoreCase_estadoInexistente_devuelveVacio() {

        Optional<Estado> resultado =
                estadoRepository.findByNombreIgnoreCase("ESTADO_QUE_NO_EXISTE_XYZ");

        assertThat(resultado).isEmpty();
    }
}
