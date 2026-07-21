# Seguridad

Documento de referencia sobre qué mecanismos de seguridad están **efectivamente implementados** en el sistema, por qué se tomó cada decisión, y qué falta. Complementa a `CLAUDE.md` (que resume el sistema en general) y a `docs/autenticacion.md` (que detalla el flujo de login/roles con diagramas). Relevado sobre el código real al 2026-07-21 — si algo cambia, actualizar este documento junto con el cambio, no como tarea aparte.

---

## 1. Autenticación (JWT)

- **Estrategia**: JWT stateless firmado con HMAC (`JwtService`, `Keys.hmacShaKeyFor(...)`). Sin sesión de servidor, sin cookies — el token viaja en `Authorization: Bearer <token>` y se guarda en `localStorage` del lado del frontend.
- **Secreto**: `jwt.secret=${JWT_SECRET}` en `application.properties`, **sin valor por defecto** — si `JWT_SECRET` no está seteada, Spring falla al arrancar (falla rápido, no hay fallback inseguro tipo secreto hardcodeado). Mismo patrón en `docker-compose.yml` (`${JWT_SECRET:?Definí JWT_SECRET en docker/.env...}`).
- **Expiración**: `JWT_EXPIRATION_MS`, default 8 horas (la duración de un turno operativo). No hay refresh token: al expirar, se vuelve a loguear.
- **Claims**: solo `subject` (email) + `issuedAt` + `expiration`. El rol **no** va embebido en el token — se resuelve en cada request contra la base (`UserDetailsServiceImpl`), así que desactivar un usuario o cambiarle el rol tiene efecto inmediato en el siguiente request, sin esperar a que expire el token viejo.
- **Gap conocido — sin validación de fuerza del secreto**: no hay chequeo explícito en código de longitud/entropía mínima de `JWT_SECRET`. Se confía en que el operador siga la recomendación de los comentarios en `.env.example` ("un valor largo y aleatorio"). Si el secreto es débil, jjwt puede fallar en runtime (`WeakKeyException`) recién al primer login, no al arrancar.

## 2. Autorización por rol

Centralizada en `SecurityConfig.securityFilterChain` (nunca `@PreAuthorize` disperso). Reglas reales, en orden de evaluación:

| Ruta / método | Requiere |
|---|---|
| `OPTIONS /**` | público (preflight CORS) |
| `POST /api/auth/login`, `/swagger-ui/**`, `/v3/api-docs/**`, `/actuator/health` | público |
| `PUT /api/auth/password` | cualquier rol autenticado (autogestión de la propia contraseña) |
| Escritura en `/api/usuarios/**` | `ADMIN` |
| `GET /api/**` | cualquier rol autenticado (`ADMIN`, `OPERADOR`, `AUDITOR`) |
| Cualquier otro método (POST/PUT/PATCH/DELETE) | `ADMIN` u `OPERADOR` — `AUDITOR` queda sin escritura en ningún lado |

401 (no autenticado) y 403 (autenticado sin el rol requerido) se manejan con handlers propios (`AuthenticationEntryPoint`/`AccessDeniedHandler`) que devuelven el mismo shape JSON (`ErrorResponse`) que el resto de los errores de negocio — el frontend no necesita un caso especial para estos dos códigos.

**CSRF deshabilitado** (`csrf.disable()`) — decisión correcta dado que la sesión es 100% stateless y el JWT viaja por header explícito, no por cookie que el navegador adjunte automáticamente en un request cross-site. Esto depende de que el token **nunca** se guarde en una cookie (hoy vive en `localStorage`, ver punto 8) — si en el futuro se migrara a cookies, CSRF habría que revisarlo de nuevo.

Los 3 roles y el detalle del flujo de login están documentados con diagramas de secuencia en `docs/autenticacion.md`.

## 3. Rate limiting de login

`LoginRateLimiter` bloquea intentos fallidos por **identificador** (cuenta) y por **IP de origen**, cada uno en un `ConcurrentHashMap` independiente. Umbral configurable: `auth.login.max-intentos` (default 5) y `auth.login.bloqueo-minutos` (default 15) → HTTP 429 (`TooManyRequestsException`). Cuando un mapa supera 1000 entradas se podan las expiradas antes de insertar, para no crecer sin límite con identificadores/IPs de un solo uso.

Es **en memoria** (documentado explícitamente en el propio código): con una sola instancia de backend funciona bien; si se escalara horizontalmente sin mover esto a un store compartido (Redis), el bloqueo se vuelve trivialmente evadible (cada instancia cuenta por separado).

