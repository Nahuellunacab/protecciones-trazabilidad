package protecciones.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import protecciones.dto.ReleDetectadoDTO;
import protecciones.dto.ReleExtraidoDTO;
import protecciones.dto.RemitoAnalisisResponseDTO;
import protecciones.dto.RemitoDatosExtraidosDTO;
import protecciones.dto.ValidacionItemDTO;
import protecciones.entity.Marca;
import protecciones.entity.Modelo;
import protecciones.entity.Proveedor;
import protecciones.entity.Rele;
import protecciones.exception.BusinessException;
import protecciones.repository.MarcaRepository;
import protecciones.repository.ModeloRepository;
import protecciones.repository.ProveedorRepository;
import protecciones.repository.ReleRepository;
import protecciones.service.llm.GeminiService;

import java.io.IOException;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

// Carga Inteligente por Remito: Gemini solo extrae texto estructurado del
// documento (PDF/imagen), nunca decide nada de negocio. Toda validacion
// (existencia de marca/modelo, duplicados de numero de serie, clasificacion
// de accesorios, etc.) se hace aca contra los repositorios reales y con
// reglas propias, igual que si el usuario hubiera tipeado los datos a mano.
// El alta real de los reles la sigue haciendo ReleService (via el mismo
// endpoint POST /api/reles), esto solo devuelve una propuesta para que el
// usuario la revise antes de confirmar.
@Service
public class RemitoIAService {

    private static final Set<String> TIPOS_ACEPTADOS = Set.of(
            "application/pdf",
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp"
    );

    private static final int MAX_OUTPUT_TOKENS = 4096;

    // Palabras clave (ya normalizadas: mayusculas, sin acentos) que indican
    // que un producto NO es un rele de proteccion sino un accesorio. Lista
    // extensible: agregar mas terminos aca si aparecen nuevos casos.
    private static final Set<String> PALABRAS_CLAVE_ACCESORIO = Set.of(
            "ZOCALO",
            "SOCKET",
            "TEST BLOCK",
            "TESTBLOCK",
            "JUMPER",
            "PATCHCORD",
            "PATCH CORD",
            "CABLE",
            "CONECTOR",
            "CONNECTOR",
            "DESCARGADOR",
            "FIREWALL",
            "ANTENA",
            "ANTENNA",
            "KIT",
            "ACCESORIO",
            "ACCESSORY",
            "REPUESTO",
            "SPARE",
            "TEST PLUG",
            "TEST SWITCH",
            "BORNE",
            "REGLETA",
            "BASE DE PRUEBA",
            "BASE DE ENSAYO"
    );

    // Prefijos de codigo de modelo conocidos como accesorios (no reles),
    // aunque el texto no contenga ninguna palabra clave reconocible. Ej.
    // real: la serie RTXP de ABB son zocalos/interruptores de prueba para
    // reles, no reles en si mismos.
    private static final Set<String> PREFIJOS_MODELO_ACCESORIO = Set.of(
            "RTXP"
    );

