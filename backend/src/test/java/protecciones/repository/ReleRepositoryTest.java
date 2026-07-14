package protecciones.repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.dao.DataIntegrityViolationException;

import protecciones.entity.Marca;
import protecciones.entity.Modelo;
import protecciones.entity.Rele;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ReleRepositoryTest extends RepositoryTestBase {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ReleRepository releRepository;

    private Modelo modelo;

    @BeforeEach
    void setUp() {

        Marca marca = entityManager.persistAndFlush(new Marca(null, "Marca Test Rele"));
        modelo = entityManager.persistAndFlush(new Modelo(null, "Modelo Test Rele", marca));
    }

    private Rele crearRele(String numeroSerie, boolean activo) {

        Rele rele = new Rele();
        rele.setNumeroSerie(numeroSerie);
        rele.setModelo(modelo);
        rele.setTipoIngreso("NUEVO");
        rele.setActivo(activo);

        return entityManager.persistAndFlush(rele);
    }

    @Test
    void existsByNumeroSerie_serieExistente_devuelveTrue() {

        crearRele("RELE-TEST-001", true);

        assertThat(releRepository.existsByNumeroSerie("RELE-TEST-001")).isTrue();
    }

    @Test
    void existsByNumeroSerie_serieInexistente_devuelveFalse() {

        assertThat(releRepository.existsByNumeroSerie("RELE-TEST-NO-EXISTE")).isFalse();
    }

    @Test
    void existsByNumeroSerieAndIdNot_mismoRele_devuelveFalse() {

        Rele rele = crearRele("RELE-TEST-002", true);

        boolean existe = releRepository.existsByNumeroSerieAndIdNot("RELE-TEST-002", rele.getId());

        assertThat(existe).isFalse();
    }

    @Test
    void existsByNumeroSerieAndIdNot_otroReleConLaMismaSerie_devuelveTrue() {

        Rele rele = crearRele("RELE-TEST-003", true);
        Rele otro = crearRele("RELE-TEST-003-OTRO", true);

        boolean existe = releRepository.existsByNumeroSerieAndIdNot("RELE-TEST-003", otro.getId());

        assertThat(existe).isTrue();
    }

    @Test
    void numeroSerie_duplicado_violaLaRestriccionUniqueDeLaBaseDeDatos() {

        crearRele("RELE-TEST-DUP", true);

        Rele duplicado = new Rele();
        duplicado.setNumeroSerie("RELE-TEST-DUP");
        duplicado.setModelo(modelo);
        duplicado.setTipoIngreso("NUEVO");
        duplicado.setActivo(true);

        assertThatThrownBy(() -> releRepository.saveAndFlush(duplicado))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void findByNumeroSerieAndActivoTrue_releActivo_loEncuentra() {

        crearRele("RELE-TEST-004", true);

        Optional<Rele> resultado = releRepository.findByNumeroSerieAndActivoTrue("RELE-TEST-004");

        assertThat(resultado).isPresent();
    }

    @Test
    void findByNumeroSerieAndActivoTrue_releDadoDeBaja_noLoEncuentra() {

        crearRele("RELE-TEST-005", false);

        Optional<Rele> resultado = releRepository.findByNumeroSerieAndActivoTrue("RELE-TEST-005");

        assertThat(resultado).isEmpty();
    }

    @Test
    void countByActivoTrueYFalse_cuentanCorrectamenteSegunElEstadoDelRele() {

        long antesActivos = releRepository.countByActivoTrue();
        long antesInactivos = releRepository.countByActivoFalse();

        crearRele("RELE-TEST-006-A", true);
        crearRele("RELE-TEST-006-B", true);
        crearRele("RELE-TEST-006-C", false);

        assertThat(releRepository.countByActivoTrue()).isEqualTo(antesActivos + 2);
        assertThat(releRepository.countByActivoFalse()).isEqualTo(antesInactivos + 1);
    }

    @Test
    void buscarGeneral_encuentraPorNumeroDeSerieModeloOMarcaEntreLosRelesActivos() {

        crearRele("RELE-TEST-BUSCAR-007", true);

        List<Rele> porSerie = releRepository.buscarGeneral("BUSCAR-007");
        List<Rele> porModelo = releRepository.buscarGeneral("Modelo Test Rele");
        List<Rele> porMarca = releRepository.buscarGeneral("Marca Test Rele");

        assertThat(porSerie).extracting(Rele::getNumeroSerie).contains("RELE-TEST-BUSCAR-007");
        assertThat(porModelo).extracting(Rele::getNumeroSerie).contains("RELE-TEST-BUSCAR-007");
        assertThat(porMarca).extracting(Rele::getNumeroSerie).contains("RELE-TEST-BUSCAR-007");
    }

    @Test
    void buscarGeneral_releInactivo_noApareceEnLaBusqueda() {

        crearRele("RELE-TEST-BUSCAR-008", false);

        List<Rele> resultado = releRepository.buscarGeneral("BUSCAR-008");

        assertThat(resultado).isEmpty();
    }

    @Test
    void countSinHistorial_cuentaSoloLosRelesSinNingunMovimiento() {

        long antes = releRepository.countSinHistorial();

        crearRele("RELE-TEST-009", true);

        assertThat(releRepository.countSinHistorial()).isEqualTo(antes + 1);
    }
}
