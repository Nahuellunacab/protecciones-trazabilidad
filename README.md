# Protecciones Trazabilidad

Sistema de gestión y trazabilidad de relés de protección orientado a la administración de stock, movimientos, historial operativo y auditoría de equipos utilizados por EPEC Transmisión — Departamento de Teleoperaciones y Protecciones.

---

# Objetivo

Centralizar y digitalizar la trazabilidad de:

- relés de protección
- movimientos operativos
- estados de equipos
- posiciones físicas
- destinos y ubicaciones
- historial de intervenciones
- remitos y proveedores
- usuarios responsables

El sistema busca reemplazar procesos manuales y servir como base para futuras integraciones con plataformas corporativas como IBM Maximo mediante APIs REST o MIF.

---

# Stack Tecnológico

## Backend
- Java 21
- Spring Boot 4
- Spring Data JPA
- Hibernate
- Maven

## Base de Datos
- PostgreSQL 16
- Flyway

## Frontend
- React
- TypeScript
- Vite
- Axios
- React Router
- Material UI

## Infraestructura
- Docker
- Docker Compose

## Documentación API
- Swagger / OpenAPI

---

# Identidad Visual

La aplicación implementa una interfaz institucional inspirada en la identidad corporativa de EPEC Transmisión.

## Características UI/UX actuales

- Theme corporativo institucional
- Navbar enterprise
- Branding EPEC
- Logo institucional
- Favicon personalizado
- Layout responsive
- Material UI
- Formularios modernos
- Feedback visual
- Snackbar notifications
- Loading states
- Diseño orientado a operación técnica

---

# Arquitectura General

```mermaid
flowchart LR

    A[Frontend React]
        -->|HTTP REST| B[Spring Boot API]

    B --> C[Controllers]
    C --> D[Services]
    D --> E[Repositories JPA]
    E --> F[Hibernate]
    F --> G[(PostgreSQL)]

    subgraph Frontend
        A
    end

    subgraph Backend
        B
        C
        D
        E
        F
    end

    subgraph Docker
        G
    end
```

---

# Flujo Fullstack Actual

```mermaid
flowchart TD

    A[Usuario Frontend React]
        --> B[Axios HTTP Request]

    B --> C[Spring Boot REST API]

    C --> D[DTO Request]

    D --> E[Validation]

    E --> F[Service]

    F --> G[JPA Repository]

    G --> H[(PostgreSQL)]

    H --> G

    G --> F

    F --> I[DTO Response]

    I --> J[JSON Response]

    J --> K[React Render UI]
```

---

# Flujo de Persistencia

```mermaid
flowchart TD

    A[Migration SQL]
        --> B[Flyway]

    B --> C[(PostgreSQL)]

    D[Spring Boot]
        --> E[Hibernate/JPA]

    E --> C

    C --> F[Trazabilidad de Relés]
```

---

# Puertos Utilizados

| Componente | Puerto |
|---|---|
| Frontend React/Vite | 5173 |
| Spring Boot API | 8082 |
| PostgreSQL Docker | 5433 |
| PostgreSQL Interno Docker | 5432 |

---

# Modelo de Dominio Actual

```mermaid
erDiagram

    TIPO ||--o{ MODELO : clasifica
    MARCA ||--o{ MODELO : fabrica

    MODELO ||--o{ RELE : define

    PROVINCIA ||--o{ LOCALIDAD : contiene

    LOCALIDAD ||--o{ PROVEEDOR : ubica
    LOCALIDAD ||--o{ DESTINO : ubica

    DESTINO ||--o{ POSICION : contiene

    PROVEEDOR ||--o{ REMITO : emite

    REMITO ||--o{ RELE : incluye

    ESTADO ||--o{ MOVIMIENTO : determina
    POSICION ||--o{ MOVIMIENTO : registra
    USUARIO ||--o{ MOVIMIENTO : realiza
    RELE ||--o{ MOVIMIENTO : posee
```

---

# Arquitectura Backend

```mermaid
flowchart TD

    A[HTTP Request]
        --> B[Controller]

    B --> C[Service]

    C --> D[Repository]

    D --> E[(PostgreSQL)]

    E --> D
    D --> C
    C --> B

    B --> F[JSON Response]
```

---

# Arquitectura Frontend

```mermaid
flowchart TD

    A[Pages]
        --> B[Components]

    B --> C[Services]

    C --> D[Axios API]

    D --> E[Spring Boot Backend]

    A --> F[Layouts]

    A --> G[Routes]

    A --> H[Types]

    A --> I[Theme]
```

---

# Estructura del Proyecto