    private static final String PROMPT_SISTEMA = """
            Sos un asistente que analiza documentos de remitos y ordenes de
            provision de reles de proteccion electrica para una empresa de
            energia (EPEC). Tu unica tarea es leer el documento adjunto y
            transcribir la informacion que contiene en un JSON con una
            estructura fija. No tomas decisiones de negocio, no validas
            datos contra ningun catalogo: solo transcribis exactamente lo
            que esta escrito en el documento.

            Reglas estrictas que debes cumplir:

            1. Analiza EXCLUSIVAMENTE el documento adjunto. No inventes,
               completes ni asumas ningun dato que no este escrito en el
               documento.
            2. Detecta UNICAMENTE reles de proteccion electrica. Ignora
               cualquier otro producto que aparezca en el mismo remito,
               aunque este en la misma tabla o item que los reles, como:
               zocalos o bases de prueba (test sockets, por ejemplo la
               familia RTXP), test blocks, jumpers, patchcords, cables,
               conectores, descargadores, firewalls, antenas, kits,
               accesorios y repuestos en general. Si el remito lista varios
               productos distintos, devolve EXCLUSIVAMENTE los que sean
               reles de proteccion: no incluyas en "reles" ningun objeto
               para estos otros productos, ni siquiera con los campos en
               null. Ante la duda de si un item es un rele o un accesorio,
               fijate si tiene numero de serie propio y funcion de
               proteccion: los accesorios normalmente no tienen numero de
               serie individual o se identifican como repuesto/accesorio en
               la descripcion.
            3. Detecta TODOS los reles de proteccion listados en el
               documento (no te saltees ninguno).
            4. Genera UN registro dentro de "reles" por CADA numero de
               serie encontrado. Si un mismo modelo tiene varios numeros
               de serie, genera un objeto distinto por cada numero de
               serie (nunca agrupes varios numeros de serie en un solo
               objeto ni los concatenes en un mismo campo).
            5. Es muy comun en remitos industriales (por ejemplo de EPEC o
               de fabricantes como ABB) que una misma fila o item de la
               tabla liste varios numeros de serie consecutivos para el
               mismo rele (mismo modelo, marca y codigo de configuracion),
               escribiendo la marca/modelo/codigo una sola vez para todo
               el grupo y despues solo los numeros de serie (en una lista,
               un rango, o varias filas seguidas sin repetir el encabezado
               del item). Cuando detectes esta situacion, repeti la marca,
               el modelo y el codigo de configuracion en el objeto de CADA
               numero de serie de ese grupo: cada objeto de "reles" debe
               quedar completo por si solo, incluso si en el documento esos
               datos no estan repetidos visualmente para cada numero de
               serie individual. Nunca dejes marca/modelo/codigo en null
               solo porque "ya se escribieron antes" para ese mismo grupo.
            6. Si un dato no existe en el documento o no se puede leer con
               certeza, dejalo en null. Nunca inventes un valor para
               completar un campo vacio ni asumas valores por defecto.
            7. Tu respuesta debe ser UNICAMENTE un JSON valido: sin texto
               antes o despues, sin explicaciones, sin comentarios, sin
               marcadores de bloque de codigo (no uses ```).
            8. Respeta EXACTAMENTE esta estructura (los campos simples son
               siempre string o null; "reles" es siempre un array, incluso
               vacio si no se detecta ningun rele):

            {
              "numeroRemito": "",
              "fecha": "",
              "proveedor": "",
              "ordenProvision": "",
              "reles": [
                {
                  "marca": "",
                  "modelo": "",
                  "codigoConfiguracion": "",
                  "numeroSerie": ""
                }
              ]
            }

            Ejemplo de un item con 3 numeros de serie consecutivos del mismo
            rele (marca/modelo/codigo repetidos en los 3 objetos), en un
            remito que tambien incluye un zocalo de pruebas que NO debe
            aparecer en "reles":

            {
              "reles": [
                { "marca": "ABB", "modelo": "RET620", "codigoConfiguracion": "CFG-01", "numeroSerie": "1001" },
                { "marca": "ABB", "modelo": "RET620", "codigoConfiguracion": "CFG-01", "numeroSerie": "1002" },
                { "marca": "ABB", "modelo": "RET620", "codigoConfiguracion": "CFG-01", "numeroSerie": "1003" }
              ]
            }

            (el zocalo de pruebas RTXP24 que pueda figurar en el mismo
            remito no genera ningun objeto dentro de "reles")

            9. El campo "fecha" debe expresarse en formato AAAA-MM-DD si se
               puede reconocer con certeza; si no, dejalo en null.
            10. Si el documento no es un remito/orden de provision o no
                contiene reles reconocibles, devolve igual el JSON con
                "reles": [] y el resto de los campos en null. Nunca
                devuelvas texto libre ni un JSON con una forma distinta a
                la indicada.
            """;

    private final GeminiService geminiService;

    private final MarcaRepository marcaRepository;

    private final ModeloRepository modeloRepository;

    private final ProveedorRepository proveedorRepository;

    private final ReleRepository releRepository;

    private final ObjectMapper objectMapper;

