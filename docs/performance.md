# Performance

Documento de referencia sobre las decisiones de performance ya tomadas en el código (backend + frontend + base de datos) y las oportunidades de mejora identificadas. Complementa a `CLAUDE.md`. Relevado sobre el código real al 2026-07-21 — el volumen de datos actual del sistema es bajo (uso interno de un solo departamento de EPEC), así que ninguno de estos puntos es crítico hoy: son riesgos que crecen con el tiempo, documentados para no perderlos de vista antes de que se vuelvan un problema real.

---

## 1. Índices de base de datos

Único índice explícito en las 33 migraciones: `uk_remito_numero_remito` (`V30`, índice único funcional sobre `UPPER(TRIM(numero_remito))`). El resto de la integridad viene de `PRIMARY KEY`/`UNIQUE` implícitos (p. ej. `rele.numero_serie`).

⚠️ **Ninguna columna de foreign key tiene índice explícito** — Postgres no indexa automáticamente FKs (a diferencia de PK/UNIQUE). Afecta en particular a:
- `movimiento.rele_id` — la columna más consultada del sistema: aparece en la subquery correlacionada de "último movimiento" (repetida en varias queries, ver punto 2), en el historial completo de cada relé, y en la validación de transición de estado. Es el candidato de mayor impacto para un índice nuevo.
- `movimiento.estado_id`, `movimiento.posicion_id`, `movimiento.usuario_id`, `rele.modelo_id`, `rele.remito_id`, `posicion.destino_id`, `remito.proveedor_id` — mismo problema, menor volumen de consulta relativa.

Con el volumen actual esto no es perceptible; a medida que `movimiento` crece (es la tabla que más filas acumula, un evento por cada cambio de estado de cada relé, para siempre — nunca se borra), cada operación sobre esa tabla pasa de un índice a un seq scan.

## 2. Cálculo de "estado/posición actual"

Por regla del sistema (ver `CLAUDE.md`), el estado y la posición actuales de un relé **nunca** son un campo persistido — siempre se derivan del último `Movimiento` (`fecha` desc, `id` desc como desempate). Hay **dos implementaciones paralelas** de ese cálculo:

- **Vista `vw_ultimo_movimiento`** (`V26__create_vista_ultimo_movimiento.sql`) — vista simple (no materializada) con el patrón `NOT EXISTS`. Usada solo por `UltimoMovimientoRepository`, y solo para los KPIs agregados del dashboard (conteos por estado/destino).
- **Subquery `NOT EXISTS` repetida a mano** en `ReleRepository.buscarPaginado` y en varios métodos de `MovimientoRepository` — el resto del sistema (listados de relés, historial) no pasa por la vista.

La propia migración `V26` documenta en un comentario que no se unificó para no arriesgar romper flujos ya probados. No es un bug, pero es deuda técnica: dos caminos para la misma lógica de negocio. Funcionalmente ambos hacen lo mismo hoy; el riesgo es que diverjan si alguien cambia uno sin el otro.

## 3. N+1 queries

Ninguna entidad declara `fetch = FetchType.LAZY` en sus `@ManyToOne` — todas quedan en el default de JPA (`EAGER`), y no hay `@EntityGraph`, `JOIN FETCH` explícito, ni `hibernate.default_batch_fetch_size`/`@BatchSize` configurado en ningún lado del proyecto.

- **Bien resuelto**: `ReleService.obtenerTodos()` y `obtenerPaginados()` evitan el N+1 del "último movimiento" trayendo todos los relés con una query y batcheando sus últimos movimientos en una segunda query (`findUltimosMovimientosByReleIds`), armando un `Map` en memoria — patrón correcto.
- ⚠️ **N+1 real en `ReleService.buscarPorSerialParcial`** (`GET /api/reles/buscar?serial=...`): por cada resultado del `LIKE`, hace una query adicional para el último movimiento (`mapToResponseDTOCompleto`). N resultados = N+1 queries.
- ⚠️ **N+1 real en `ReleService.obtenerOpciones()`**: itera relés accediendo a `.getModelo().getMarca()` sin batching — aunque el fetch es EAGER (no lanza `LazyInitializationException`), Hibernate igual dispara una consulta por `modelo` y otra por `marca` accedidos si no vienen ya cargados de una consulta previa.
- ⚠️ **Mismo patrón en `MovimientoService.mapToDTO`/`exportarExcel`**, que navegan `rele → modelo → marca`, `posicion → destino`, `usuario` por cada fila — se agrava en `exportarExcel` porque puede iterar todo el historial sin límite (ver punto 8).

