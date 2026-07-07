# CLAUDE.md — Protecciones Trazabilidad (EPEC)

Documento de referencia arquitectónica para futuras conversaciones sobre este proyecto. Léelo completo antes de proponer o escribir código. Refleja el estado real del código al momento del análisis (no es un documento de diseño aspiracional).

---

# Objetivo del sistema

Sistema web interno para **EPEC Transmisión** (Departamento de Teleoperaciones y Protecciones) que digitaliza la **trazabilidad e inventario de relés de protección** usados en estaciones transformadoras. Reemplaza un proceso manual que antes se llevaba en Microsoft Access.

Lo que el sistema necesita resolver:

- Saber **qué relé físico** (identificado por número de serie único) existe, en qué **estado operativo** está y en qué **posición/destino físico** se encuentra, en todo momento.
- Mantener un **historial inmutable** de todos los movimientos operativos que sufrió cada relé (auditoría).
- Controlar que los cambios de estado sigan un **flujo operativo válido** (máquina de estados), no cualquier transición arbitraria.
- Vincular cada relé con su documentación logística de origen: **remito** (proveedor) y/o **orden de provisión**, y llevar el control de garantía.
- Dar de baja relés preservando su historial (soft delete), nunca borrando datos operativos.
- Ofrecer un dashboard con KPIs operativos (stock, instalados, en reparación, garantías vencidas, documentación pendiente, etc.).

Concepto de dominio clave (ver README del proyecto):

```
Modelo = tipo técnico de relé (catálogo)
Número de serie = unidad física real (inventario)
```

Un Modelo puede tener muchos Relés asociados. La trazabilidad y la operación siempre se hacen sobre la unidad física (el Relé), nunca sobre el Modelo.

---

# Arquitectura

Arquitectura desacoplada de 3 capas físicas, comunicadas por HTTP/REST:

```
React (SPA, puerto 5173, Vite)
   │  Axios → HTTP/JSON
   ▼
Spring Boot REST API (puerto 8080, prefijo /api)
   Controller → Service → Repository → Hibernate
   ▼
PostgreSQL (Docker, puerto host configurable, contenedor "protecciones-db")
```

- El frontend **no accede nunca directamente a la base de datos**; solo consume la API REST vía el cliente Axios centralizado (`frontend/src/api/axios.ts`).
- El backend expone DTOs, nunca entidades JPA, en sus respuestas.
- CORS permite cualquier puerto de `http://localhost` y `http://127.0.0.1` (`allowedOriginPatterns` + `allowCredentials(true)` en `CorsConfig.java`), para que funcione tanto `npm run dev` (5173) como el build dockerizado (5173 vía Nginx) sin tener que hardcodear un puerto.
- El esquema de base de datos es propiedad exclusiva de **Flyway**: Hibernate corre en modo `validate` (`spring.jpa.hibernate.ddl-auto=validate`), es decir, **Hibernate no puede crear ni modificar tablas**, solo valida que las entidades coincidan con el esquema ya migrado.
- Autenticación con **JWT stateless** (`Authorization: Bearer <token>`, sin cookies ni sesión de servidor). Login por email o número de sobre (legajo) en `POST /api/auth/login`. Autorización centralizada en `SecurityConfig` (no `@PreAuthorize` disperso): cualquier `GET /api/**` requiere estar autenticado (rol `ADMIN`, `OPERADOR` o `AUDITOR`); escritura en `/api/usuarios/**` requiere rol `ADMIN`; escritura en el resto requiere `ADMIN` u `OPERADOR`; `PUT /api/auth/password` (autogestión de la propia contraseña) solo requiere estar autenticado, sin importar el rol. Las operaciones que antes usaban el usuario "sistema" hardcodeado (`id = 1`) ahora resuelven el usuario autenticado vía `CurrentUserProvider.obtenerUsuarioActual()`. Detalle completo, diagramas de flujo y credencial de bootstrap en `docs/autenticacion.md`.
- Documentación de API autogenerada con springdoc-openapi (Swagger UI en `/swagger-ui/index.html`).
- El dashboard incluye un **resumen ejecutivo generado por IA** (`GET /api/dashboard/resumen-ia`): `DashboardService` arma un prompt en texto plano con los KPIs generales y las distribuciones (estado, marca, destino, proveedor) y se lo pasa a `GeminiService`, que llama a la **Gemini API** (Google AI Studio, capa gratuita — elegida por eso, dado el volumen bajo de uso esperado) vía `RestClient`, pidiendo la respuesta en un formato fijo (encabezado + 3-5 viñetas) que el frontend parsea para mostrarlo con estructura visual. Es una funcionalidad **opcional y degradable**: si no hay `GEMINI_API_KEY` configurada o la llamada falla (timeout, 429, etc.), el endpoint devuelve `resumen: null` y el frontend directamente oculta el panel — nunca bloquea ni rompe el resto del dashboard. El resultado se cachea en memoria (30 minutos, o hasta que cambie algún KPI/distribución) para no pegarle a la API externa en cada carga de página. Importante: Gemini 2.5 Flash tiene "thinking" (razonamiento interno) activado por defecto, que puede consumir casi todo `maxOutputTokens` y truncar la respuesta (`finishReason: MAX_TOKENS`) — por eso `GeminiService` fuerza `generationConfig.thinkingConfig.thinkingBudget: 0` en cada request.