    public RemitoIAService(
            GeminiService geminiService,
            MarcaRepository marcaRepository,
            ModeloRepository modeloRepository,
            ProveedorRepository proveedorRepository,
            ReleRepository releRepository
    ) {

        this.geminiService = geminiService;
        this.marcaRepository = marcaRepository;
        this.modeloRepository = modeloRepository;
        this.proveedorRepository = proveedorRepository;
        this.releRepository = releRepository;
        this.objectMapper = new ObjectMapper();
    }

    public RemitoAnalisisResponseDTO analizar(
            MultipartFile archivo
    ) {

        if (archivo == null || archivo.isEmpty()) {

            throw new BusinessException(
                    "Debe adjuntar un archivo de remito"
            );
        }

        String contentType =
                archivo.getContentType();

        if (
                contentType == null
                ||
                !TIPOS_ACEPTADOS.contains(contentType.toLowerCase())
        ) {

            throw new BusinessException(
                    "Formato de archivo no soportado. Adjunte un PDF o una imagen (PNG/JPG)"
            );
        }

        if (!geminiService.estaDisponible()) {

            throw new BusinessException(
                    "La carga inteligente por IA no esta disponible en este momento. Cargue los datos manualmente."
            );
        }

        byte[] bytes;

        try {

            bytes = archivo.getBytes();

        } catch (IOException ex) {

            throw new BusinessException(
                    "No se pudo leer el archivo adjunto"
            );
        }

        String respuestaCruda;

        try {

            respuestaCruda =
                    geminiService.generarTextoConArchivo(
                            PROMPT_SISTEMA,
                            "Analiza el remito adjunto y devolve unicamente el JSON con la informacion solicitada.",
                            bytes,
                            contentType,
                            MAX_OUTPUT_TOKENS
                    );

        } catch (RuntimeException ex) {

            throw new BusinessException(
                    "No se pudo analizar el documento con IA. Intente nuevamente o cargue los datos manualmente."
            );
        }

        JsonNode json =
                parsearJson(respuestaCruda);

        RemitoDatosExtraidosDTO datos =
                mapearDatos(json);

        return procesar(datos);
    }

    // Revalida los mismos datos ya extraidos (sin volver a llamar a
    // Gemini), usado desde el dialogo de importacion despues de que el
    // usuario crea una marca/modelo/proveedor faltante: solo se repite el
    // matching contra los catalogos, que ahora ya incluyen el registro
    // recien creado.
    public RemitoAnalisisResponseDTO revalidar(
            RemitoDatosExtraidosDTO datos
    ) {

        if (datos == null || datos.getReles() == null) {

            throw new BusinessException(
                    "No hay datos para revalidar"
            );
        }

        return procesar(datos);
    }

    private JsonNode parsearJson(
            String texto
    ) {

        if (texto == null || texto.isBlank()) {

            throw new BusinessException(
                    "La IA no devolvio ningun resultado. Intente nuevamente."
            );
        }

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

        JsonNode nodo;

        try {

            nodo = objectMapper.readTree(limpio);

        } catch (JsonProcessingException ex) {

            throw new BusinessException(
                    "La IA no devolvio un JSON valido. Intente nuevamente o cargue los datos manualmente."
            );
        }

        if (
                !nodo.isObject()
                ||
                !nodo.has("reles")
                ||
                !nodo.get("reles").isArray()
        ) {

            throw new BusinessException(
                    "La IA no devolvio el formato esperado. Intente nuevamente o cargue los datos manualmente."
            );
        }

        return nodo;
    }

