# Módulos críticos del sistema — cómo funcionan por dentro

Documento pensado para entender, módulo por módulo, **qué hace cada capa** (Controller → Service → Repository → Entity/BD) en los flujos más importantes del sistema. No repite lo que ya está en `docs/maquina-estados.md` (detalle de estados/transiciones) ni en `docs/autenticacion.md` (login/JWT/roles) — para esos dos temas, ver esos documentos. Acá el foco es: dado un flujo de negocio, **quién hace qué** y en qué orden.

Todo lo que sigue está verificado contra el código real (no es un resumen de memoria), así que los nombres de método/línea son los que vas a encontrar si abrís el archivo.

---

## 0. Cómo leer los diagramas — el patrón de capas

Antes de entrar a cada módulo, la regla general que se repite en **todos** ellos (es la Regla 1-4 de `CLAUDE.md`):

```mermaid
flowchart LR
    FE[Frontend\nReact] -- HTTP/JSON --> C[Controller\n@RestController]
    C -- "delega, sin logica propia" --> S[Service\n@Service]
    S -- "valida, calcula, orquesta" --> R[Repository\nSpring Data JPA]
    R -- Hibernate --> DB[(PostgreSQL)]
    S -- "mapea Entity -> DTO" --> C
    C -- DTO --> FE
```

- **Controller**: traduce HTTP ↔ objetos Java. Recibe un `RequestDTO` (ya validado por Bean Validation vía `@Valid`), llama **un solo método** del Service, devuelve el `ResponseDTO` o un `ResponseEntity`. Si ves un `if` con lógica de negocio en un Controller de este proyecto, es una anomalía, no el patrón.
- **Service**: acá vive el 100% de la lógica de negocio — validaciones, cálculos, orquestación entre repositorios, decisiones ("¿esta transición está permitida?", "¿ya existe este número de serie?"). También hace el mapeo `Entity → DTO` (métodos privados `mapToResponseDTO`/`mapToDTO`).
- **Repository**: interfaces Spring Data JPA. Solo saben hacer consultas (`findBy...`, `existsBy...`); no tienen ninguna decisión de negocio.
- **Entity**: el mapeo 1:1 con la tabla. No contiene lógica, son getters/setters.

Con esa grilla en la cabeza, cada diagrama de acá abajo es básicamente "quién le pasa la pelota a quién, y qué decisión toma en el camino".

---

## 1. Alta de un Relé

**Dispara**: `POST /api/reles` → `ReleController.guardar` → `ReleService.guardar` (`ReleService.java`, líneas 138-355).

Es el flujo fundacional del sistema: no solo crea el registro `Rele`, sino que le da su primer estado y posición (recordá la regla de oro: **un relé sin movimientos es un estado inconsistente**).

```mermaid
sequenceDiagram
    participant FE as Frontend (ReleForm)
    participant RC as ReleController
    participant RS as ReleService
    participant MR as ModeloRepository
    participant RmR as RemitoRepository
    participant OpR as OrdenProvisionRepository
    participant RlR as ReleRepository
    participant ER as EstadoRepository
    participant TER as TransicionEstadoRepository
    participant PR as PosicionRepository
    participant CUP as CurrentUserProvider
    participant MvR as MovimientoRepository

    FE->>RC: POST /api/reles (ReleRequestDTO)
    RC->>RS: guardar(dto)
    RS->>MR: findById(modeloId)
    MR-->>RS: Modelo (o vacio -> BusinessException)
    opt viene remitoId
        RS->>RmR: findById(remitoId)
    end
    opt viene ordenProvisionId
        RS->>OpR: findById(ordenProvisionId)
    end
    RS->>RlR: existsByNumeroSerie(numeroSerie)
    RlR-->>RS: false (si true -> BusinessException "Ya existe...")
    RS->>RS: normaliza numeroSerie/codigoConfiguracion (upper+trim)
    RS->>RS: calcula finGarantia si cargarGarantia=true
    RS->>RlR: save(rele)
    RlR-->>RS: releGuardado (con id)
    RS->>ER: resolverEstadoInicial() -> findByNombreIgnoreCase("EN_STOCK") (o el que venga en el DTO)
    RS->>TER: valida que el estado inicial tenga transiciones salientes
    RS->>PR: findById(posicionInicialId)
    RS->>CUP: obtenerUsuarioActual()
    RS->>MvR: save(Movimiento{estado=EN_STOCK, posicion, usuario, notas="Ingreso inicial del rele"})
    MvR-->>RS: movimientoGuardado
    RS-->>RC: ReleResponseDTO (mapToResponseDTO)
    RC-->>FE: 201 Created
```

