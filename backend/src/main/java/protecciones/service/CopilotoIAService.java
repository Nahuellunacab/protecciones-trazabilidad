package protecciones.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.stereotype.Service;

import protecciones.dto.CopilotoAccionDTO;
import protecciones.dto.CopilotoConsultaRequestDTO;
import protecciones.dto.CopilotoConsultaResponseDTO;
import protecciones.dto.MovimientoResponseDTO;
import protecciones.dto.dashboard.DashboardKpiDTO;
import protecciones.dto.dashboard.DestinoCantidadDTO;
import protecciones.dto.dashboard.EstadoCantidadDTO;
import protecciones.dto.dashboard.MarcaCantidadDTO;
import protecciones.dto.dashboard.ModeloCantidadDTO;
import protecciones.dto.dashboard.ProveedorCantidadDTO;
import protecciones.exception.BusinessException;
import protecciones.service.llm.LLMService;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.function.Function;

// Copiloto IA del dashboard: reconoce automaticamente si el mensaje del
// usuario es una CONSULTA (pregunta sobre datos reales del sistema) o una
// ACCION (navegar/filtrar la interfaz), y responde de una sola de esas dos
// formas. NO usa RAG ni base vectorial, y el LLM nunca accede a la base de
// datos: este service arma un contexto de texto plano reutilizando
// DashboardService (sin duplicar ninguna consulta) y se lo manda al modelo
// (a traves de LLMService, nunca acoplado a Gemini directamente) junto con
// el mensaje del usuario.
//
// Las acciones que el modelo puede pedir estan limitadas a un vocabulario
// fijo de navegacion/filtrado (ver ACCIONES_VALIDAS); el backend valida
// cada accion contra ese whitelist antes de devolverla al frontend, asi
// que aunque el modelo alucine un nombre de accion o de modulo, nunca se
// propaga: se degrada a una respuesta de texto pidiendo que se reformule.
// El Copiloto jamas ejecuta ni describe una operacion de escritura
// (eliminar, dar de baja, modificar movimientos, cambiar estados, crear
// reles): ese vocabulario de acciones directamente no existe en el
// whitelist.
@Service
public class CopilotoIAService {

    private static final int MAX_OUTPUT_TOKENS = 700;

    // Igual que en el resumen ejecutivo, pero mandamos las distribuciones
    // COMPLETAS (no solo el top N): el usuario puede preguntar o filtrar
    // por una marca/modelo/destino puntual que no sea de los mas
    // representados.
    private static final int LIMITE_MOVIMIENTOS_CONTEXTO = 20;

    private static final Set<String> ACCIONES_VALIDAS = Set.of(
            "FILTRAR_RELES",
            "ABRIR_RELE",
            "IR_A_MODULO"
    );

    private static final Set<String> MODULOS_VALIDOS = Set.of(
            "DASHBOARD",
            "RELES",
            "MOVIMIENTOS",
            "ADMINISTRACION"
    );

