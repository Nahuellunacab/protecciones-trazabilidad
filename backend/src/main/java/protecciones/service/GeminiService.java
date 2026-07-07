package protecciones.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

// Cliente minimo de la Gemini API (Google AI Studio), usado por
// DashboardService para redactar el resumen ejecutivo del dashboard.
// Se eligio Gemini por tener capa gratuita real (no trial con vencimiento);
// dado el volumen bajo de uso esperado (un resumen recalculado a lo sumo
// cada 30 minutos, ver DashboardService), no justifica un proveedor pago.
@Service
public class GeminiService {

    private static final String API_URL_TEMPLATE =
            "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    private final RestClient
            restClient;

    private final String
            apiKey;

    private final String
            modelo;

    public GeminiService(
            @Value("${gemini.api-key:}")
            String apiKey,

            @Value("${gemini.model:gemini-2.5-flash}")
            String modelo
    ) {

        this.apiKey =
                apiKey;

        this.modelo =
                modelo;

        SimpleClientHttpRequestFactory requestFactory =
                new SimpleClientHttpRequestFactory();

        requestFactory.setConnectTimeout(5_000);

        requestFactory.setReadTimeout(15_000);

        this.restClient =
                RestClient.builder()
                        .requestFactory(requestFactory)
                        .build();
    }

    public boolean estaDisponible() {

        return apiKey != null && !apiKey.isBlank();
    }

    public String generarTexto(
            String systemPrompt,
            String userPrompt,
            int maxOutputTokens
    ) {

        Map<String, Object> body = Map.of(

                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", List.of(
                                        Map.of("text", userPrompt)
                                )
                        )
                ),

                "systemInstruction", Map.of(
                        "parts", Map.of("text", systemPrompt)
                ),

                // thinkingBudget en 0: para un resumen corto no hace falta
                // razonamiento interno, y sin esto Gemini 2.5 Flash gasta
                // casi todo maxOutputTokens en "thinking" y trunca la
                // respuesta real (visto empiricamente: finishReason
                // MAX_TOKENS con thoughtsTokenCount cerca del limite).
                "generationConfig", Map.of(
                        "maxOutputTokens", maxOutputTokens,
                        "thinkingConfig", Map.of("thinkingBudget", 0)
                )
        );

        String url =
                API_URL_TEMPLATE.formatted(modelo, apiKey);

        Map<?, ?> response =
                restClient.post()
                        .uri(url)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(body)
                        .retrieve()
                        .body(Map.class);

        return extraerTexto(response);
    }

    private String extraerTexto(
            Map<?, ?> response
    ) {

        if (response == null) {

            return null;
        }

        Object candidatesObj =
                response.get("candidates");

        if (!(candidatesObj instanceof List<?> candidatos) || candidatos.isEmpty()) {

            return null;
        }

        if (!(candidatos.get(0) instanceof Map<?, ?> primerCandidato)) {

            return null;
        }

        Object contentObj =
                primerCandidato.get("content");

        if (!(contentObj instanceof Map<?, ?> content)) {

            return null;
        }

        Object partsObj =
                content.get("parts");

        if (!(partsObj instanceof List<?> partes) || partes.isEmpty()) {

            return null;
        }

        if (!(partes.get(0) instanceof Map<?, ?> primeraParte)) {

            return null;
        }

        Object texto =
                primeraParte.get("text");

        return texto != null ? texto.toString().trim() : null;
    }
}
