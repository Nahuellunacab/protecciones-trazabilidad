package protecciones.security;

import org.junit.jupiter.api.Test;
import protecciones.exception.TooManyRequestsException;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LoginRateLimiterTest {

    private static final String IDENTIFICADOR = "ana@epec.com";

    private static final String IP = "10.0.0.5";

    @Test
    void sinIntentosPrevios_noBloquea() {

        LoginRateLimiter limiter = new LoginRateLimiter(3, 15);

        assertThatCode(() -> limiter.verificarNoBloqueado(IDENTIFICADOR, IP))
                .doesNotThrowAnyException();
    }

    @Test
    void trasAlcanzarElMaximoDeFallosPorIdentificador_bloqueaAunqueLaIpCambie() {

        LoginRateLimiter limiter = new LoginRateLimiter(3, 15);

        limiter.registrarFallo(IDENTIFICADOR, "1.1.1.1");
        limiter.registrarFallo(IDENTIFICADOR, "2.2.2.2");
        limiter.registrarFallo(IDENTIFICADOR, "3.3.3.3");

        assertThatThrownBy(() ->
                limiter.verificarNoBloqueado(IDENTIFICADOR, "4.4.4.4")
        ).isInstanceOf(TooManyRequestsException.class);
    }

    @Test
    void trasAlcanzarElMaximoDeFallosPorIp_bloqueaAunqueElIdentificadorCambie() {

        LoginRateLimiter limiter = new LoginRateLimiter(3, 15);

        limiter.registrarFallo("usuario1@epec.com", IP);
        limiter.registrarFallo("usuario2@epec.com", IP);
        limiter.registrarFallo("usuario3@epec.com", IP);

        assertThatThrownBy(() ->
                limiter.verificarNoBloqueado("usuario4@epec.com", IP)
        ).isInstanceOf(TooManyRequestsException.class);
    }

    @Test
    void conMenosFallosQueElMaximo_noBloquea() {

        LoginRateLimiter limiter = new LoginRateLimiter(3, 15);

        limiter.registrarFallo(IDENTIFICADOR, IP);
        limiter.registrarFallo(IDENTIFICADOR, IP);

        assertThatCode(() -> limiter.verificarNoBloqueado(IDENTIFICADOR, IP))
                .doesNotThrowAnyException();
    }

    @Test
    void registrarExito_reiniciaElContadorDeFallos() {

        LoginRateLimiter limiter = new LoginRateLimiter(3, 15);

        limiter.registrarFallo(IDENTIFICADOR, IP);
        limiter.registrarFallo(IDENTIFICADOR, IP);

        limiter.registrarExito(IDENTIFICADOR, IP);

        limiter.registrarFallo(IDENTIFICADOR, IP);
        limiter.registrarFallo(IDENTIFICADOR, IP);

        assertThatCode(() -> limiter.verificarNoBloqueado(IDENTIFICADOR, IP))
                .doesNotThrowAnyException();
    }

    @Test
    void conDuracionDeBloqueoCero_elBloqueoYaEstaExpiradoAlConsultarlo() {

        LoginRateLimiter limiter = new LoginRateLimiter(1, 0);

        limiter.registrarFallo(IDENTIFICADOR, IP);

        assertThatCode(() -> limiter.verificarNoBloqueado(IDENTIFICADOR, IP))
                .doesNotThrowAnyException();
    }
}