**Puntos clave para entender el "por qué"**:
- El orden de validaciones importa: primero se valida que las referencias (Modelo, Remito, OrdenProvision) existan, **después** se valida el número de serie duplicado. Si cualquiera falla, no se llega a tocar la base con un `save`.
- El `Movimiento` inicial **no lo pide el usuario explícitamente como "movimiento"** — el `ReleForm` del frontend solo pide una posición inicial, y el Service arma el movimiento completo por su cuenta. Por eso, si mañana agregás un campo al alta de relé, probablemente no toca `MovimientoService` para nada — todo pasa dentro de `ReleService.guardar`.
- `CurrentUserProvider.obtenerUsuarioActual()` es el mecanismo que reemplazó al viejo hardcode de "usuario sistema (id=1)" — cualquier Service que necesite "quién hizo esto" pasa por ahí.

---

## 2. Movimiento operativo (mover un relé de estado/posición)

**Dispara**: `POST /api/movimientos` → `MovimientoController.guardar` → `MovimientoService.guardar` (`MovimientoService.java`, líneas 90-220).

Este es el corazón de la trazabilidad: acá se valida la máquina de estados (ver `docs/maquina-estados.md` para el detalle de qué transiciones existen).

```mermaid
sequenceDiagram
    participant FE as Frontend (MovimientoForm)
    participant MC as MovimientoController
    participant MS as MovimientoService
    participant RlR as ReleRepository
    participant ER as EstadoRepository
    participant PR as PosicionRepository
    participant CUP as CurrentUserProvider
    participant MvR as MovimientoRepository
    participant TER as TransicionEstadoRepository
    participant RBS as ReleBajaService

    FE->>MC: POST /api/movimientos (MovimientoRequestDTO)
    MC->>MS: guardar(dto)
    MS->>RlR: findById(releId)
    RlR-->>MS: Rele (si activo=false -> BusinessException)
    MS->>ER: findById(estadoId destino)
    MS->>PR: findById(posicionId)
    MS->>CUP: obtenerUsuarioActual()
    MS->>MvR: findTopByReleIdOrderByFechaMovimientoDescIdDesc(releId)
    MvR-->>MS: ultimoMovimiento (Optional)
    alt existe ultimoMovimiento
        MS->>TER: existsByEstadoOrigenIdAndEstadoDestinoId(estadoActual, estadoDestino)
        TER-->>MS: true (si false -> BusinessException "Transicion no permitida")
    else no tiene historial
        Note over MS: no valida transicion (caso raro, deberia\nsiempre tener el movimiento inicial del alta)
    end
    MS->>MvR: save(nuevoMovimiento)
    alt estadoDestino == "BAJA"
        MS->>RBS: aplicarBaja(rele, notas)
        RBS-->>MS: rele con activo=false, fechaBaja, motivoBaja seteados (sin persistir)
        MS->>RlR: save(rele)
    end
    MS-->>MC: MovimientoResponseDTO
    MC-->>FE: 200/201
```

**Punto clave**: `ReleBajaService.aplicarBaja` **no persiste nada por sí solo** — solo setea los tres campos en el objeto `Rele` en memoria. Quien lo llama (acá `MovimientoService`) es responsable del `save`. Esto es fácil de olvidar si escribís un tercer camino de baja en el futuro: si llamás a `aplicarBaja` y no hacés `releRepository.save(rele)` después, el cambio se pierde silenciosamente (no hay excepción, simplemente no se persiste — Hibernate no tiene dirty-checking automático fuera de una transacción activa con el objeto ya adjunto).

