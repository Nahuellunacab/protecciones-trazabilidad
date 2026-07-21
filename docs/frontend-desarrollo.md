# Desarrollo del frontend

Guía de referencia rápida para trabajar en `frontend/` (React 19 + TypeScript + Vite). Para la arquitectura general del sistema y las convenciones de código, ver `CLAUDE.md` en la raíz.

---

## Scripts (`package.json`)

| Script | Qué hace |
|---|---|
| `npm run dev` | Levanta Vite en modo desarrollo con HMR (`http://localhost:5173`). Requiere el backend corriendo en `:8080` (ver `README.md` raíz). |
| `npm run build` | `tsc -b && vite build` — chequeo de tipos + build de producción a `dist/` (usa `.env.production`). |
| `npm run build:docker` | Igual que `build` pero con `--mode docker`, usando `.env.docker` — es el que corre el `Dockerfile` del frontend. |
| `npm run lint` | ESLint sobre todo el proyecto. |
| `npm run test` | Corre los tests con Vitest (modo `run`, una sola pasada — es el que usa CI). |
| `npm run test:watch` | Vitest en modo watch, para desarrollo. |
| `npm run preview` | Sirve el build de `dist/` localmente, para verificar el resultado de `build` antes de deployar. |

## Stack y librerías principales

- **Material UI (MUI v9)** + `@emotion` — única librería de componentes visuales del proyecto (no mezclar con otra).
- **Axios** — instancia única en `src/api/axios.ts`, con interceptores de auth (agrega `Authorization: Bearer <token>` si hay sesión, fuerza logout ante cualquier `401`).
- **React Router DOM v7** — rutas centralizadas en `src/routes/AppRouter.tsx`, todas bajo un único `MainLayout` con `<Outlet/>`.
- **Recharts v3.x** — gráficos del dashboard. Mantener en v3.x: la v2.15.4 tiene un bug de compatibilidad con React 19 en `BarChart layout="vertical"` (solo renderiza el primer ítem del array, sin error en consola). Ver `CLAUDE.md`.
- **react-markdown + remark-gfm** — renderiza las respuestas del Copiloto IA (`CopilotoIACard.tsx`). No agregar `rehype-raw` ni ningún plugin que habilite HTML embebido en el markdown (ver `docs/seguridad.md`, sección XSS) sin evaluar el riesgo primero.
- **Vitest + Testing Library** — tests de componentes (`*.test.tsx`), corridos en `jsdom`.

## Estructura (ver también `CLAUDE.md`)

```
src/
├── api/axios.ts             # instancia única de Axios
├── context/AuthContext.tsx  # sesión, login()/logout(), isAdmin/canWrite
├── utils/authStorage.ts     # persistencia de token/usuario en localStorage
├── services/                # una función por endpoint, agrupadas por recurso
├── types/                   # tipos TS: entidad + su *Request
├── components/               # Form + Table por recurso, admin/<recurso>/, dashboard/, common/
├── pages/                   # una página por ruta
├── layouts/MainLayout.tsx   # AppBar + navegación + <Outlet/>
├── routes/                  # AppRouter.tsx + ProtectedRoute.tsx
└── theme/theme.ts           # theme de MUI
```

## Variables de entorno

- `.env` (desarrollo local, `npm run dev`) — no versionado, cada dev lo crea si necesita apuntar a un backend distinto del default.
- `.env.docker` — usado por `npm run build:docker` dentro del `Dockerfile`.
- `.env.production` — reservado para un deploy real futuro fuera de Docker Compose (hoy no se usa activamente, ver `CLAUDE.md`).

## Convenciones específicas de este proyecto

- Nombres de dominio en español (`Rele`, `Movimiento`, `guardar`, `obtenerTodos`), consistente con el backend.
- Estilo de formato vertical/expandido: imports, props JSX y llamadas a funciones suelen partirse en varias líneas cortas — mantenerlo al tocar archivos existentes, no "compactarlo" de paso.
- No agregar dependencias de UI ni de estado global (Redux, Zustand, otra librería de componentes) sin verificar antes que no se pueda resolver con lo que ya usa el proyecto (estado local + servicios + MUI).

## Testing

Los tests viven junto a los componentes que cubren (`*.test.tsx`). Corridos en CI (`.github/workflows/ci.yml`) con `npm run test`. El lint corre en CI pero **no bloqueante** (`continue-on-error: true`) por errores preexistentes de la regla `react-hooks/set-state-in-effect` en varias páginas admin — visibles en el log del job, pendientes de resolver antes de sacar esa excepción.

## Performance y seguridad del frontend

Ver `docs/performance.md` (bundle sin code splitting, tablas sin virtualizar, cache de llamadas) y `docs/seguridad.md` (manejo del JWT en `localStorage`, XSS, CORS) para el detalle de decisiones tomadas y pendientes específicas de este lado del sistema.
