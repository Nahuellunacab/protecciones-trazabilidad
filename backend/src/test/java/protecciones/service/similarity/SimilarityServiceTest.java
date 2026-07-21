package protecciones.service.similarity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class SimilarityServiceTest {

    private static final Set<String> PALABRAS_IGNORADAS_DESTINO =
            Set.of("ET", "E", "T", "ESTACION", "TRANSFORMADORA");

    private SimilarityService similarityService;

    @BeforeEach
    void setUp() {

        similarityService = new SimilarityService();
    }

    @Test
    void buscarSimilares_nombreExactamenteIgualTrasNormalizar_devuelve100PorCiento() {

        List<CandidatoSimilitud> candidatos = List.of(
                new CandidatoSimilitud(1L, "Bell Ville")
        );

        List<ResultadoSimilitud> resultados =
                similarityService.buscarSimilares(
                        "BELL   VILLE",
                        candidatos
                );

        assertThat(resultados).hasSize(1);
        assertThat(resultados.get(0).getId()).isEqualTo(1L);
        assertThat(resultados.get(0).getSimilitud()).isEqualTo(100);
    }

    @Test
    void buscarSimilares_ignorandoSiglasYNivelesDeTension_detectaElMismoDestino() {

        List<CandidatoSimilitud> candidatos = List.of(
                new CandidatoSimilitud(1L, "ET Bell Ville")
        );

        List<ResultadoSimilitud> resultados =
                similarityService.buscarSimilares(
                        "E.T. Bell Ville 132KV",
                        candidatos,
                        PALABRAS_IGNORADAS_DESTINO
                );

        assertThat(resultados).hasSize(1);
        assertThat(resultados.get(0).getSimilitud()).isEqualTo(100);
    }

    @Test
    void buscarSimilares_ordenaDeMayorAMenorSimilitud() {

        List<CandidatoSimilitud> candidatos = List.of(
                new CandidatoSimilitud(1L, "Rio Cuarto"),
                new CandidatoSimilitud(2L, "Bell Ville Norte"),
                new CandidatoSimilitud(3L, "Bell Ville")
        );

        List<ResultadoSimilitud> resultados =
                similarityService.buscarSimilares(
                        "Bell Ville",
                        candidatos
                );

        assertThat(resultados)
                .extracting(ResultadoSimilitud::getId)
                .containsExactly(3L, 2L);

        assertThat(resultados.get(0).getSimilitud())
                .isGreaterThanOrEqualTo(resultados.get(1).getSimilitud());
    }

    @Test
    void buscarSimilares_pordebajoDelUmbral_esExcluidoDelResultado() {

        List<CandidatoSimilitud> candidatos = List.of(
                new CandidatoSimilitud(1L, "Cordoba Capital")
        );

        List<ResultadoSimilitud> resultados =
                similarityService.buscarSimilares(
                        "Bell Ville",
                        candidatos
                );

        assertThat(resultados).isEmpty();
    }

    @Test
    void buscarSimilares_conUmbralPersonalizadoMasEstricto_excluyeCoincidenciasParciales() {

        List<CandidatoSimilitud> candidatos = List.of(
                new CandidatoSimilitud(1L, "Bell Ville"),
                new CandidatoSimilitud(2L, "Bell Ville Norte")
        );

        List<ResultadoSimilitud> resultados =
                similarityService.buscarSimilares(
                        "Bell Ville",
                        candidatos,
                        Set.of(),
                        99
                );

        assertThat(resultados)
                .extracting(ResultadoSimilitud::getId)
                .containsExactly(1L);
    }

    @Test
    void buscarSimilares_textoVacio_devuelveListaVacia() {

        List<CandidatoSimilitud> candidatos = List.of(
                new CandidatoSimilitud(1L, "Bell Ville")
        );

        assertThat(similarityService.buscarSimilares("   ", candidatos))
                .isEmpty();
    }

    @Test
    void buscarSimilares_sinCandidatos_devuelveListaVacia() {

        assertThat(similarityService.buscarSimilares("Bell Ville", List.of()))
                .isEmpty();
    }
}