---

# Stack tecnológico

## Backend
- **Java 21** — lenguaje del backend.
- **Spring Boot 4.0.6** — framework principal (starters: data-jpa, webmvc, validation, flyway, devtools).
- **Spring Data JPA / Hibernate** — ORM y acceso a datos, mapeo entidad↔tabla.
- **Bean Validation (`jakarta.validation`)** — validación declarativa de DTOs de entrada (`@Valid`).
- **PostgreSQL** (driver `org.postgresql`) — base de datos relacional.
- **Flyway** (`flyway-database-postgresql`) — versionado y migración incremental del esquema SQL.
- **Maven** (`mvnw`) — build y gestión de dependencias.
- **springdoc-openapi (Swagger UI)** — documentación interactiva de la API.
- **Apache POI (`poi-ooxml`)** — generación de archivos Excel (export de movimientos).
- **Lombok** — disponible como dependencia, pero **no se usa** en las entidades/DTOs revisadas (todas escriben getters/setters/constructores a mano). No asumir que Lombok está activo en el código existente.

## Frontend
- **React 19** + **TypeScript** — SPA.
- **Vite** — bundler y dev server.
- **Material UI (MUI v9)** + `@emotion` — sistema de componentes visuales y theming.
- **Axios** — cliente HTTP hacia la API.
- **React Router DOM v7** — ruteo de páginas (`BrowserRouter`).
- **Recharts v3.x** — gráficos del dashboard. **Importante:** debe mantenerse en v3.x, no bajar a v2.x. Recharts 2.15.4 (la versión con la que arrancó el proyecto) tiene un bug de compatibilidad con **React 19**: en un `BarChart` con `layout="vertical"` solo renderiza la barra y la geometría del primer ítem del array — el resto queda como `<g>` vacíos y el eje de categorías (`YAxis type="category"`) no se dibuja, sin ningún error en consola. Se detectó al arreglar los gráficos de "Distribución por Marca/Modelo/Destino/Proveedor" del dashboard.
- ESLint + `typescript-eslint` — linting.

## Infraestructura
- **Docker / Docker Compose** (`docker/docker-compose.yml`) — levanta los tres componentes: PostgreSQL (`postgres:16`), backend y frontend, cada uno en su propio contenedor sobre la red que Compose arma automáticamente (los servicios se resuelven entre sí por nombre; el backend usa `postgres:5432` como host de base de datos, no `localhost`).
  - `backend/Dockerfile`: build multi-stage (etapa `maven:3.9-eclipse-temurin-21` compila el jar, etapa `eclipse-temurin:21-jre-jammy` lo ejecuta). Expone 8080. La carpeta `uploads/` (PDFs de Remito/OrdenProvision, rutas relativas) se monta como volumen nombrado (`uploads_data`) para no perder archivos al recrear el contenedor.
  - `frontend/Dockerfile`: build multi-stage (`node:22-alpine` corre `npm run build:docker`, que compila con `vite build --mode docker` usando `frontend/.env.docker` en vez de `frontend/.env.production`, que queda reservado para un deploy real futuro; `nginx:1.27-alpine` sirve el `dist/` resultante con `frontend/nginx.conf`, que agrega el fallback SPA `try_files ... /index.html` que necesita React Router).
  - El frontend dockerizado se expone en el mismo puerto que `npm run dev` (`5173:80`), así no hace falta tocar `CorsConfig.java` (sigue restringido a `http://localhost:5173`) para que funcione en ambos entornos.
  - `docker compose up -d --build` levanta todo. También sigue soportado levantar solo Postgres (`docker compose up -d postgres`) para desarrollar backend/frontend localmente con hot reload, como antes de dockerizar.
