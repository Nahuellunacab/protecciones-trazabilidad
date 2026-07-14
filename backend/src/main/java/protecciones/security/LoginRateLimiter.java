package protecciones.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import protecciones.exception.TooManyRequestsException;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

// Bloqueo temporal de login ante intentos fallidos repetidos, tanto por
// identificador (cuenta) como por IP de origen: el primero frena fuerza
// bruta contra una cuenta puntual, el segundo frena a un mismo atacante
// probando muchas cuentas distintas. En memoria porque hoy corre una sola
// instancia de backend (ver docker-compose.yml); si se escala horizontalmente
// esto tendria que moverse a un store compartido (ej. Redis).
@Component
public class LoginRateLimiter {

    private static final int LIMITE_ENTRADAS_ANTES_DE_LIMPIAR = 1000;

    private final int maxIntentos;

    private final Duration duracionBloqueo;

    private final ConcurrentMap<String, Intentos> porIdentificador =
            new ConcurrentHashMap<>();

    private final ConcurrentMap<String, Intentos> porIp =
            new ConcurrentHashMap<>();

    public LoginRateLimiter(
            @Value("${auth.login.max-intentos:5}") int maxIntentos,
            @Value("${auth.login.bloqueo-minutos:15}") long bloqueoMinutos
    ) {

        this.maxIntentos = maxIntentos;
        this.duracionBloqueo = Duration.ofMinutes(bloqueoMinutos);
    }

    public void verificarNoBloqueado(
            String identificador,
            String ip
    ) {

        verificarNoBloqueado(porIdentificador, identificador);
        verificarNoBloqueado(porIp, ip);
    }

    public void registrarFallo(
            String identificador,
            String ip
    ) {

        registrarFallo(porIdentificador, identificador);
        registrarFallo(porIp, ip);
    }

    public void registrarExito(
            String identificador,
            String ip
    ) {

        porIdentificador.remove(identificador);
        porIp.remove(ip);
    }

    private void verificarNoBloqueado(
            ConcurrentMap<String, Intentos> mapa,
            String clave
    ) {

        Intentos intentos = mapa.get(clave);

        if (intentos != null && intentos.estaBloqueado(duracionBloqueo)) {

            throw new TooManyRequestsException(
                    "Demasiados intentos fallidos. Intente nuevamente en unos minutos."
            );
        }
    }

    private void registrarFallo(
            ConcurrentMap<String, Intentos> mapa,
            String clave
    ) {

        if (mapa.size() > LIMITE_ENTRADAS_ANTES_DE_LIMPIAR) {

            mapa.entrySet().removeIf(
                    entry -> entry.getValue().expiro(duracionBloqueo)
            );
        }

        mapa.compute(clave, (k, intentos) -> {

            if (intentos == null || intentos.expiro(duracionBloqueo)) {

                intentos = new Intentos();
            }

            intentos.incrementar(maxIntentos);

            return intentos;
        });
    }

    private static class Intentos {

        private int cantidad;

        private Instant ultimoIntento = Instant.now();

        private Instant bloqueadoDesde;

        void incrementar(int maxIntentos) {

            cantidad++;
            ultimoIntento = Instant.now();

            if (cantidad >= maxIntentos) {

                bloqueadoDesde = ultimoIntento;
            }
        }

        boolean estaBloqueado(Duration duracionBloqueo) {

            return bloqueadoDesde != null
                    && Instant.now().isBefore(bloqueadoDesde.plus(duracionBloqueo));
        }

        // Una entrada "expiro" cuando ya no esta bloqueada y tampoco tuvo
        // actividad reciente: se puede reiniciar el conteo desde cero.
        boolean expiro(Duration duracionBloqueo) {

            return !estaBloqueado(duracionBloqueo)
                    && Instant.now().isAfter(ultimoIntento.plus(duracionBloqueo));
        }
    }
}