Ninguno de estos rompe funcionalmente nada (el resultado es correcto), pero cada uno multiplica el número de queries por el tamaño del resultado.

## 4. Paginación

- `GET /api/reles` **pagina correctamente** (`Pageable`/`Page<T>` de Spring Data).
- ⚠️ `GET /api/reles/{id}/movimientos` (historial de un relé) **no pagina** — devuelve la lista completa siempre. Para un relé con años de movimientos, es toda la respuesta de una vez.
- ⚠️ `GET /api/movimientos` **no pagina en absoluto** — `findAll()` sin `Pageable`, trae toda la tabla `movimiento` en cada request. El frontend (`MovimientoPage.tsx`) carga todo al montar y **filtra por fecha en el cliente**, en vez de mandarle el rango al backend (que ya soporta filtro por fecha para el dashboard — el mecanismo existe, solo no está conectado a esta pantalla).
- `GET /api/reles/buscar?serial=...` tampoco pagina.

Es el hallazgo de mayor impacto a futuro: a diferencia de `/api/reles`, que ya está preparado para crecer, `/api/movimientos` no lo está, y es la tabla que más crece del sistema por diseño (nunca se borra un movimiento).

## 5. Agregaciones del dashboard

Bien resuelto: todos los KPIs y distribuciones (por estado, marca, modelo, destino, proveedor) se calculan con `@Query` de agregación en SQL (`GROUP BY`/`COUNT`), nunca trayendo filas a Java para sumar con streams. `DashboardService.obtenerKpis()` encadena ~10 queries de agregación independientes — no es una sola query combinada, pero cada una resuelve en la base, no hay traída masiva de datos.

## 6. Cache del resumen ejecutivo IA

`DashboardService` cachea la respuesta de Gemini 4 horas (`RESUMEN_IA_TTL_MS`) en un campo `volatile` de la propia instancia del servicio, con `synchronized` para que pedidos concurrentes no disparen más de un llamado a Gemini a la vez. Es cache en memoria simple, no Redis/Caffeine — decisión consciente y documentada (`CLAUDE.md`), correcta para una sola instancia de backend. Implica que el cache se pierde en cada reinicio y no se comparte si se escalara horizontalmente (cada réplica gastaría cuota de Gemini por separado hasta poblar su propio cache) — solo relevante si el sistema pasa a correr más de una instancia.

## 7. Connection pool

`application.properties` no configura ninguna propiedad `spring.datasource.hikari.*` — corre con los defaults de Spring Boot (pool máximo 10 conexiones, sin `connection-timeout`/`idle-timeout`/`minimum-idle` explícitos). No es un problema con el volumen actual, pero el comportamiento bajo carga concurrente real no está afinado ni medido.

## 8. Búsqueda parcial y exportación sin límite

- `GET /api/reles/buscar?serial=...` usa `LIKE '%texto%'` (comodín inicial) sobre `numeroSerie`/`modelo`/`marca` — no puede usar ningún índice B-tree normal (requeriría `pg_trgm` + índice GIN, que no existe hoy). Es un seq scan por diseño; aceptable mientras el catálogo de relés sea chico.
- ⚠️ `MovimientoService.exportarExcel()` sin rango de fechas trae **toda la tabla `movimiento`** a memoria (`findAllByOrderByFechaMovimientoDesc()`), navega las relaciones fila por fila (mismo N+1 del punto 3, multiplicado por el volumen total), y hace `autoSizeColumn` (operación costosa por columna) antes de escribir el Excel. Expuesto en `GET /api/movimientos/exportar` y usado desde el botón "Exportar Informe" cuando el filtro de período es "TODOS".

## 9. Frontend — bundle único, sin code splitting

`AppRouter.tsx` importa todas las páginas de forma estática (sin `React.lazy`/`import()` dinámico), y `vite.config.ts` no define `manualChunks`. Todo el árbol de páginas —dashboard, los 9 CRUDs de catálogos, formularios— va en un solo bundle JS servido de una vez. Afecta el tiempo de carga inicial (TTI), más cuanto más crece el admin de catálogos.