---

## 3. Baja de un Relé — los dos caminos (y por qué están duplicados)

Acá es donde vale la pena entender bien la arquitectura, porque **hay dos caminos que llegan al mismo resultado por rutas de código distintas**, y es el ejemplo más claro de "duplicación de lógica entre dos Services" que tiene el proyecto hoy.

```mermaid
flowchart TD
    Start([Quiero dar de baja un rele]) --> Choice{Como?}

    Choice -->|"Camino A: formulario de Movimiento,\neligiendo estado = BAJA"| A1[POST /api/movimientos]
    A1 --> A2[MovimientoService.guardar]
    A2 --> A3["valida rele activo, valida transicion\nestadoActual -> BAJA contra TransicionEstadoRepository"]
    A3 --> A4[crea y guarda el Movimiento con estado BAJA]
    A4 --> A5["releBajaService.aplicarBaja(rele, notas)"]
    A5 --> A6[releRepository.save]

    Choice -->|"Camino B: boton dedicado\n'Dar de baja' en ReleTable"| B1["PATCH /api/reles/{id}/baja"]
    B1 --> B2[ReleService.darDeBaja]
    B2 --> B3["valida rele activo Y que tenga\nhistorial previo (findTop...OrderBy...)"]
    B3 --> B4["valida transicion estadoActual -> BAJA\n(mismo TransicionEstadoRepository)"]
    B4 --> B5["crea y guarda el Movimiento con estado BAJA\n(a mano, no reusa MovimientoService)"]
    B5 --> B6["releBajaService.aplicarBaja(rele, motivo)"]
    B6 --> B7[releRepository.save]

    A6 --> Fin([Rele.activo = false,\nfechaBaja, motivoBaja seteados])
    B7 --> Fin
```

**Diferencias reales entre A y B** (no cosméticas):
| | Camino A (`MovimientoService.guardar`) | Camino B (`ReleService.darDeBaja`) |
|---|---|---|
| Endpoint | `POST /api/movimientos` | `PATCH /api/reles/{id}/baja` |
| DTO de entrada | `MovimientoRequestDTO` (estadoId, posicionId, notas) | `BajaReleRequestDTO` (solo `motivo`) |
| Exige historial previo | No lo chequea explícitamente (asume que siempre hay al menos el movimiento de alta) | Sí, explícito: si no hay ningún movimiento, error |
| Posición del movimiento de baja | La que elija el usuario en el form | Siempre la misma que el último movimiento (no se puede cambiar posición al dar de baja por acá) |
| Motivo/notas | `dto.getNotas()` | `dto.getMotivo()` |

`ReleBajaService.aplicarBaja` en sí es trivial (3 líneas: `activo=false`, `fechaBaja=now()`, `motivoBaja=motivo`) y es el único pedazo de código realmente compartido entre los dos caminos. Todo lo demás — la búsqueda del relé, la validación de transición, la creación del `Movimiento` — está escrito dos veces. **Si algún día cambiás una regla de la baja (por ejemplo, qué se valida antes de permitirla), tenés que tocar los dos lugares** o vas a dejarlos inconsistentes (está anotado como recordatorio en `CLAUDE.md`, sección "Buenas prácticas").

---

## 4. Estados permitidos (lo que arma el selector del frontend)

**Dispara**: `GET /api/reles/{id}/estados-permitidos` → `EstadoService.obtenerEstadosPermitidos` (`EstadoService.java`, líneas 116-171).

Este endpoint no cambia nada — es de solo lectura — pero es la pieza que hace que el usuario, en el formulario de Movimiento, solo vea como opciones los estados a los que realmente puede pasar el relé (aunque la validación **real y autoritativa** sigue viviendo en `MovimientoService.guardar`, como viste arriba: esto es solo UX, no seguridad).