    private RemitoDatosExtraidosDTO mapearDatos(
            JsonNode json
    ) {

        RemitoDatosExtraidosDTO datos =
                new RemitoDatosExtraidosDTO();

        datos.setNumeroRemito(
                textoOrNull(json, "numeroRemito")
        );

        datos.setFecha(
                textoOrNull(json, "fecha")
        );

        datos.setProveedor(
                textoOrNull(json, "proveedor")
        );

        datos.setOrdenProvision(
                textoOrNull(json, "ordenProvision")
        );

        List<ReleExtraidoDTO> reles = new ArrayList<>();

        for (JsonNode item : json.get("reles")) {

            ReleExtraidoDTO rele =
                    new ReleExtraidoDTO();

            rele.setMarca(textoOrNull(item, "marca"));
            rele.setModelo(textoOrNull(item, "modelo"));
            rele.setCodigoConfiguracion(textoOrNull(item, "codigoConfiguracion"));
            rele.setNumeroSerie(textoOrNull(item, "numeroSerie"));

            reles.add(rele);
        }

        datos.setReles(reles);

        return datos;
    }

    private RemitoAnalisisResponseDTO procesar(
            RemitoDatosExtraidosDTO datos
    ) {

        RemitoAnalisisResponseDTO respuesta =
                new RemitoAnalisisResponseDTO();

        respuesta.setNumeroRemito(datos.getNumeroRemito());

        respuesta.setFecha(datos.getFecha());

        respuesta.setOrdenProvision(datos.getOrdenProvision());

        String proveedorTexto =
                datos.getProveedor();

        respuesta.setProveedor(proveedorTexto);

        Proveedor proveedor =
                proveedorTexto != null
                        ? proveedorRepository
                                .findByNombreIgnoreCase(proveedorTexto)
                                .orElse(null)
                        : null;

        respuesta.setProveedorEncontrado(proveedor != null);

        respuesta.setProveedorId(
                proveedor != null ? proveedor.getId() : null
        );

        List<ReleExtraidoDTO> itemsRele =
                datos.getReles() != null
                        ? datos.getReles()
                        : List.of();

        Map<String, Long> conteoSeries =
                itemsRele.stream()
                        .map(ReleExtraidoDTO::getNumeroSerie)
                        .filter(Objects::nonNull)
                        .map(serie -> serie.toUpperCase())
                        .collect(
                                Collectors.groupingBy(
                                        serie -> serie,
                                        Collectors.counting()
                                )
                        );

        // Postprocesamiento "fill-forward": Gemini a veces solo completa
        // marca/modelo/codigoConfiguracion en el primer numero de serie de
        // un grupo y deja los siguientes en null (aunque el prompt le pida
        // repetirlos). No confiamos solo en el LLM para esto: si un campo
        // viene vacio en un item, se completa con el ultimo valor no nulo
        // visto en orden de aparicion en el documento (se asume que forma
        // parte del mismo item/grupo que el registro anterior). Los items
        // clasificados como accesorio nunca actualizan "ultimoModelo", para
        // que no contaminen el modelo heredado por una fila de rele
        // posterior con el modelo vacio.
        List<ReleDetectadoDTO> reles = new ArrayList<>();

        List<String> accesoriosIgnorados = new ArrayList<>();

        String ultimaMarca = null;

        String ultimoModelo = null;

        String ultimoCodigoConfiguracion = null;

        for (ReleExtraidoDTO item : itemsRele) {

            String marcaTexto =
                    item.getMarca();

            String modeloTexto =
                    item.getModelo();

            String codigoConfiguracion =
                    item.getCodigoConfiguracion();

            String numeroSerie =
                    item.getNumeroSerie();

            boolean marcaCompletada =
                    marcaTexto == null && ultimaMarca != null;

            boolean modeloCompletado =
                    modeloTexto == null && ultimoModelo != null;

            boolean codigoCompletado =
                    codigoConfiguracion == null && ultimoCodigoConfiguracion != null;

            if (marcaTexto != null) {

                ultimaMarca = marcaTexto;

            } else {

                marcaTexto = ultimaMarca;
            }

            boolean esAccesorioPropio =
                    modeloTexto != null && pareceAccesorio(modeloTexto);

            if (modeloTexto != null) {

                if (!esAccesorioPropio) {

                    ultimoModelo = modeloTexto;
                }

            } else {

                modeloTexto = ultimoModelo;
            }

            if (codigoConfiguracion != null) {

                ultimoCodigoConfiguracion = codigoConfiguracion;

            } else {

                codigoConfiguracion = ultimoCodigoConfiguracion;
            }

            ReleDetectadoDTO evaluado =
                    evaluarRele(
                            marcaTexto,
                            modeloTexto,
                            codigoConfiguracion,
                            numeroSerie,
                            marcaCompletada,
                            modeloCompletado,
                            codigoCompletado,
                            conteoSeries,
                            accesoriosIgnorados
                    );

            if (evaluado != null) {

                reles.add(evaluado);
            }
        }

        respuesta.setReles(reles);

        respuesta.setAccesoriosIgnorados(accesoriosIgnorados);

        respuesta.setCantidadAccesoriosIgnorados(accesoriosIgnorados.size());

        long validos =
                reles.stream()
                        .filter(ReleDetectadoDTO::isValido)
                        .count();

        // Los items sin marca o sin modelo resuelto son "modelos nuevos"
        // (falta cargar un catalogo, se puede resolver con el boton de
        // creacion rapida desde el dialogo); el resto de los invalidos son
        // "errores" propiamente dichos (serie repetida/existente/faltante).
        long modelosNuevos =
                reles.stream()
                        .filter(rele -> !rele.isValido())
                        .filter(rele ->
                                rele.getMarcaId() == null
                                ||
                                rele.getModeloId() == null
                        )
                        .count();

        long conError =
                reles.size() - validos - modelosNuevos;

        respuesta.setCantidadValidos((int) validos);

        respuesta.setCantidadModelosNuevos((int) modelosNuevos);

        respuesta.setCantidadConError((int) conError);

        respuesta.setTodosValidos(
                !reles.isEmpty() && modelosNuevos == 0 && conError == 0
        );

        return respuesta;
    }

