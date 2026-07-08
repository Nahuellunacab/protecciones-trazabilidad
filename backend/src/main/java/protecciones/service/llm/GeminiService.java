package protecciones.service.llm;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

// Implementacion de LLMService contra la Gemini API (Google AI Studio),
// usada por DashboardService (resumen ejecutivo) y por CopilotoIAService
// (Copiloto IA). RemitoIAService tambien depende de esta clase en forma
// concreta (no de la interfaz) porque necesita generarTextoConArchivo,
// que es especifico de Gemini (envio multimodal de PDF/imagen) y todavia
// no forma parte de la abstraccion generica LLMService.
// Se eligio Gemini por tener capa gratuita real (no trial con vencimiento);
// dado el volumen bajo de uso esperado, no justifica un proveedor pago.
//
// Soporta varias claves de API rotando automaticamente: "gemini.api-key"
// puede ser una sola clave o una lista separada por comas (una por cuenta
// de Google AI Studio). Cuando una clave devuelve 429 (cuota diaria
// agotada), se reintenta la misma llamada con la siguiente clave de la
// lista antes de fallar; el puntero queda en esa clave para las llamadas
// siguientes, asi no se vuelve a probar la agotada en cada request.
@Service
public class GeminiService implements LLMService {

    private static final String API_URL_TEMPLATE =
            "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    private static final Logger
            log = LoggerFactory.getLogger(GeminiService.class);

    private final RestClient
            restClient;

    private final List<String>
            apiKeys;

    private final String
            modelo;

    // Indice de la ultima clave usada (o intentada); arranca en la
    // primera y solo avanza cuando una clave agota su cuota, nunca vuelve
    // atras sola (si todas estan agotadas, el ciclo las vuelve a probar
    // todas en el siguiente request, asi se auto-recupera cuando Google
    // resetea la cuota diaria sin necesidad de trackear horarios).
    private final AtomicInteger
            indiceClaveActual = new AtomicInteger(0);

    public GeminiService(
            @Value("${gemini.api-key:}")
            String apiKeysConfiguradas,

            @Value("${gemini.model:gemini-2.5-flash}")
            String modelo
    ) {

        this.apiKeys =
                Arrays.stream(apiKeysConfiguradas.split(","))
                        .map(String::trim)
                        .filter(clave -> !clave.isBlank())
                        .toList();

        this.modelo =
                modelo;

        SimpleClientHttpRequestFactory requestFactory =
                new SimpleClientHttpRequestFactory();

        requestFactory.setConnectTimeout(5_000);

        // 45s: el resumen del dashboard (solo texto) responde rapido, pero
        // el analisis multimodal de un PDF/imagen de remito (ver
        // generarTextoConArchivo) tarda bastante mas que un prompt de texto.
        requestFactory.setReadTimeout(45_000);

        this.restClient =
                RestClient.builder()
                        .requestFactory(requestFactory)
                        .build();
    }

    @Override
    public boolean estaDisponible() {

        return !apiKeys.isEmpty();
    }

    @Override
    public String generarTexto(
            String systemPrompt,
            String userPrompt,
            int maxOutputTokens
    ) {

        return ejecutar(
                systemPrompt,
                List.of(
                        Map.of("text", userPrompt)
                ),
                maxOutputTokens
        );
    }

    // Usado por la carga inteligente por remito (ver RemitoIAService): manda
    // el PDF/imagen del remito como inlineData (base64) junto con el prompt,
    // para que Gemini extraiga los datos del documento en vez de resumir texto.
    // No es parte de LLMService: es especifico de Gemini/multimodal.
    public String generarTextoConArchivo(
            String systemPrompt,
            String userPrompt,
            byte[] archivo,
            String mimeType,
            int maxOutputTokens
    ) {

        String archivoBase64 =
                Base64.getEncoder().encodeToString(archivo);

        return ejecutar(
                systemPrompt,
                List.of(
                        Map.of("text", userPrompt),
                        Map.of(
                                "inlineData", Map.of(
                                        "mimeType", mimeType,
                                        "data", archivoBase64
                                )
                        )
                ),
                maxOutputTokens
        );
    }

    private String ejecutar(
            String systemPrompt,
            List<Map<String, Object>> parts,
            int maxOutputTokens
    ) {

        if (apiKeys.isEmpty()) {

            throw new IllegalStateException(
                    "No hay ninguna clave de Gemini configurada"
            );
        }

        Map<String, Object> body = Map.of(

                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", parts
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

        HttpClientErrorException.TooManyRequests ultimoErrorPorCuota = null;

        for (int intento = 0; intento < apiKeys.size(); intento++) {

            int indice =
                    indiceClaveActual.get() % apiKeys.size();

            String claveActual =
                    apiKeys.get(indice);

            String url =
                    API_URL_TEMPLATE.formatted(modelo, claveActual);

            try {

                Map<?, ?> response =
                        restClient.post()
                                .uri(url)
                                .contentType(MediaType.APPLICATION_JSON)
                                .body(body)
                                .retrieve()
                                .body(Map.class);

                return extraerTexto(response);

            } catch (HttpClientErrorException.TooManyRequests ex) {

                log.warn(
                        "Clave de Gemini #{} de {} alcanzo su cuota (429); "
                                + "rotando a la siguiente.",
                        indice + 1,
                        apiKeys.size()
                );

                ultimoErrorPorCuota = ex;

                indiceClaveActual.incrementAndGet();
            }
        }

        // Se probaron todas las claves configuradas y todas devolvieron 429.
        throw ultimoErrorPorCuota;
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