```mermaid
sequenceDiagram
    participant FE as Frontend (MovimientoForm)
    participant EC as EstadoController
    participant ES as EstadoService
    participant RlR as ReleRepository
    participant MvR as MovimientoRepository
    participant TER as TransicionEstadoRepository

    FE->>EC: GET /api/reles/{id}/estados-permitidos
    EC->>ES: obtenerEstadosPermitidos(releId)
    ES->>RlR: findById(releId)
    ES->>MvR: findTopByReleIdOrderByFechaMovimientoDescIdDesc(releId)
    alt no hay ultimo movimiento
        ES->>ES: obtenerTodos() (fallback, caso anormal)
    else hay ultimo movimiento
        ES->>TER: findByEstadoOrigenId(estadoActual.id)
        TER-->>ES: lista de TransicionEstado
        ES->>ES: mapea cada estadoDestino a EstadoResponseDTO
    end
    ES-->>EC: List<EstadoResponseDTO>
    EC-->>FE: 200 OK
```

---

## 5. Resumen ejecutivo del Dashboard (IA)

**Dispara**: `GET /api/dashboard/resumen-ia?forzar=false` → `DashboardService.obtenerResumenIA` (`DashboardService.java`, líneas 261-337). El frontend (`HomePage.tsx`) lo pide solo al montar el dashboard, sin forzar — el cache de 4 horas hace que la mayoría de esos pedidos no le peguen a Gemini.

Este módulo es interesante porque mete dos conceptos que no aparecen en los flujos de arriba: **cache en memoria con TTL** y **sincronización explícita** para no pagar de más una API externa.

```mermaid
sequenceDiagram
    participant FE as Frontend (HomePage)
    participant DC as DashboardController
    participant DS as DashboardService
    participant LLM as LLMService (GeminiService)
    participant Repos as ReleRepository / MovimientoRepository / etc.

    FE->>DC: GET /api/dashboard/resumen-ia
    DC->>DS: obtenerResumenIA(forzar=false)
    DS->>LLM: estaDisponible()
    alt no disponible (sin GEMINI_API_KEY)
        LLM-->>DS: false
        DS-->>DC: ResumenIADTO(resumen=null)
    else disponible
        Note over DS: entra a synchronized(resumenIALock)
        DS->>DS: calcula cacheVigente = !forzar AND cache!=null AND (now - cacheadoEn) < 4h
        alt cache vigente
            DS-->>DC: ResumenIADTO(cacheado, generadoEn=cacheadoEn)
        else cache vencido o forzado
            DS->>Repos: obtenerKpis(), obtenerRelesPor{Estado,Marca,Destino,Proveedor}()
            DS->>DS: construirPromptResumen(kpis + top5 de cada distribucion)
            DS->>LLM: generarTexto(PROMPT_SISTEMA, prompt, maxOutputTokens=600)
            alt Gemini responde OK
                LLM-->>DS: texto (encabezado + 3-5 vinetas)
                DS->>DS: actualiza cache (resumenIACacheado, resumenIACacheadoEn=now)
                DS-->>DC: ResumenIADTO(texto, generadoEn=now)
            else Gemini falla (timeout, 429 en todas las claves, etc.)
                LLM-->>DS: excepcion
                DS->>DS: log.warn(...)
                DS-->>DC: ResumenIADTO(resumen=null)
            end
        end
    end
    DC-->>FE: 200 OK (nunca rompe aunque la IA falle)
```

**Por qué el `synchronized`**: si dos personas abren el dashboard al mismo tiempo justo cuando el cache venció, sin el lock las dos dispararían un llamado a Gemini en paralelo (gastando el doble de cuota gratuita para el mismo resultado). Con el lock, la segunda espera a que la primera termine y reusa el cache que la primera acaba de dejar. Es el mismo patrón que conviene usar para **cualquier integración externa cacheable** que agregues a futuro (ver la guía en `CLAUDE.md`, sección "Buenas prácticas").

---

## 6. Carga inteligente de relés por Remito (IA multimodal)

**Dispara**: `POST /api/remitos/analizar` (multipart, PDF o foto) → `RemitoIAService.analizar` (`RemitoIAService.java`, línea 223). Disparado desde `CargaInteligenteRemitoDialog.tsx` dentro de `ReleForm.tsx`.