    private ReleDetectadoDTO evaluarRele(
            String marcaTexto,
            String modeloTexto,
            String codigoConfiguracion,
            String numeroSerie,
            boolean marcaCompletada,
            boolean modeloCompletado,
            boolean codigoCompletado,
            Map<String, Long> conteoSeries,
            List<String> accesoriosIgnorados
    ) {

        // El codigo de configuracion, cuando ya esta cargado en algun rele
        // existente, es mas confiable que el texto de marca/modelo leido
        // por OCR: se usa como fuente de verdad para recuperar el modelo
        // correcto, ignorando discrepancias con el texto detectado.
        Rele releConMismoCodigo =
                codigoConfiguracion != null
                        ? releRepository
                                .findFirstByCodigoConfiguracionIgnoreCase(
                                        codigoConfiguracion
                                )
                                .orElse(null)
                        : null;

        Marca marca;

        Modelo modelo;

        boolean modeloPorCodigo = false;

        boolean modeloCorregidoPorOCR = false;

        String modeloDetectadoOriginal = modeloTexto;

        if (releConMismoCodigo != null) {

            modelo = releConMismoCodigo.getModelo();

            marca = modelo.getMarca();

            modeloPorCodigo = true;

        } else {

            marca =
                    marcaTexto != null
                            ? marcaRepository
                                    .findByNombreIgnoreCase(marcaTexto)
                                    .orElse(null)
                            : null;

            List<Modelo> candidatos =
                    marca != null
                            ? modeloRepository.findByMarcaId(marca.getId())
                            : modeloRepository.findAllByOrderByNombreAsc();

            Modelo encontrado = null;

            if (modeloTexto != null) {

                encontrado =
                        candidatos.stream()
                                .filter(candidato ->
                                        candidato.getNombre()
                                                .equalsIgnoreCase(modeloTexto)
                                )
                                .findFirst()
                                .orElse(null);

                if (encontrado == null) {

                    encontrado =
                            buscarModeloConTolerancia(
                                    modeloTexto,
                                    candidatos
                            );

                    if (encontrado != null) {

                        modeloCorregidoPorOCR = true;
                    }
                }

                if (encontrado != null && marca == null) {

                    marca = encontrado.getMarca();
                }
            }

            modelo = encontrado;
        }

        // Si el modelo no se pudo resolver contra ningun catalogo, antes de
        // tratarlo como error verificamos si en realidad no es un rele
        // (zocalo, test block, cable, etc.): Gemini a veces igual devuelve
        // estos productos pese al prompt, y no confiamos solo en el LLM
        // para filtrarlos. Si parece un accesorio, se descarta en silencio
        // en vez de mostrarse como "modelo inexistente".
        if (modelo == null && modeloTexto != null && pareceAccesorio(modeloTexto)) {

            accesoriosIgnorados.add(
                    numeroSerie != null
                            ? modeloTexto + " (serie " + numeroSerie.toUpperCase() + ")"
                            : modeloTexto
            );

            return null;
        }

        ReleDetectadoDTO dto =
                new ReleDetectadoDTO();

        dto.setMarca(marcaTexto);
        dto.setModelo(modeloTexto);
        dto.setCodigoConfiguracion(codigoConfiguracion);

        dto.setNumeroSerie(
                numeroSerie != null
                        ? numeroSerie.toUpperCase()
                        : null
        );

        List<ValidacionItemDTO> validaciones = new ArrayList<>();

        boolean valido = true;

        if (marca != null) {

            dto.setMarcaId(marca.getId());

            dto.setMarca(marca.getNombre());

            validaciones.add(
                    ok(
                            marcaCompletada
                                    ? "Marca completada automáticamente"
                                    : "Marca encontrada"
                    )
            );

        } else {

            valido = false;

            validaciones.add(
                    error(
                            marcaTexto != null
                                    ? "Marca inexistente: " + marcaTexto
                                    : "Marca no detectada"
                    )
            );
        }

        if (modelo != null) {

            dto.setModeloId(modelo.getId());

            dto.setModelo(modelo.getNombre());

            if (modeloPorCodigo) {

                validaciones.add(
                        ok("Modelo determinado por código de configuración ya registrado")
                );

            } else if (modeloCorregidoPorOCR) {

                validaciones.add(
                        ok(
                                "Modelo encontrado (corregido de \""
                                        + modeloDetectadoOriginal
                                        + "\")"
                        )
                );

            } else {

                validaciones.add(
                        ok(
                                modeloCompletado
                                        ? "Modelo completado automáticamente"
                                        : "Modelo encontrado"
                        )
                );
            }

        } else {

            valido = false;

            validaciones.add(
                    error(
                            modeloTexto != null
                                    ? "Modelo inexistente: " + modeloTexto
                                    : "Modelo no detectado"
                    )
            );
        }

        if (codigoConfiguracion != null) {

            validaciones.add(
                    ok(
                            codigoCompletado
                                    ? "Código de configuración completado automáticamente"
                                    : "Configuración encontrada"
                    )
            );

        } else {

            validaciones.add(advertencia("Sin código de configuración"));
        }

        if (dto.getNumeroSerie() == null) {

            valido = false;

            validaciones.add(error("Número de serie no detectado"));

        } else if (conteoSeries.getOrDefault(dto.getNumeroSerie(), 0L) > 1) {

            valido = false;

            validaciones.add(error("Serie repetida en el documento"));

        } else if (releRepository.existsByNumeroSerie(dto.getNumeroSerie())) {

            valido = false;

            validaciones.add(error("Serie existente"));

        } else {

            validaciones.add(ok("Serie disponible"));
        }

        dto.setValidaciones(validaciones);
        dto.setValido(valido);

        return dto;
    }

