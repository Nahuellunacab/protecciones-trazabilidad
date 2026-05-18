# Protecciones Trazabilidad

Sistema de trazabilidad e inventario de relés de protección orientado a la gestión de stock, movimientos, historial y auditoría de equipos utilizados en el área de Protecciones y Teleoperación.

---

# Objetivo

Centralizar y digitalizar la trazabilidad de:
- relés de protección
- movimientos de stock
- ubicaciones
- estados de equipos
- historial de intervenciones
- remitos y proveedores

El sistema busca reemplazar procesos manuales y facilitar futuras integraciones con plataformas corporativas como IBM Maximo mediante APIs REST o MIF.

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

## Infraestructura
- Docker
- Docker Compose

## Frontend (futuro)
- React
- TypeScript

---

# Arquitectura General

```mermaid
flowchart LR

    A[Usuario / Frontend] --> B[Spring Boot API]

    B --> C[Controllers]
    C --> D[Services]
    D --> E[Repositories JPA]
    E --> F[Hibernate / JPA]

    F --> G[(PostgreSQL)]

    subgraph Docker
        G
    end
```

---

# Flujo de Persistencia

```mermaid
flowchart TD

    A[Migration SQL] --> B[Flyway]
    B --> C[(PostgreSQL)]

    D[Spring Boot] --> E[Hibernate/JPA]
    E --> C

    C --> F[Trazabilidad de Relés]
```

---

# Puertos Utilizados

| Componente | Puerto |
|---|---|
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

# Estructura del Proyecto

```text
backend/
├── src/main/java/
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

docker/
└── docker-compose.yml
```

---

# Responsabilidad de Cada Capa

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

# Base de Datos Versionada

La estructura de base de datos se administra mediante Flyway.

## Migraciones actuales

```text
V1__initial_catalogs.sql
V2__create_location_and_provider.sql
V3__create_rele_domain.sql
V4__create_movimiento_and_usuario.sql
```

Cada cambio estructural debe realizarse mediante una nueva migration.

Ejemplo:

```text
V5__add_observaciones_to_rele.sql
```

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

# Convenciones de Desarrollo

- Un commit por cambio lógico
- Arquitectura por capas
- Base de datos versionada con Flyway
- Convención REST para endpoints
- Uso de migraciones incrementales
- Separación entre lógica de negocio y persistencia
- No modificar migrations ya ejecutadas
- Toda modificación estructural debe realizarse mediante una nueva versión Flyway

---

# Estado Actual

## Implementado
- Entorno Docker
- PostgreSQL
- Spring Boot
- Flyway
- Hibernate/JPA
- Modelo relacional completo
- Versionado de base de datos
- Backend operativo
- PostgreSQL Explorer conectado
- Persistencia inicial funcional

## Próximos Pasos
- Creación de entidades JPA
- Repositories
- Services
- Controllers REST
- CRUD de catálogos
- Gestión de movimientos
- Historial de trazabilidad
- API REST completa
- Frontend React
- Integración futura con Maximo/MIF

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
./mvnw spring-boot:run
```

---

## Verificar contenedores Docker

```bash
docker ps
```

---

## Detener contenedores

```bash
docker compose down
```

---

# Flujo de Trabajo Actual

```mermaid
flowchart LR

    A[Crear Migration SQL]
    --> B[Ejecutar Spring Boot]
    --> C[Flyway actualiza PostgreSQL]
    --> D[Validar en PostgreSQL Explorer]
    --> E[Implementar JPA y API REST]
```

---

# Autor

Proyecto desarrollado como iniciativa de mejora y digitalización de procesos para el área de Protecciones y Teleoperación.