    private static final DateTimeFormatter FORMATO_FECHA =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private static final String PROMPT_SISTEMA = """
            Sos el Copiloto IA del sistema de trazabilidad operativa de
            reles de proteccion electrica de EPEC Transmision. Con cada
            mensaje del usuario tenes que decidir automaticamente si es
            una CONSULTA o un pedido de ACCION, y responder de una sola de
            estas dos formas (nunca mezcladas, nunca las dos a la vez):

            1) CONSULTA: el usuario pregunta algo sobre el estado del
               sistema (cantidades, marcas, modelos, garantias,
               documentacion, movimientos, etc.). Respondes en TEXTO PLANO
               con formato markdown (listas, negritas, tablas cuando
               corresponda), usando UNICAMENTE los datos del contexto que
               se te entrega mas abajo. Nunca inventes cifras ni datos que
               no esten en ese contexto; si no esta la informacion, decilo
               explicitamente en vez de adivinar o aproximar.

            2) ACCION: el usuario pide navegar o filtrar la interfaz (por
               ejemplo "mostrame los ABB", "filtra Schneider", "abri el
               rele <numero de serie>", "anda al modulo Movimientos",
               "abrir dashboard"). En ese caso respondes EXCLUSIVAMENTE con
               un JSON valido: sin texto antes ni despues, sin
               explicaciones, sin bloques de codigo (no uses ```), con uno
               de estos formatos EXACTOS (nunca inventes otro campo ni
               otro nombre de accion):

               { "accion": "FILTRAR_RELES", "marca": "...", "modelo": "...", "estado": "...", "proveedor": "...", "destino": "..." }
               (incluir solo los campos de filtro que el usuario haya
               pedido; omitir o dejar en null el resto de los campos)

               { "accion": "ABRIR_RELE", "serie": "..." }

               { "accion": "IR_A_MODULO", "modulo": "DASHBOARD" | "RELES" | "MOVIMIENTOS" | "ADMINISTRACION" }

            Reglas estrictas que debes cumplir siempre:
            1. Para "marca", "modelo", "estado" y "destino" en una accion
               FILTRAR_RELES, usa exactamente uno de los nombres que
               aparecen en las distribuciones del contexto (no inventes,
               no abrevies, no traduzcas el nombre).
            2. El Copiloto SOLO puede navegar y filtrar. Nunca generes una
               accion para eliminar registros, dar de baja, modificar
               movimientos, cambiar estados o crear reles: si te piden
               algo asi, respondé como CONSULTA explicando que el
               asistente solo puede navegar y filtrar, no ejecutar esa
               operacion.
            3. Si el pedido no tiene relacion con el sistema de
               trazabilidad de reles, respondé como CONSULTA aclarando que
               solo podes ayudar con datos y navegacion del sistema.
            4. En una CONSULTA se breve y directo (maximo 6 a 8 lineas),
               en español rioplatense, tono profesional.
            """;

    private final DashboardService dashboardService;

    private final LLMService llmService;

    private final ObjectMapper objectMapper;

    public CopilotoIAService(
            DashboardService dashboardService,
            LLMService llmService
    ) {

        this.dashboardService =
                dashboardService;

        this.llmService =
                llmService;

        this.objectMapper =
                new ObjectMapper();
    }

    public CopilotoConsultaResponseDTO consultar(
            CopilotoConsultaRequestDTO dto
    ) {

        if (!llmService.estaDisponible()) {

            throw new BusinessException(
                    "El Copiloto IA no está disponible en este momento."
            );
        }

        String contexto =
                construirContexto();

        String respuestaCruda;

        try {

            respuestaCruda =
                    llmService.generarTexto(
                            PROMPT_SISTEMA,
                            contexto
                                    + "\nMensaje del usuario: "
                                    + dto.getMensaje().trim(),
                            MAX_OUTPUT_TOKENS
                    );

        } catch (RuntimeException ex) {

            throw new BusinessException(
                    "No se pudo obtener una respuesta del Copiloto. Intente nuevamente."
            );
        }

        if (respuestaCruda == null || respuestaCruda.isBlank()) {

            throw new BusinessException(
                    "El Copiloto no devolvió una respuesta. Intente nuevamente."
            );
        }

        return interpretarRespuesta(respuestaCruda);
    }

    private CopilotoConsultaResponseDTO interpretarRespuesta(
            String textoCrudo
    ) {

        JsonNode nodo =
                intentarParsearJson(
                        quitarBloqueCodigo(textoCrudo)
                );

        if (nodo != null) {

            CopilotoAccionDTO accion =
                    validarYMapearAccion(nodo);

            if (accion != null) {

                return new CopilotoConsultaResponseDTO(
                        "ACCION",
                        null,
                        accion
                );
            }

            if (nodo.has("accion")) {

                // Parseo como JSON y tenia un campo "accion", pero no paso
                // la validacion (nombre desconocido, faltan campos
                // obligatorios, modulo invalido, etc.): en vez de arriesgar
                // una accion mal formada, se degrada a una respuesta de
                // texto pidiendo que se reformule.
                return new CopilotoConsultaResponseDTO(
                        "RESPUESTA",
                        "No pude interpretar esa acción con precisión. "
                                + "¿Podés reformularla? Por ejemplo: "
                                + "\"mostrame los ABB\" o "
                                + "\"abrí el relé <número de serie>\".",
                        null
                );
            }
        }

        // No es un JSON de accion: se interpreta como respuesta de texto
        // en markdown, tal cual la devolvio el modelo.
        return new CopilotoConsultaResponseDTO(
                "RESPUESTA",
                textoCrudo.trim(),
                null
        );
    }