⚠️ **Gap real encontrado — la IP que se usa detrás del proxy de producción no es la del cliente.** `AuthController` obtiene la IP con `request.getRemoteAddr()`, no de `X-Forwarded-For`/`X-Real-IP`. En producción el tráfico pasa `cliente → proxy nginx (TLS) → frontend (nginx) → backend`; ambos nginx sí setean `X-Real-IP`/`X-Forwarded-For`, pero el backend nunca los lee. Consecuencia: en producción, todas las requests le llegan al backend con la misma IP (la del contenedor `frontend`), así que el bloqueo "por IP" en la práctica bloquea a todos los usuarios simultáneamente ante varios fallos de cualquiera de ellos, en vez de aislar al atacante real. El bloqueo por identificador (cuenta) sigue funcionando bien porque no depende de la IP.

**No hay rate limiting en el resto de la API** — solo `/api/auth/login` tiene throttling. Cualquier otro endpoint autenticado (o los públicos como `/actuator/health`) no tiene protección contra abuso.

## 4. CORS

`CorsConfig` permite por defecto `http://localhost:*` y `http://127.0.0.1:*` (con `allowCredentials(true)`, válido en Spring porque se usa `allowedOriginPatterns`, no un `*` fijo). La lista es configurable vía `CORS_ALLOWED_ORIGINS` (env var, separada por coma) para agregar el dominio real en producción sin tocar código.

El riesgo depende enteramente de que el operador configure bien esa variable en producción — no hay ningún guardrail en código que impida, por ejemplo, poner un wildcard total (`*`) a mano en `CORS_ALLOWED_ORIGINS`, lo cual sí sería explotable combinado con `allowCredentials(true)`.

## 5. Contraseñas

- **Hash**: BCrypt (`PasswordEncoder` bean en `SecurityConfig`), usado tanto en alta/edición (`UsuarioService`) como en el cambio de la propia contraseña (`AuthService.cambiarPassword`, que valida la actual con `.matches()` antes de reencodear).
- ⚠️ **Sin política de complejidad**: ni `UsuarioRequestDTO` ni `CambiarPasswordRequestDTO` tienen `@Size`/`@Pattern` — solo `@NotBlank`. El frontend tampoco impone un mínimo consistente: `UsuarioForm.tsx` (alta/edición por ADMIN) no valida longitud; `ResetPasswordDialog.tsx` sí exige 6 caracteres mínimo, pero solo en ese flujo puntual, no en el resto. Es fácil crear una cuenta con una contraseña trivial.
- **Bootstrap admin** (`V27__add_autenticacion_a_usuario.sql`): inserta `admin@epec.local` con un hash BCrypt hardcodeado en el script SQL. La contraseña en texto plano correspondiente **no está en el repositorio** (correcto, para no filtrarla en el historial de git) — hay que confirmar aparte, fuera del código, cómo se comunica y rota ese acceso inicial en cada despliegue nuevo.

## 6. Manejo de errores

`GlobalExceptionHandler` tiene un catch-all de `Exception` que loguea el stacktrace completo del lado del servidor pero devuelve al cliente un mensaje genérico + HTTP 500, sin filtrar detalles internos. Reforzado en `application.properties`: `server.error.include-stacktrace=never`, `include-message=never`, `include-exception=false` — defensa en profundidad para cualquier error que ocurra fuera del alcance del handler (p. ej. a nivel de filtro, antes de llegar a Spring MVC).

## 7. Archivos adjuntos

`ArchivoAdjuntoValidator` (compartido por `Remito`/`OrdenProvision`):
- Valida PDF por **3 capas**: extensión, `Content-Type` declarado, y firma binaria real (`%PDF`) — un archivo malicioso no puede colarse solo renombrando la extensión.
- Detecta imágenes (JPEG/PNG/WebP) por firma binaria, no por extensión/Content-Type, y las convierte a PDF de una página antes de guardar.
- **Nombrado en disco siempre es un UUID** generado por el backend, nunca derivado del nombre original — el nombre original solo se usa para mostrar en pantalla (`sanitizarNombreOriginal`, que además descarta cualquier componente de ruta). Segunda capa de defensa (`resolverDestinoSeguro`): verifica que la ruta resuelta no escape del directorio destino tras normalizar. Path traversal cubierto en dos niveles independientes.
- Tamaño máximo: 50MB (`spring.servlet.multipart.max-file-size`/`max-request-size`, límite global de Spring/Tomcat, no hay límite adicional específico del validador).

## 8. Inyección SQL y XSS

- **SQL**: todos los repositorios usan `@Query` JPQL o derived methods de Spring Data — cero uso de `nativeQuery = true` y cero concatenación de String en queries en todo el proyecto. Sin superficie de SQL injection detectada.
- **XSS**: cero usos de `dangerouslySetInnerHTML` en todo el frontend. El único lugar que renderiza contenido semi-libre es el Copiloto IA (`CopilotoIACard.tsx`, `react-markdown` + `remark-gfm`) — sin `rehype-raw` ni ningún plugin que habilite HTML embebido, así que el texto que devuelve el modelo se parsea como markdown puro, nunca como HTML ejecutable.
- **Token en `localStorage`, no en cookie httpOnly**: coherente con la decisión de deshabilitar CSRF (punto 2), pero implica que si en el futuro apareciera un XSS (hoy no detectado), el atacante podría leer el token directamente vía JS. Es el trade-off estándar JWT-en-localStorage vs. cookie-httpOnly-con-CSRF; ambos tienen superficie de ataque distinta, no es un error, pero vale tenerlo presente si se agrega alguna librería que renderice HTML de terceros más adelante.

