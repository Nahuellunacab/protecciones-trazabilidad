package protecciones.service.llm;

// Abstraccion de proveedor de LLM: toda llamada a un modelo de lenguaje en
// el sistema (resumen ejecutivo del dashboard, Copiloto IA, etc.) debe
// depender de esta interfaz, nunca de una implementacion concreta como
// GeminiService. Para agregar otro proveedor (OpenRouterService,
// DeepSeekService, OllamaService...) alcanza con una nueva clase @Service
// que implemente estos dos metodos y reemplazar el bean activo (por
// ejemplo con @Primary o un profile), sin tocar los services que ya
// consumen LLMService.
public interface LLMService {

    boolean estaDisponible();

    String generarTexto(
            String systemPrompt,
            String userPrompt,
            int maxOutputTokens
    );
}