- Variables de entorno para DB: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT` (compose) y `DB_URL`/`DB_USER`/`DB_PASSWORD`/`SERVER_PORT`/`DDL_AUTO`/`TIMEZONE`/`JPA_SHOW_SQL` (Spring, con defaults en `application.properties`). Dentro de la red de Docker Compose, `DB_URL` del backend apunta a `postgres:5432` (puerto interno del contenedor), no al `DB_PORT` expuesto al host (5433).
- `GEMINI_API_KEY` / `GEMINI_MODEL` (default `gemini-2.5-flash`, ambas opcionales) — clave de la Gemini API para el resumen ejecutivo del dashboard (ver sección Arquitectura). Sin `GEMINI_API_KEY`, el feature simplemente no se ofrece; no hace falta para levantar el resto del sistema. Se cargan desde `docker/.env` (gitignored) y se pasan al contenedor del backend en `docker-compose.yml`.

---

# Organización del proyecto

## Backend (`backend/src/main/java/protecciones/`)

```
protecciones/
├── ProteccionesApplication.java     # entry point Spring Boot
├── config/                          # configuración transversal
│   ├── CorsConfig.java              # política CORS
│   ├── SecurityConfig.java          # filter chain, reglas de autorización por rol, handlers 401/403
│   └── OpenApiConfig.java           # metadata de Swagger
├── security/                        # JwtService, JwtAuthenticationFilter, UserDetailsServiceImpl, CurrentUserProvider
├── controller/                      # capa HTTP (@RestController), un archivo por recurso (incluye AuthController)
├── service/                         # lógica de negocio (@Service), un archivo por recurso (incluye AuthService)
├── repository/                      # interfaces Spring Data JPA (@Repository implícito)
├── entity/                          # clases @Entity mapeadas 1:1 a tablas
├── dto/                             # *RequestDTO (entrada) y *ResponseDTO (salida)
│   ├── auth/                        # LoginRequestDTO, LoginResponseDTO
│   └── dashboard/                   # DTOs específicos del dashboard
└── exception/                       # BusinessException, ErrorResponse, GlobalExceptionHandler
```

Migraciones SQL versionadas en `backend/src/main/resources/db/migration/V{n}__descripcion.sql` (Flyway). Al momento de este análisis van de V1 a V27 (la V27 agrega autenticación a `usuario` — ver `docs/autenticacion.md`).

## Frontend (`frontend/src/`)

```
src/
├── api/axios.ts             # instancia única de Axios (baseURL configurable por env, interceptores de auth)
├── context/AuthContext.tsx  # sesión (token/usuario), login()/logout(), isAdmin
├── utils/authStorage.ts     # persistencia de token/usuario en localStorage (sin dependencias de React)
├── services/                # una función por endpoint, agrupadas por recurso (*Service.ts)
├── types/                   # interfaces TS: entidad (Rele.ts) y su *Request (ReleRequest.ts)
├── components/
│   ├── admin/<recurso>/     # Form + Table por cada catálogo administrable (incluye admin/usuario/)
│   ├── movimiento/          # MovimientoForm, MovimientoTable
│   ├── rele/                # ReleForm, ReleTable
│   └── common/              # componentes genéricos reutilizables (EmptyState, PageHeader)
├── pages/                   # una página por ruta; admin/ agrupa las páginas de catálogos; LoginPage.tsx
├── layouts/MainLayout.tsx   # layout con AppBar/navegación + <Outlet/>
├── routes/                  # AppRouter.tsx (rutas) + ProtectedRoute.tsx (guard de sesión)
└── theme/theme.ts           # theme de Material UI
```

---

# Modelo de datos

## Catálogos base (sin dependencias, o dependencias mínimas)
- **Marca** — fabricante.
- **Estado** — estado operativo posible (`nombre`, `descripcion`).
- **Provincia** → **Localidad** (N:1) — jerarquía geográfica.
- **Proveedor** — proveedor logístico.

## Dominio principal
- **Modelo** (`marca_id`) — catálogo técnico: nombre y marca. (Hasta la migración V25 tenía también `tipo_id` y un rango de tensión propios — se eliminaron por decisión de negocio; no reintroducir estos campos sin una migración Flyway explícita).
- **Rele** (`modelo_id`, `remito_id?`, `orden_provision_id?`) — la unidad física. Campos clave:
  - `numeroSerie` (único, obligatorio, se normaliza a MAYÚSCULAS + trim al guardar).
  - `codigoConfiguracion` (opcional, normalizado a MAYÚSCULAS + trim).
  - `garantiaMeses`, `inicioGarantia`, `finGarantia` (fin = inicio + meses, calculado en el service).
  - `activo` (soft delete), `motivoBaja`, `fechaBaja`.
  - `tipoIngreso` (`"NUEVO" | "USADO"` en el frontend).
- **Movimiento** (`rele_id`, `estado_id`, `posicion_id`, `usuario_id`) — evento histórico e **inmutable** (nunca se actualiza ni se borra, solo se inserta). Es la fuente de verdad de:
  - el estado actual del relé (= estado del último movimiento por fecha/id),
  - la posición/destino actual del relé (= posición del último movimiento).
- **Estado** — catálogo de estados operativos posibles.
- **TransicionEstado** (`estado_origen_id`, `estado_destino_id`) — define qué transiciones de estado están **permitidas**; es la máquina de estados del sistema.

## Ubicación física
- **Destino** (`localidad_id`) — estación transformadora, laboratorio, depósito, etc.
- **Posicion** (`destino_id`) — ubicación puntual dentro de un Destino (p. ej. un banco de ensayo o un tablero).

## Logística / documentación
- **Remito** (`proveedor_id`) — comprobante de entrega; puede tener PDF adjunto (`nombreArchivo`, `rutaArchivo`) y flag `asociado`.
- **OrdenProvision** — orden de compra/provisión; también admite PDF adjunto y flag `asociado`.

## Usuarios
- **Usuario** — nombre, apellido, email, `numeroSobre` (legajo interno, `NOT NULL UNIQUE` como `Rele.numeroSerie`, alternativa de login al email), `passwordHash` (BCrypt, `NULL` para cuentas que no pueden loguearse), `rol` (`"ADMIN"` \| `"OPERADOR"` \| `"AUDITOR"`, string plano validado en `UsuarioService` + `CHECK` en BD, sin enum Java), `activo` (permite deshabilitar el login sin romper el historial de movimientos, mismo patrón de soft-delete que `Rele.activo`). Es también el registro de "responsable" de cada `Movimiento`. El id 1 (`sistema@local`) es una cuenta histórica sin `passwordHash` — no puede loguearse y ya no se usa como default de ninguna operación nueva (ver `docs/autenticacion.md`).

## Relaciones (resumen)
```
Marca ──< Modelo >─┐
                    ├─< Rele >─┐
                    │          ├─< Movimiento >── Estado
             Remito ┘          │        │
    OrdenProvision ────────────┘        └── Posicion ── Destino ── Localidad ── Provincia
                                                                        Usuario ─< Movimiento
