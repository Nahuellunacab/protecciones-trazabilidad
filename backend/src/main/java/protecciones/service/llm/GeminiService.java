package protecciones.service.llm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Base64;
import java.util.List;
import java.util.Map;

// Implementacion de LLMService contra la Gemini API (Google AI Studio),
// usada por DashboardService (resumen ejecutivo) y por CopilotoIAService
// (Copiloto IA). RemitoIAService tambien depende de esta clase en forma
// concreta (no de la interfaz) porque necesita generarTextoConArchivo,
// que es especifico de Gemini (envio multimodal de PDF/imagen) y todavia
// no forma parte de la abstraccion generica LLMService.
// Se eligio Gemini por tener capa gratuita real (no trial con vencimiento);
// dado el volumen bajo de uso esperado, no justifica un proveedor pago.
@Service
public class GeminiService implements LLMService {

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

        return apiKey != null && !apiKey.isBlank();
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