    private CopilotoAccionDTO validarYMapearAccion(
            JsonNode nodo
    ) {

        String accion =
                textoOrNull(nodo, "accion");

        if (accion == null) {

            return null;
        }

        String accionNormalizada =
                accion.trim().toUpperCase();

        if (!ACCIONES_VALIDAS.contains(accionNormalizada)) {

            return null;
        }

        CopilotoAccionDTO resultado =
                new CopilotoAccionDTO();

        resultado.setAccion(accionNormalizada);

        switch (accionNormalizada) {

            case "FILTRAR_RELES" -> {

                resultado.setMarca(textoOrNull(nodo, "marca"));
                resultado.setModelo(textoOrNull(nodo, "modelo"));
                resultado.setEstado(textoOrNull(nodo, "estado"));
                resultado.setProveedor(textoOrNull(nodo, "proveedor"));
                resultado.setDestino(textoOrNull(nodo, "destino"));

                boolean tieneAlgunFiltro =
                        resultado.getMarca() != null
                        || resultado.getModelo() != null
                        || resultado.getEstado() != null
                        || resultado.getProveedor() != null
                        || resultado.getDestino() != null;

                if (!tieneAlgunFiltro) {

                    return null;
                }
            }

            case "ABRIR_RELE" -> {

                String serie =
                        textoOrNull(nodo, "serie");

                if (serie == null) {

                    return null;
                }

                resultado.setSerie(serie);
            }

            case "IR_A_MODULO" -> {

                String modulo =
                        textoOrNull(nodo, "modulo");

                if (
                        modulo == null
                        || !MODULOS_VALIDOS.contains(modulo.trim().toUpperCase())
                ) {

                    return null;
                }

                resultado.setModulo(modulo.trim().toUpperCase());
            }

            default -> {

                return null;
            }
        }

        return resultado;
    }

    private JsonNode intentarParsearJson(
            String texto
    ) {

        if (texto == null || texto.isBlank()) {

            return null;
        }

        try {

            JsonNode nodo =
                    objectMapper.readTree(texto);

            return nodo.isObject() ? nodo : null;

        } catch (JsonProcessingException ex) {

            return null;
        }
    }

    private String quitarBloqueCodigo(
            String texto
    ) {

        String limpio =
                texto.trim();

        if (limpio.startsWith("```")) {

            limpio =
                    limpio.replaceFirst("^```[a-zA-Z]*", "").trim();

            if (limpio.endsWith("```")) {

                limpio =
                        limpio.substring(0, limpio.length() - 3).trim();
            }
        }

        return limpio;
    }

    private String textoOrNull(
            JsonNode nodo,
            String campo
    ) {

        JsonNode valor =
                nodo.get(campo);

        if (valor == null || valor.isNull() || !valor.isTextual()) {

            return null;
        }

        String texto =
                valor.asText().trim();

        return texto.isBlank() ? null : texto;
    }

