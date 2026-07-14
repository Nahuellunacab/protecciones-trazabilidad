package protecciones.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    // Por defecto solo localhost/127.0.0.1 (cualquier puerto), para no romper
    // el flujo de desarrollo (npm run dev) ni el build dockerizado existente.
    // En producción hay que setear CORS_ALLOWED_ORIGINS con el/los dominio(s)
    // reales (separados por coma), porque un origen HTTPS de producción no
    // matchea estos patrones y el navegador rechazaría la respuesta.
    private final String[] origenesPermitidos;

    public CorsConfig(
            @Value("${cors.allowed-origins:http://localhost:*,http://127.0.0.1:*}")
            String origenesPermitidos
    ) {

        this.origenesPermitidos =
                Arrays.stream(origenesPermitidos.split(","))
                        .map(String::trim)
                        .filter(origen -> !origen.isEmpty())
                        .toArray(String[]::new);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(
                List.of(origenesPermitidos));

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS",
                        "PATCH"));

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}