    private boolean pareceAccesorio(
            String modeloTexto
    ) {

        String normalizado =
                normalizarTexto(modeloTexto);

        for (String palabraClave : PALABRAS_CLAVE_ACCESORIO) {

            if (normalizado.contains(palabraClave)) {

                return true;
            }
        }

        String compacto =
                normalizado.replace(" ", "");

        for (String prefijo : PREFIJOS_MODELO_ACCESORIO) {

            if (compacto.startsWith(prefijo)) {

                return true;
            }
        }

        return false;
    }

    private String normalizarTexto(
            String texto
    ) {

        String sinAcentos =
                Normalizer.normalize(texto.toUpperCase(), Normalizer.Form.NFD)
                        .replaceAll("\\p{M}", "");

        return sinAcentos.trim();
    }

    // Mapa de caracteres que el OCR confunde tipicamente entre si (letra
    // vs digito de forma parecida). Se usa solo para comparar nombres de
    // modelo con tolerancia a errores, nunca para decisiones de negocio.
    private static final Map<Character, Character> CARACTERES_OCR_CONFUNDIBLES =
            Map.ofEntries(
                    Map.entry('O', '0'),
                    Map.entry('I', '1'),
                    Map.entry('L', '1'),
                    Map.entry('S', '5'),
                    Map.entry('B', '8'),
                    Map.entry('Z', '2')
            );