## 9. Gestión de secretos

`JWT_SECRET`, `DB_PASSWORD` (obligatorios, sin default — la app/el stack de Docker no arrancan sin ellos) y `GEMINI_API_KEY` (opcional). `docker/.env` está en `.gitignore` y confirmado no trackeado; `docker/.env.example` versionado con placeholders explícitos ("cambiar..."). No se encontraron secretos reales hardcodeados en código fuente. El `JWT_SECRET` usado en CI (`.github/workflows/ci.yml`) está documentado en el propio archivo como valor exclusivo de test, no un secreto real.

## 10. TLS en producción

Certificado **autofirmado** (`docker/certs/generate-self-signed.sh`, RSA 2048, 825 días de validez) — pensado para la red interna de EPEC sin dominio público. El proxy nginx redirige HTTP→HTTPS y propaga `X-Real-IP`/`X-Forwarded-For`/`X-Forwarded-Proto` (que el backend hoy no lee, ver punto 3).

⚠️ **Sin headers de seguridad HTTP**: ni `proxy.conf` ni `frontend/nginx.conf` configuran `Strict-Transport-Security` (HSTS), `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options` ni `Referrer-Policy`. Es una ausencia total, no una omisión parcial.

## 11. Auditoría

No hay ningún log de eventos de seguridad: ni logins exitosos/fallidos, ni bloqueos por rate limit, ni altas/bajas de usuario, ni cambios de rol quedan registrados en ningún logger de aplicación (`AuthService` y `UsuarioService` no tienen `Logger` en absoluto). Lo único que existe es la trazabilidad de **negocio** (`Movimiento`: qué relé cambió de estado/posición y quién lo hizo) — que cumple el propósito central del sistema, pero no es un log de auditoría de seguridad.

## 12. Dependencias de terceros

No hay Dependabot (`.github/dependabot.yml` no existe), ni OWASP dependency-check en el `pom.xml`, ni `npm audit` en el pipeline de CI. El CI actual (`.github/workflows/ci.yml`) corre tests y build de ambos lados, pero ningún análisis de vulnerabilidades de dependencias.

## 13. Sesión y logout

No hay revocación ni blacklist de JWT — `JwtService` solo valida firma y expiración, no consulta ningún store de tokens invalidados. El logout es puramente client-side (`AuthContext.logout()` limpia `localStorage`); un token robado sigue siendo válido en el backend hasta su expiración natural (hasta 8h) aunque el usuario haya "cerrado sesión" en la UI.

---

## Resumen — qué falta (priorizado)

Ítems de mayor a menor impacto/urgencia relativa, para usar como backlog de seguridad:

1. **Arreglar la detección de IP detrás del proxy** (punto 3) — hoy el rate limiting por IP no distingue usuarios en producción. Es un cambio acotado: leer `X-Forwarded-For`/`X-Real-IP` en `AuthController` (con cuidado de solo confiar en el header cuando la request viene del proxy conocido, para no permitir que un cliente falsifique su propia IP).
2. **Política de complejidad de contraseña**, consistente en backend (`@Size`/`@Pattern` en los DTOs) y frontend (mismo mínimo en `UsuarioForm.tsx` y `ResetPasswordDialog.tsx`).
3. **Headers de seguridad HTTP** en `proxy.conf`/`nginx.conf` (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy; CSP requiere más cuidado por el Copiloto IA y assets de Vite, pero es viable).
4. **Logging de eventos de seguridad** (logins fallidos/exitosos, bloqueos, altas y cambios de rol de usuario) — ni siquiera hace falta una tabla de auditoría dedicada al principio, alcanza con loguearlo estructurado y revisarlo si aparece un incidente.
5. **Revocación de JWT / logout real**, si el caso de uso lo justifica (hoy la ventana de exposición máxima es 8h, que puede ser aceptable dado el contexto interno — evaluar si vale la complejidad de una blacklist).
6. **Dependency scanning** en CI (Dependabot es el más barato de activar; `npm audit --audit-level=high` como paso no bloqueante es un primer paso rápido).
7. **Rate limiting movido a un store compartido** (Redis) — solo urge si el backend pasa a correr más de una instancia.
8. **Rate limiting general de API** — hoy solo protege el login; evaluar si algún otro endpoint (especialmente los que llaman a Gemini, que tienen costo de cuota) necesita throttling propio además del cache existente.

Ninguno de estos gaps es una vulnerabilidad explotada activamente conocida — son ausencias de controles adicionales de defensa en profundidad sobre una base ya sólida (JWT bien firmado, BCrypt, sin inyección SQL/XSS detectada, manejo de errores sin fuga de información, validación de adjuntos en capas).