## 10. Frontend — tablas sin virtualizar

Ni `ReleTable.tsx` ni `MovimientoTable.tsx` usan virtualización (no hay `react-window` ni `@mui/x-data-grid` en el proyecto) — ambas renderizan un `<Table>` de MUI estándar con `.map()` directo. En `ReleTable` es aceptable porque la fuente ya viene paginada del backend. ⚠️ En `MovimientoTable` es un problema real hoy, porque la página que la alimenta (`MovimientoPage`) trae el historial completo sin paginar (punto 4) — la tabla puede terminar renderizando miles de filas de una sola vez en el DOM.

## 11. Frontend — llamadas a la API

`HomePage.tsx` y `ReleForm.tsx` están bien: usan `Promise.all` para paralelizar cargas de catálogos, `useEffect` con dependencias correctas, y debounce en el chequeo de número de serie duplicado (contra un endpoint paginado, no trae todo). No se detectó refetch evitable por dependencias mal puestas.

La única llamada redundante por diseño (no por bug) es la de `MovimientoPage.tsx`: trae todo `GET /api/movimientos` en cada carga y filtra por fecha en el cliente, en vez de mandar el rango al backend — mismo hallazgo del punto 4, visto desde el lado del frontend.

## 12. Recharts fijado en v3.x

`package.json` fija `recharts: ^3.9.2` — no es una limitación de performance sino una corrección de un bug de compatibilidad de Recharts 2.15.4 con React 19 (`BarChart layout="vertical"` solo renderizaba el primer ítem, sin error en consola). Documentado en `CLAUDE.md`; no bajar a v2.x.

## 13. Nginx sin compresión ni cache headers

`frontend/nginx.conf` no tiene `gzip on;` ni ninguna directiva de compresión, y no configura `Cache-Control`/`expires` para los assets estáticos con hash que genera Vite. Sirve todo con la config default de Nginx. Mejora barata: unas pocas líneas de config, impacto directo en tamaño de transferencia y en evitar redescargas de assets que no cambiaron.

## 14. Sin tests de carga

No existe ningún test de performance/benchmark (ni JMH del lado backend, ni Gatling/k6/JMeter, ni nada equivalente en frontend). Los 17 tests de backend y 3 de frontend son funcionales (JUnit/Mockito, Vitest), no de carga.

---

## Resumen — oportunidades de mejora (priorizadas por impacto/esfuerzo)

1. **Índice en `movimiento.rele_id`** (y en las demás FK del punto 1) — una migración Flyway nueva (`V34__agregar_indices_fk.sql` o similar), cambio de bajo riesgo y alto impacto a medida que crece el historial.
2. **Paginar `GET /api/movimientos`** y conectar el filtro de fecha del frontend al backend en vez de filtrar en el cliente — el mecanismo de filtro por fecha ya existe (lo usa el dashboard), solo falta reutilizarlo en `MovimientoPage`. Resuelve a la vez el punto 4, el punto 10 (tabla sin virtualizar) y reduce el riesgo del punto 8 (export sin límite).
3. **N+1 en `buscarPorSerialParcial` y `obtenerOpciones`** — endpoints de uso frecuente (búsqueda/autocompletado). Se resuelve con `@EntityGraph`/`JOIN FETCH` puntual, sin necesidad de tocar el resto del proyecto.
4. **Code splitting por ruta** en el frontend (`React.lazy` + `Suspense` en `AppRouter.tsx`) — mejora de bajo riesgo para el tiempo de carga inicial.
5. **Gzip + cache-control en `nginx.conf`** — cambio de configuración, sin tocar código de aplicación.
6. **Unificar el cálculo de "último movimiento"** (punto 2) detrás de un único mecanismo (la vista o las subqueries, no ambos) — deuda técnica, no urgente mientras se mantengan sincronizados, pero conviene resolverla antes de que alguien modifique uno sin el otro.
7. **Configurar HikariCP explícitamente** (`maximum-pool-size`, `connection-timeout`) — no urge con el volumen actual, pero conviene tenerlo medido antes de que haga falta, no reaccionando a un incidente.

Ninguno de estos puntos es un problema hoy con el volumen real de uso (un departamento interno de EPEC); todos son inversiones baratas ahora que se vuelven más caras de resolver cuanto más crece `movimiento` y el catálogo de relés.