```text
backend/
├── src/main/java/
│
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── dto/
│   ├── mapper/
│   ├── config/
│   └── exception/
│
├── src/main/resources/
│   ├── db/migration/
│   └── application.properties
│
└── pom.xml

frontend/
├── src/
│
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── theme/
│   ├── types/
│   └── App.tsx
│
├── public/
│
└── package.json

docker/
└── docker-compose.yml
```

---

# Responsabilidad de Cada Capa Backend

## controller
Expone endpoints REST y recibe requests HTTP.

## service
Contiene la lógica de negocio del sistema.

## repository
Acceso a base de datos mediante Spring Data JPA.

## entity
Modelos persistentes mapeados a tablas SQL.

## dto
Objetos utilizados para intercambio de datos vía API.

## mapper
Transformación entre DTOs y Entities.

## config
Configuraciones generales del sistema.

## exception
Manejo centralizado de errores y excepciones.

## db/migration
Migraciones SQL versionadas mediante Flyway.

---

# Responsabilidad de Cada Capa Frontend

## pages
Pantallas principales de la aplicación.

## components
Componentes reutilizables de UI.

## layouts
Layouts globales de navegación y estructura.

## routes
Configuración centralizada de rutas React Router.

## services
Comunicación HTTP con backend mediante Axios.

## api
Configuración global de Axios.

## types
Tipos TypeScript desacoplados del backend.

## theme
Configuración visual global Material UI.

---

# Base de Datos Versionada

La estructura de base de datos se administra mediante Flyway.

## Migraciones actuales

```text
V1__initial_catalogs.sql
V2__create_location_and_provider.sql
V3__create_rele_domain.sql
V4__create_movimiento_and_usuario.sql
V5__seed_initial_data.sql
V6__insert_real_operational_data.sql
```

---

# Seed Data Operacional

La aplicación implementa bootstrap automático de datos iniciales y operacionales mediante Flyway.

## Datos incluidos

### Catálogos
- Provincias
- Localidades
- Estados
- Marcas
- Tipos

### Operación
- Destinos reales
- Posiciones reales
- Modelos reales
- Relés reales
- Remitos
- Usuario sistema

### Datos operativos simulados
- ABB REL670
- ABB REG670
- Siemens SIPROTEC
- GE Multilin
- AREVA MiCOM

Esto permite levantar el entorno completamente funcional sin inserciones manuales.

---

# Modelo Implementado en PostgreSQL

## Tablas actuales

- tipo
- marca
- estado
- provincia
- localidad
- proveedor
- destino
- posicion
- modelo
- remito
- rele
- usuario
- movimiento
- flyway_schema_history

---

# Entidades JPA Implementadas

## Catálogos
- Tipo
- Marca
- Estado
- Provincia
- Localidad

## Dominio principal
- Modelo
- Rele
- Movimiento

## Ubicaciones
- Destino
- Posicion

## Gestión logística
- Proveedor
- Remito

## Usuarios
- Usuario

---

# Capacidades Actuales del Backend

## Persistencia
- Hibernate/JPA
- PostgreSQL
- Repositories Spring Data

## Arquitectura
- Arquitectura por capas
- DTOs
- Validaciones
- Exception Handling global
- Responses REST desacopladas

## REST API
- CRUD base
- Status HTTP correctos
- JSON responses
- ResponseEntity

## Documentación
- Swagger/OpenAPI
- Documentación automática

## Trazabilidad
- Historial de movimientos
- Estado actual derivado
- Tracking operativo

## Queries y búsquedas
- Búsqueda exacta por serial
- Búsqueda parcial por serial
- Filtros por estado actual
- Queries derivadas JPA

## Escalabilidad
- Paginación
- Sorting dinámico
- Consultas configurables

---

# Capacidades Actuales del Frontend

## Arquitectura
- React + TypeScript
- Arquitectura desacoplada
- React Router
- Componentización
- Services desacoplados
- Axios centralizado

## UI/UX
- Material UI
- Theme institucional EPEC
- Navbar corporativa
- Branding Transmisión
- Formularios enterprise
- Selects dinámicos
- Catálogos operativos
- Tabla enterprise
- Loading states
- Feedback visual
- Snackbars de éxito/error
- Responsive layout

## Fullstack
- Consumo API real
- CRUD operativo
- Integración React ↔ Spring Boot
- Persistencia fullstack funcional
- Gestión de movimientos
- Historial operativo
- Dropdowns dinámicos conectados al backend

---

# APIs REST Implementadas

## Catálogos
- /api/tipos
- /api/marcas
- /api/estados
- /api/provincias
- /api/localidades
- /api/posiciones