    // Busca, entre los modelos candidatos (ya acotados por marca cuando se
    // conoce), el que mas se parezca al texto detectado por OCR, tolerando
    // errores tipicos de reconocimiento (ej. "RET62O" vs "RET620"). Solo
    // devuelve una coincidencia si es unica y suficientemente cercana, para
    // no adivinar un modelo incorrecto cuando hay varios candidatos parecidos.
    private Modelo buscarModeloConTolerancia(
            String modeloTexto,
            List<Modelo> candidatos
    ) {

        String normalizadoObjetivo =
                normalizarParaComparacionOCR(modeloTexto);

        if (normalizadoObjetivo.isBlank()) {

            return null;
        }

        Modelo mejor = null;

        int mejorDistancia = Integer.MAX_VALUE;

        int segundaMejorDistancia = Integer.MAX_VALUE;

        for (Modelo candidato : candidatos) {

            String normalizadoCandidato =
                    normalizarParaComparacionOCR(
                            candidato.getNombre()
                    );

            int distancia =
                    distanciaLevenshtein(
                            normalizadoObjetivo,
                            normalizadoCandidato
                    );

            if (distancia < mejorDistancia) {

                segundaMejorDistancia = mejorDistancia;

                mejorDistancia = distancia;

                mejor = candidato;

            } else if (distancia < segundaMejorDistancia) {

                segundaMejorDistancia = distancia;
            }
        }

        int umbral =
                Math.max(1, normalizadoObjetivo.length() / 6);

        boolean coincidenciaAceptable =
                mejor != null
                        && mejorDistancia <= umbral
                        && mejorDistancia < segundaMejorDistancia;

        return coincidenciaAceptable ? mejor : null;
    }

    private String normalizarParaComparacionOCR(
            String texto
    ) {

        StringBuilder normalizado =
                new StringBuilder();

        for (char caracter : texto.toUpperCase().toCharArray()) {

            if (Character.isLetterOrDigit(caracter)) {

                normalizado.append(
                        CARACTERES_OCR_CONFUNDIBLES.getOrDefault(
                                caracter,
                                caracter
                        )
                );
            }
        }

        return normalizado.toString();
    }

    private int distanciaLevenshtein(
            String a,
            String b
    ) {

        int[][] distancias =
                new int[a.length() + 1][b.length() + 1];

        for (int i = 0; i <= a.length(); i++) {

            distancias[i][0] = i;
        }

        for (int j = 0; j <= b.length(); j++) {

            distancias[0][j] = j;
        }

        for (int i = 1; i <= a.length(); i++) {

            for (int j = 1; j <= b.length(); j++) {

                int costoSustitucion =
                        a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;

                distancias[i][j] = Math.min(
                        Math.min(
                                distancias[i - 1][j] + 1,
                                distancias[i][j - 1] + 1
                        ),
                        distancias[i - 1][j - 1] + costoSustitucion
                );
            }
        }

        return distancias[a.length()][b.length()];
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

    private ValidacionItemDTO ok(String mensaje) {

        return new ValidacionItemDTO(mensaje, "OK");
    }

    private ValidacionItemDTO advertencia(String mensaje) {

        return new ValidacionItemDTO(mensaje, "ADVERTENCIA");
    }

    private ValidacionItemDTO error(String mensaje) {

        return new ValidacionItemDTO(mensaje, "ERROR");
    }
}
