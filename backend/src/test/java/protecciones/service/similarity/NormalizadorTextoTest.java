package protecciones.service.similarity;

import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class NormalizadorTextoTest {

    @Test
    void normalizar_convierteAMayusculasYQuitaTildes() {

        assertThat(NormalizadorTexto.normalizar("Estación"))
                .isEqualTo("ESTACION");
    }

    @Test
    void normalizar_quitaPuntosGuionesYEspaciosMultiples() {

        assertThat(NormalizadorTexto.normalizar("E.T. -  Bell   Ville"))
                .isEqualTo("E T BELL VILLE");
    }

    @Test
    void normalizar_quitaNivelesDeTension() {

        assertThat(NormalizadorTexto.normalizar("Bell Ville 132KV"))
                .isEqualTo("BELL VILLE");

        assertThat(NormalizadorTexto.normalizar("Bell Ville 66 KV"))
                .isEqualTo("BELL VILLE");
    }

    @Test
    void normalizar_quitaPalabrasIgnoradas() {

        String resultado = NormalizadorTexto.normalizar(
                "E.T. Bell Ville",
                Set.of("E", "T", "ET", "ESTACION", "TRANSFORMADORA")
        );

        assertThat(resultado)
                .isEqualTo("BELL VILLE");
    }

    @Test
    void normalizar_textoNulo_devuelveVacio() {

        assertThat(NormalizadorTexto.normalizar(null))
                .isEmpty();
    }
}