## Dominio principal
- /api/modelos
- /api/reles
- /api/movimientos

## Opciones frontend
- /api/reles/opciones

## Ubicaciones
- /api/destinos

## Gestión logística
- /api/proveedores
- /api/remitos

## Usuarios
- /api/usuarios

---

# Endpoints Avanzados Implementados

## Relés

### Obtener relés paginados

```http
GET /api/reles?page=0&size=10
```

### Sorting dinámico

```http
GET /api/reles?page=0&size=10&sort=numeroSerie,asc
```

### Buscar por serial exacto

```http
GET /api/reles/serial/REL-001
```

### Buscar por serial parcial

```http
GET /api/reles/buscar?serial=REL
```

### Obtener historial de movimientos

```http
GET /api/reles/1/movimientos
```

### Obtener estado actual

```http
GET /api/reles/1/estado-actual
```

### Filtrar por estado actual

```http
GET /api/reles/estado/INSTALADO
```

### Obtener opciones para dropdowns

```http
GET /api/reles/opciones
```

---

# Swagger / OpenAPI

## Acceso local

```text
http://localhost:8082/swagger-ui/index.html
```

---

# Estado Actual

## Backend implementado

- Docker
- PostgreSQL
- Spring Boot
- Flyway
- Hibernate/JPA
- Arquitectura backend por capas
- Modelo relacional completo
- Versionado de base de datos
- DTOs
- Validaciones Bean Validation
- Exception Handling global
- Swagger/OpenAPI
- Repositories
- Services
- Controllers REST
- CRUD base
- Historial de movimientos
- Estado actual derivado
- Persistencia funcional
- Seed data automática
- APIs catálogo
- DTOs desacoplados

---

## Frontend implementado

- React + Vite
- TypeScript
- Axios
- React Router
- Material UI
- Theme corporativo
- Navbar institucional
- Branding EPEC Transmisión
- HomePage corporativa
- CRUD operativo
- Gestión de movimientos
- Integración fullstack funcional
- Selects dinámicos
- Catálogos conectados al backend
- UX enterprise

---

# Próximos Pasos

## Frontend

- Dashboard operativo
- DataGrid avanzado
- Dialogs
- Filtros visuales
- Paginación frontend
- Dark mode
- Métricas operativas
- Dashboard stock operativo

## Backend

- Queries avanzadas
- Filtros múltiples
- Auditoría automática
- Soft delete
- Seguridad/JWT
- Roles y permisos
- Optimización de queries
- Dockerización completa backend

## Integraciones futuras

- IBM Maximo
- MIF
- APIs corporativas
- Exportación Excel/PDF

---

# Convenciones de Desarrollo

- Un commit por cambio lógico
- Arquitectura desacoplada
- Base de datos versionada con Flyway
- Convención REST para endpoints
- Uso de migraciones incrementales
- Separación entre lógica de negocio y persistencia
- No modificar migrations ya ejecutadas
- Toda modificación estructural debe realizarse mediante una nueva versión Flyway

---

# Ejecución Local

## Levantar PostgreSQL

```bash
cd docker
docker compose up -d
```

---

## Ejecutar Backend

```bash
cd backend
./mvnw.cmd spring-boot:run
```

---

## Ejecutar Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Acceder Frontend

```text
http://localhost:5173
```

---

## Acceder Swagger

```text
http://localhost:8082/swagger-ui/index.html
```

---

## Verificar contenedores Docker

```bash
docker ps
```

---

## Reinicio completo de entorno

```bash
docker compose down -v
docker compose up -d
```

---

# Flujo de Trabajo Actual

```mermaid
flowchart LR

    A[Crear Migration SQL]
        --> B[Ejecutar Spring Boot]

    B --> C[Flyway actualiza PostgreSQL]

    C --> D[Hibernate valida Entities]

    D --> E[Exposición API REST]

    E --> F[Frontend React consume API]

    F --> G[Material UI Render]

    G --> H[Pruebas Fullstack]
```

---

# Estado Arquitectónico Actual

```text
Aplicación fullstack enterprise base funcional
```

Con:

- backend REST profesional
- frontend React desacoplado
- Material UI
- identidad visual institucional
- arquitectura escalable
- persistencia fullstack
- trazabilidad histórica
- documentación OpenAPI
- integración React ↔ Spring Boot
- seed data automática
- bootstrap completo de entorno
- catálogos dinámicos
- UX operacional enterprise

---

# Autor

Proyecto desarrollado como iniciativa de mejora y digitalización de procesos para el área de Protecciones y Teleoperación de EPEC Transmisión.