    private String construirContexto() {

        DashboardKpiDTO kpis =
                dashboardService.obtenerKpis();

        List<EstadoCantidadDTO> porEstado =
                dashboardService.obtenerRelesPorEstado();

        List<MarcaCantidadDTO> porMarca =
                dashboardService.obtenerRelesPorMarca();

        List<ModeloCantidadDTO> porModelo =
                dashboardService.obtenerRelesPorModelo();

        List<DestinoCantidadDTO> porDestino =
                dashboardService.obtenerRelesPorDestino();

        List<ProveedorCantidadDTO> porProveedor =
                dashboardService.obtenerRelesPorProveedor();

        LocalDate hoy =
                LocalDate.now();

        List<MovimientoResponseDTO> movimientosDeHoy =
                dashboardService.obtenerUltimosMovimientos(500, hoy, hoy);

        List<MovimientoResponseDTO> movimientosRecientes =
                dashboardService.obtenerUltimosMovimientos(
                        LIMITE_MOVIMIENTOS_CONTEXTO,
                        null,
                        null
                );

        StringBuilder contexto =
                new StringBuilder();

        contexto.append(
                """
                === Datos actuales del sistema de trazabilidad de relés (EPEC) ===

                Módulos disponibles en la interfaz: DASHBOARD, RELES, MOVIMIENTOS, ADMINISTRACION.

                KPIs generales:
                Total de relés: %d
                Relés activos: %d
                Relés dados de baja: %d
                Relés con garantía vencida: %d
                Relés sin documentación vinculada (remito u orden de provisión): %d
                Documentación vinculada sin archivo adjunto: %d
                Remitos sin asociar a ningún relé: %d
                Órdenes de provisión sin asociar a ningún relé: %d
                Relés sin historial de movimientos: %d
                Movimientos registrados hoy (%s): %d

                """.formatted(
                        kpis.getTotalReles(),
                        kpis.getRelesActivos(),
                        kpis.getRelesBaja(),
                        kpis.getGarantiasVencidas(),
                        kpis.getRelesSinDocumentacion(),
                        kpis.getRelesDocumentacionSinArchivo(),
                        kpis.getRemitosPendientes(),
                        kpis.getOrdenesPendientes(),
                        kpis.getRelesSinHistorial(),
                        hoy,
                        movimientosDeHoy.size()
                )
        );

        agregarSeccion(
                contexto,
                "Distribución de relés por estado operativo (todos)",
                porEstado,
                EstadoCantidadDTO::getEstado,
                EstadoCantidadDTO::getCantidad
        );

        agregarSeccion(
                contexto,
                "Distribución de relés por marca (todas)",
                porMarca,
                MarcaCantidadDTO::getMarca,
                MarcaCantidadDTO::getCantidad
        );

        agregarSeccion(
                contexto,
                "Distribución de relés por modelo (todos)",
                porModelo,
                ModeloCantidadDTO::getModelo,
                ModeloCantidadDTO::getCantidad
        );

        agregarSeccion(
                contexto,
                "Distribución de relés por destino (todos)",
                porDestino,
                DestinoCantidadDTO::getDestino,
                DestinoCantidadDTO::getCantidad
        );

        agregarSeccion(
                contexto,
                "Distribución de relés por proveedor (todos)",
                porProveedor,
                ProveedorCantidadDTO::getProveedor,
                ProveedorCantidadDTO::getCantidad
        );

        if (!movimientosRecientes.isEmpty()) {

            contexto.append(
                    "Movimientos más recientes (los últimos "
                            + movimientosRecientes.size()
                            + "):\n"
            );

            movimientosRecientes.forEach(movimiento ->

                    contexto.append("- ")
                            .append(
                                    movimiento.getFechaMovimiento() != null
                                            ? movimiento.getFechaMovimiento().format(FORMATO_FECHA)
                                            : "sin fecha"
                            )
                            .append(" | Relé ")
                            .append(movimiento.getRele())
                            .append(" (")
                            .append(movimiento.getMarca())
                            .append(" ")
                            .append(movimiento.getModelo())
                            .append(") | Estado: ")
                            .append(movimiento.getEstado())
                            .append(" | Destino: ")
                            .append(movimiento.getDestino())
                            .append(" | Posición: ")
                            .append(movimiento.getPosicion())
                            .append(" | Responsable: ")
                            .append(
                                    movimiento.getResponsable() != null
                                            ? movimiento.getResponsable()
                                            : "N/D"
                            )
                            .append("\n")
            );
        }

        return contexto.toString();
    }

    private <T> void agregarSeccion(
            StringBuilder contexto,
            String titulo,
            List<T> items,
            Function<T, String> etiqueta,
            Function<T, Long> cantidad
    ) {

        if (items.isEmpty()) {

            return;
        }

        contexto.append(titulo)
                .append(":\n");

        items.forEach(item ->
                contexto.append("- ")
                        .append(etiqueta.apply(item))
                        .append(": ")
                        .append(cantidad.apply(item))
                        .append("\n")
        );

        contexto.append("\n");
    }
}