Estado ──< TransicionEstado >── Estado   (auto-relación: define transiciones válidas)
Proveedor ──< Remito
```

---

# Flujo de negocio

## 1. Alta de un relé (`ReleService.guardar`)
1. Se valida que exista el `Modelo` referenciado.
2. Se resuelven opcionalmente `Remito` y/o `OrdenProvision` si vienen en el DTO.
3. Se valida que **no exista otro relé con el mismo `numeroSerie`** (`existsByNumeroSerie`) → si existe, `BusinessException`.
4. Se normalizan `numeroSerie` (mayúsculas/trim) y `codigoConfiguracion`.
5. Si `cargarGarantia = true`, se calculan `inicioGarantia` (hoy si no se especifica) y `finGarantia` (inicio + `garantiaMeses`); si no, los tres campos de garantía quedan en `null`.
6. Se guarda el `Rele` con `activo = true`.
7. **Se crea automáticamente el primer `Movimiento`**: estado `"EN STOCK"`, posición = `posicionInicialId` del DTO, usuario = sistema (id 1), nota fija `"Ingreso inicial del relé"`. Este movimiento inicial es lo que le da al relé su estado/posición "actual" desde el primer instante — **un relé sin movimientos es un estado inconsistente** que otros métodos (`obtenerEstadoActual`) tratan como error de negocio.

## 2. Movimiento operativo (`MovimientoService.guardar`)
1. Se valida que el relé exista y esté **activo** (no se puede mover un relé dado de baja).
2. Se busca el **último movimiento** del relé (por fecha desc, luego id desc — desempate determinístico).
3. Si existe un movimiento previo, se valida la transición `estadoActual → estadoDestino` contra la tabla `TransicionEstado` (`existsByEstadoOrigenIdAndEstadoDestinoId`). Si no está permitida → `BusinessException`.
4. Se inserta el nuevo `Movimiento` (nunca se modifica uno anterior).
5. **Caso especial**: si el estado destino es `"BAJA"`, se dispara automáticamente `ReleBajaService.aplicarBaja()` sobre el relé (ver punto 4).

## 3. Cambio de estado / consulta de estados permitidos (`EstadoService`)
- `obtenerEstadosPermitidos(releId)` calcula, a partir del estado del último movimiento, cuáles son los próximos estados válidos según `TransicionEstado`. Si el relé no tiene movimientos, devuelve todos los estados (comportamiento de fallback, no un caso normal esperado).
- El frontend usa este endpoint para poblar el selector de "nuevo estado" al registrar un movimiento, evitando que el usuario intente una transición inválida (aunque la validación real y autoritativa vive en el backend, en `MovimientoService`).

## 4. Baja de un relé — dos caminos posibles
a) **Vía transición de estado normal**: registrar un `Movimiento` con estado `"BAJA"` (`MovimientoService.guardar`), sujeto a que la transición esté permitida.
b) **Vía endpoint dedicado** `PATCH /api/reles/{id}/baja` (`ReleService.darDeBaja`):
   1. Verifica que el relé esté activo (si no, error).
   2. Exige que tenga **historial operativo previo** (si no, error — "no se puede dar de baja un relé sin historial").
   3. Valida igualmente la transición `estadoActual → BAJA` contra `TransicionEstado`.
   4. Inserta un `Movimiento` a estado BAJA con la posición del último movimiento y el motivo como nota.
   5. Llama a `ReleBajaService.aplicarBaja(rele, motivo)`.

En ambos caminos, `ReleBajaService.aplicarBaja` hace lo mismo: `activo = false`, `fechaBaja = now()`, `motivoBaja = motivo`. **Es soft delete — el registro y todo su historial de movimientos permanecen intactos** para trazabilidad/auditoría.

## 5. Historial (`obtenerHistorial`)
- Lista completa de `Movimiento` de un relé, ordenada por fecha descendente (más reciente primero), expuesta vía `GET /api/reles/{id}/movimientos`. Es de solo lectura — no hay edición ni borrado de movimientos individuales en ningún service revisado.

## Máquina de estados vigente (según la migración más reciente que la define, `V20__actualizar_transiciones_estado.sql`)

```
EN STOCK       → ENSAYO, GARANTIA_PROVEEDOR, APROBADO, RESERVA, BAJA
ENSAYO         → APROBADO, GARANTIA_PROVEEDOR, BAJA
GARANTIA_PROVEEDOR → APROBADO, BAJA
APROBADO       → EN SERVICIO, RESERVA, BAJA
RESERVA        → EN SERVICIO, BAJA
EN SERVICIO    → EN REPARACION, BAJA
EN REPARACION  → EN STOCK, BAJA
```

`EN STOCK` es el estado de entrada (el que se asigna al alta) y `BAJA` es terminal (una vez ahí, el relé queda inactivo y no admite más movimientos porque `MovimientoService.guardar` rechaza operar sobre relés inactivos).

⚠️ Nota de consistencia histórica: existen nombres de estado de migraciones anteriores (`INSTALADO`, `DISPONIBLE`, `REPARACION`, `BANCO ENSAYO`, etc.) que ya no forman parte del flujo vigente en `transicion_estado`, pero pueden seguir existiendo como filas en la tabla `estado` o referenciados en datos/movimientos históricos y en algún código no actualizado (ver sección "Cosas que nunca deben romperse"). **Antes de asumir el nombre exacto de un estado, verificar el contenido real de la tabla `estado` y las migraciones más recientes**, no solo este documento.

---

# Reglas del proyecto

Estas reglas están implícitas en el código existente y deben respetarse en todo cambio nuevo:

1. **Nunca acceder a la base de datos desde un Controller.** Los controllers solo llaman a un Service e inyectan por constructor.
2. **Toda la lógica de negocio vive en la capa Service**, no en el Controller ni en el Repository. Ejemplos: validación de duplicados, normalización de strings, cálculo de garantía, validación de transiciones de estado, aplicación de baja.
3. **Los Controllers solo coordinan request/response**: reciben DTOs (`@Valid @RequestBody`), delegan al Service, devuelven DTOs o `ResponseEntity`. No contienen `if` de negocio.
4. **Se exponen siempre DTOs, nunca entidades JPA**, tanto en request (`*RequestDTO`) como en response (`*ResponseDTO`). Los mappers `entity → DTO` viven como métodos privados dentro del Service correspondiente (p. ej. `mapToResponseDTO`, `mapMovimientoToDTO`).
5. **Todo cambio de esquema de base de datos se hace exclusivamente mediante un nuevo script Flyway** (`V{n+1}__descripcion.sql`), nunca editando una migración ya aplicada ni cambiando `ddl-auto`. Hibernate está en modo `validate`: si la entidad no coincide con el esquema, la app no arranca.
6. **Separación estricta frontend/backend**: no hay SSR ni acoplamiento de build; se comunican solo por HTTP/JSON a través de `frontend/src/api/axios.ts`.
7. **Los movimientos son inmutables**: se insertan, nunca se actualizan ni se eliminan. El "estado actual" y la "posición actual" de un relé son siempre **derivados** del último movimiento (por fecha desc, con `id` desc como desempate), nunca un campo propio de `Rele`.
8. **La baja de un relé es lógica (soft delete)**: se marca `activo = false` + `motivoBaja` + `fechaBaja`; jamás se borra el registro ni su historial.
9. **Las transiciones de estado se validan siempre contra la tabla `transicion_estado`**, nunca hardcodeadas en Java. Si se necesita permitir/prohibir una transición, es un cambio de **datos** (migración Flyway), no de código.
10. **Números de serie son únicos** y se normalizan (`trim().toUpperCase()`) antes de persistir; la unicidad se valida explícitamente en el Service antes de guardar/actualizar (no se delega solo a la constraint de BD).
11. **Hay autenticación JWT y 3 roles (`ADMIN`, `OPERADOR`, `AUDITOR`).** `ADMIN` es el único que gestiona usuarios; `OPERADOR` tiene la misma escritura operativa que `ADMIN` pero sin acceso a `/api/usuarios`; `AUDITOR` es solo lectura. El usuario autenticado se obtiene siempre vía `CurrentUserProvider.obtenerUsuarioActual()` (nunca hardcodear un id de usuario ni volver al patrón `usuarioRepository.findById(1L)`). El id 1 ("sistema") es una cuenta histórica sin login. Ver `docs/autenticacion.md` para el detalle de roles y flujo.
12. Errores de negocio se señalizan con `BusinessException` (→ HTTP 400 vía `GlobalExceptionHandler`), no con excepciones genéricas ni con `null` silencioso.
13. Los recursos con archivos adjuntos (`Remito`, `OrdenProvision`) guardan el PDF en el filesystem local (`uploads/remitos`, `uploads/ordenes-provision`) con nombre prefijado por timestamp, y la ruta se persiste en la entidad — no se guarda el archivo en la base de datos.

---

# Convenciones de código

## Backend (Java)
- **Constructor injection** siempre (nunca `@Autowired` en campo) — el constructor lista todas las dependencias del Service/Controller.
- Nombres de métodos y variables **en español** (`guardar`, `obtenerTodos`, `darDeBaja`, `ultimoMovimiento`), consistente con el dominio (EPEC, formularios en español). Mantener el idioma español en el código nuevo de este proyecto.
- **Estilo de formato muy vertical / expandido**: es común encontrar un solo argumento o una sola expresión por línea, incluso en llamadas triviales (`this.foo = \n foo;`, cadenas de `.builder()` partidas en muchas líneas). Esto es el estilo real y dominante del repo — no "corregirlo" a una línea salvo que se pida explícitamente refactor.
- Getters/setters explícitos escritos a mano (no se usa Lombok pese a estar en el `pom.xml`).
- Repositorios: se prioriza **Spring Data derived query methods** (`findByXxxAndYyy`) y se cae a `@Query` JPQL (con text block `"""`) solo para consultas que lo derived-method no puede expresar (subconsultas de "último movimiento", agregaciones para el dashboard, búsquedas OR multi-campo).
- Excepciones de negocio: siempre `BusinessException` con mensaje en español, listo para mostrarse al usuario final.
- Nombres de tabla/columna en `snake_case` vía `@Table`/`@Column`; nombres de campo Java en `camelCase`.

## Frontend (TypeScript/React)
- Un archivo de **tipo** por entidad (`types/Rele.ts`) y su contraparte de request (`types/ReleRequest.ts`) cuando el payload de escritura difiere del de lectura.
- Un archivo de **service** por recurso (`services/releService.ts`), con funciones sueltas (no clases) que envuelven `api.get/post/put/patch` y devuelven tipos tipados con `Promise<T>`.
- Componentes divididos en **Form** + **Table** por recurso, bajo `components/<recurso>/`; los catálogos administrables viven bajo `components/admin/<recurso>/`.
- Layout de rutas centralizado en `routes/AppRouter.tsx`, todo bajo un único `MainLayout` con `<Outlet/>`.
- Mismo estilo vertical/expandido que el backend: imports, JSX props y llamadas a funciones suelen partirse en muchas líneas cortas. Mantener esta consistencia visual al tocar estos archivos.
- Material UI como única librería de componentes visuales; no mezclar con otra librería de UI.

---

# Cosas que nunca deben romperse

- **La inmutabilidad de `Movimiento`**: ningún cambio nuevo debe permitir editar o borrar un movimiento existente; el historial es el activo más importante del sistema (es literalmente la razón de ser del proyecto: "trazabilidad").
- **El cálculo de estado/posición actual como derivado del último movimiento.** No introducir un campo `estadoActual`/`posicionActual` persistido en `Rele` que pueda desincronizarse del historial real.
- **La validación de transiciones contra `transicion_estado`.** No hardcodear reglas de transición en Java ni saltearlas "por comodidad" en un endpoint nuevo — todo alta de movimiento (incluida la baja) debe pasar por la verificación de `TransicionEstadoRepository`.
- **La unicidad de `numeroSerie`.** Cualquier alta/edición de relé debe re-validar duplicados en el Service, no confiar solo en la constraint `UNIQUE` de la tabla (los mensajes de error de negocio deben seguir siendo amigables vía `BusinessException`, no un 500 por `DataIntegrityViolationException` crudo).
- **El orden de migraciones Flyway.** Nunca editar, renombrar ni eliminar un script `V{n}__*.sql` ya aplicado; los cambios de esquema van siempre en un `V{n+1}` nuevo. Nunca cambiar `ddl-auto` de `validate` a `update`/`create` en un entorno con datos reales.
- **El soft delete de `Rele`.** Ningún flujo nuevo debe hacer `DELETE` físico de un relé que ya tenga movimientos — rompería la trazabilidad histórica que es el propósito central del sistema.
- **La separación DTO/Entity.** No empezar a devolver entidades JPA directamente por comodidad (rompe encapsulamiento, arriesga lazy-loading exceptions y expone estructura interna de BD).
- **El contrato de paginación** (`Page<ReleResponseDTO>` con `content`/`totalElements`, ver `RelePageResponse` en el frontend) — si se cambia la forma de la respuesta paginada del backend, hay que actualizar todos los consumidores del frontend.

---

# Buenas prácticas para futuras implementaciones

- **Nuevo recurso/CRUD**: seguir el patrón ya establecido — `Entity` (con `@Table` snake_case) → migración Flyway → `Repository` (derived methods primero) → `Service` (mapeo a DTO incluido) → `Controller` (delgado) → `RequestDTO`/`ResponseDTO` → frontend `types/*.ts` + `services/*Service.ts` + `components/admin/<recurso>/{Form,Table}.tsx` + página en `pages/admin/` + ruta en `AppRouter.tsx` + entrada de menú en `MainLayout.tsx`.
- **Nuevo estado o transición operativa**: es un cambio de **datos**, no de código — agregar filas a `estado`/`transicion_estado` vía una nueva migración Flyway. No agregar `if (estado.equals("X"))` dispersos en Java para modelar reglas de flujo; ya existe el mecanismo genérico (`TransicionEstadoRepository`) para eso.
- **Antes de asumir qué estados existen o qué transiciones son válidas**, revisar el contenido actual de `estado`/`transicion_estado` (o la migración Flyway más reciente que las toque), no confiar en nombres vistos en migraciones antiguas ya superadas.
- **Nuevas reglas de negocio** van en el Service correspondiente, señalizando error con `BusinessException` con mensaje claro en español — nunca en el Controller ni devolviendo `null`/silenciando el error.
- **Si se toca `ReleService`, `MovimientoService`, `EstadoService` o `ReleBajaService`**, tener en cuenta que están acoplados entre sí (p. ej. `MovimientoService` invoca `ReleBajaService` cuando el destino es BAJA, `ReleService.darDeBaja` duplica parte de esa lógica) — revisar ambos caminos de baja para no dejarlos inconsistentes.
- **Nuevo endpoint que necesita restringirse por rol**: no agregar `@PreAuthorize` disperso — la regla vive centralizada en `SecurityConfig.securityFilterChain` (hoy: `GET` abierto a los 3 roles autenticados, escritura en `/api/usuarios/**` solo `ADMIN`, escritura en el resto `ADMIN` u `OPERADOR`). Si se necesita un permiso más granular, extender esas mismas reglas por prefijo de ruta, no introducir un mecanismo paralelo (como `@PreAuthorize`).
- **Nuevo rol**: agregar el valor a la `CHECK` constraint de `usuario.rol` (migración Flyway) y a `ROLES_VALIDOS` en `UsuarioService`; no hay enum Java que sincronizar (mismo patrón que `Rele.tipoIngreso`).
- **Cualquier Service que necesite saber "quién hizo esto"** debe usar `CurrentUserProvider.obtenerUsuarioActual()` (paquete `protecciones.security`), nunca un id de usuario hardcodeado.
- **Mantener el idioma español** en nombres de dominio (entidades, DTOs, servicios, variables de negocio) y el estilo de formato vertical existente, para no introducir inconsistencia dentro del mismo archivo/módulo.
- **No agregar dependencias de UI ni de estado global** (Redux, Zustand, otra librería de componentes) sin verificar que no exista ya una forma de resolverlo con lo que usa el proyecto (estado local de componente + servicios + MUI).
- **Los adjuntos de `Remito`/`OrdenProvision` se guardan en filesystem local** (`uploads/...`), no en la base ni en un bucket externo; si se necesita almacenamiento externo, es un cambio de infraestructura a discutir explícitamente, no algo para introducir de forma incidental en un fix menor.
- **Cualquier integración con un servicio externo (LLM, API de terceros, etc.)** debe seguir el patrón de `GeminiService`/`DashboardService.obtenerResumenIA()`: degradación agraciada (si falla o no está configurado, devolver `null`/vacío y que el frontend oculte esa sección, nunca un 500 que rompa el resto de la página), timeouts explícitos en el cliente HTTP, y si el resultado no cambia entre pedidos, cachear en vez de llamar en cada request.