Esto es lo más elaborado del sistema en cuanto a lógica de Service, así que vale la pena separarlo en dos partes: (a) lo que le pide al modelo de IA, y (b) lo que valida localmente con el resultado — **la IA nunca decide sola, siempre hay una segunda pasada de validación en Java contra la base real**.

```mermaid
sequenceDiagram
    participant FE as Frontend (CargaInteligenteRemitoDialog)
    participant RC as RemitoController
    participant RIS as RemitoIAService
    participant Gem as GeminiService
    participant MaR as MarcaRepository
    participant MoR as ModeloRepository
    participant PvR as ProveedorRepository
    participant RlR as ReleRepository

    FE->>RC: POST /api/remitos/analizar (archivo)
    RC->>RIS: analizar(archivo)
    RIS->>RIS: valida no vacio + contentType aceptado (pdf/png/jpeg/webp)
    RIS->>Gem: estaDisponible()
    Gem-->>RIS: true (si no, BusinessException)
    RIS->>Gem: generarTextoConArchivo(PROMPT_SISTEMA, bytes, contentType, maxTokens=4096)
    Gem-->>RIS: texto JSON (lista de reles extraidos, a veces envuelto en bloque de codigo)
    RIS->>RIS: parsearJson() (limpia fences, valida estructura)
    RIS->>RIS: mapearDatos() -> RemitoDatosExtraidosDTO

    Note over RIS: --- segunda pasada: validacion 100% local ---
    RIS->>RIS: fill-forward de marca/modelo/codigo vacios\n(usando el ultimo valor no-null visto)
    loop por cada rele extraido
        RIS->>RlR: findFirstByCodigoConfiguracionIgnoreCase (si hay codigo)
        RIS->>MaR: findByNombreIgnoreCase(marca)
        RIS->>MoR: findByMarcaId / findAllByOrderByNombreAsc
        alt no matchea exacto
            RIS->>RIS: buscarModeloConTolerancia (distancia de Levenshtein,\ntolerante a errores de OCR)
        end
        RIS->>RIS: si parece accesorio (RTXP, zocalo, test block...) -> descarta, no error
        RIS->>RlR: existsByNumeroSerie(serie)
        RIS->>RIS: clasifica: serie repetida en documento / serie existente / disponible
    end
    RIS->>PvR: findByNombreIgnoreCase(proveedor)
    RIS-->>RC: RemitoAnalisisResponseDTO (propuesta, nada persistido)
    RC-->>FE: 200 OK
    Note over FE: el usuario revisa/corrige la propuesta\ny recien ahi cada rele se da de alta\nvia el flujo normal POST /api/reles
```

**El detalle que importa**: mirá que en todo `RemitoIAService` no hay un solo `.save(...)`. Todos los repositorios se usan solo para **leer y contrastar** lo que dijo la IA contra la base real (¿existe esa marca?, ¿existe ya esa serie?, ¿el modelo se parece a uno que ya tenemos aunque el OCR lo haya deformado?). El alta de verdad la hace `ReleService.guardar` — el mismo método del punto 1 — cuando el usuario confirma. Esto es intencional: la IA propone, el flujo normal (con todas sus validaciones ya vistas) es el único que efectivamente escribe.

---

## 7. Copiloto IA del Dashboard

**Dispara**: `POST /api/copiloto/consultar` → `CopilotoIAService.consultar` (`CopilotoIAService.java`, línea 145). Componente frontend: `CopilotoIACard.tsx`.

La particularidad acá es que la respuesta del modelo puede significar dos cosas distintas para el frontend, y el Service es el que decide cuál — **nunca deja pasar una acción que no esté en una whitelist fija**.

```mermaid
sequenceDiagram
    participant FE as Frontend (CopilotoIACard)
    participant CC as CopilotoController
    participant CIS as CopilotoIAService
    participant DS as DashboardService
    participant LLM as LLMService (GeminiService)

    FE->>CC: POST /api/copiloto/consultar {mensaje}
    CC->>CIS: consultar(dto)
    CIS->>LLM: estaDisponible()
    LLM-->>CIS: true (si no, BusinessException)
    CIS->>DS: obtenerKpis(), obtenerRelesPor{Estado,Marca,Modelo,Destino,Proveedor}(),\nobtenerUltimosMovimientos(hoy) + obtenerUltimosMovimientos(ultimos 20)
    DS-->>CIS: contexto (KPIs + distribuciones completas + movimientos recientes)
    CIS->>LLM: generarTexto(PROMPT_SISTEMA, contexto + mensaje del usuario, maxTokens=700)
    LLM-->>CIS: texto (posible JSON de accion, o texto libre/markdown)
    CIS->>CIS: quitarBloqueCodigo() + intenta parsear como JSON
    alt es JSON con "accion" valida
        CIS->>CIS: validarYMapearAccion() contra whitelist\n(FILTRAR_RELES / ABRIR_RELE / IR_A_MODULO)
        CIS-->>CC: CopilotoConsultaResponseDTO(tipo="ACCION", accion=...)
    else JSON con accion desconocida o campos faltantes
        CIS-->>CC: tipo="RESPUESTA" (pide reformular)
    else no es JSON
        CIS-->>CC: tipo="RESPUESTA" (texto/markdown tal cual)
    end
    CC-->>FE: 200 OK
    Note over FE: si tipo=ACCION, el frontend navega/filtra;\nsi tipo=RESPUESTA, se renderiza como markdown
```

**Por qué la whitelist importa tanto acá**: el Copiloto es el único módulo del sistema donde una respuesta de un LLM (que en principio podría "alucinar" cualquier cosa) tiene el poder de mover al usuario por la aplicación. La whitelist (`ACCIONES_VALIDAS` y `MODULOS_VALIDOS`, constantes dentro de `CopilotoIAService`) es la barrera que garantiza que, pase lo que pase en la respuesta del modelo, lo único que puede pasar en el frontend es una navegación/filtro predefinido — nunca, por ejemplo, un borrado o un cambio de estado. Esa restricción está en el Service, no en el Controller ni en el frontend, así que aunque el frontend tuviera un bug, el backend jamás devolvería una acción fuera de esas tres.

---

## 8. Tabla resumen — "¿quién hizo esa validación?"

Para consulta rápida cuando estés leyendo un flujo y no te acuerdes en qué capa buscar:

| Pregunta | Vive en |
|---|---|
| ¿Existe el Modelo/Remito/OrdenProvision referenciado? | Service (`ReleService.guardar`) |
| ¿El número de serie ya existe? | Service (`ReleService.guardar`, vía `ReleRepository.existsByNumeroSerie`) |
| ¿La transición de estado A→B está permitida? | Service, contra `TransicionEstadoRepository` (nunca hardcodeado) |
| ¿Cuál es el estado/posición "actual" de un relé? | Derivado en el Service, buscando el último `Movimiento` (`findTopBy...OrderByFechaMovimientoDescIdDesc`) — nunca un campo propio de `Rele` |
| ¿Quién es el usuario que hizo la acción? | `CurrentUserProvider.obtenerUsuarioActual()`, inyectado en el Service |
| ¿Se puede loguear con este email/rol? | `SecurityConfig` + `JwtAuthenticationFilter` (antes de llegar al Controller) — ver `docs/autenticacion.md` |
| ¿El archivo adjunto es realmente un PDF/foto válida? | `ArchivoAdjuntoValidator`, invocado desde el Service (`RemitoService`/`OrdenProvisionService`) |
| ¿Vale la pena llamar a Gemini de nuevo o uso el cache? | Service (`DashboardService`, con lock) |
| ¿Esta acción del Copiloto es segura de ejecutar? | Service (`CopilotoIAService`, contra whitelist fija) |

La regla que resume todo el documento: **si estás buscando una decisión de negocio, mirá siempre el Service — el Controller nunca decide nada, y el Repository nunca sabe nada de reglas, solo de consultas.**
