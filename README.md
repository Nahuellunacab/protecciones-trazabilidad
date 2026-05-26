# Protecciones Trazabilidad

Sistema fullstack enterprise de gestión y trazabilidad operativa de relés de protección para EPEC Transmisión — Departamento de Teleoperaciones y Protecciones.

La aplicación permite administrar:

- relés de protección
- modelos y marcas
- tensiones auxiliares
- movimientos operativos
- historial operativo
- estados
- posiciones
- destinos
- localidades
- provincias
- remitos
- proveedores
- usuarios responsables

mediante una arquitectura desacoplada React + Spring Boot + PostgreSQL.

---

# Objetivo

Centralizar y digitalizar la trazabilidad operativa de:

- relés de protección
- movimientos operativos
- estados de equipos
- posiciones físicas
- destinos y ubicaciones
- historial de intervenciones
- remitos y proveedores
- usuarios responsables

El sistema busca reemplazar procesos manuales realizados previamente en Microsoft Access y servir como base para futuras integraciones corporativas:

- IBM Maximo
- APIs REST
- MIF
- dashboards operativos
- reporting técnico
- auditoría operacional

---

# Estado Actual del Proyecto

```text
Aplicación fullstack enterprise funcional
```

Actualmente el sistema ya posee:

- backend REST profesional
- frontend React desacoplado
- PostgreSQL
- Flyway
- Docker
- Material UI
- identidad visual institucional
- CRUDs operativos
- trazabilidad histórica
- catálogos dinámicos
- seed data automática
- integración React ↔ Spring Boot
- arquitectura escalable
- UX enterprise
- build frontend verificado y sin errores de compilación
- flujo operacional inspirado en el Access original del área

---

# Stack Tecnológico

## Backend

- Java 21
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven
- Bean Validation

## Base de Datos

- PostgreSQL 16
- Flyway

## Frontend

- React
- TypeScript
- Vite
- Axios
- React Router DOM
- Material UI

## Infraestructura

- Docker
- Docker Compose

## API Docs

- Swagger/OpenAPI

---

# Modelo Conceptual Operacional

## Concepto principal

```text
Modelo = tipo técnico de relé
Número de serie = unidad física real
```

Puede haber múltiples relés asociados al mismo modelo.

La trazabilidad y operación se realiza sobre:

```text
la unidad física
```

identificada mediante el número de serie.

---

# Arquitectura Operacional

El sistema NO se comporta como un CRUD tradicional.

Conceptualmente:

- Relés = inventario operacional
- Movimientos = eventos históricos
- Historial = trazabilidad
- Estado actual = derivado del último movimiento
- Posición actual = derivada del último movimiento

Esto permite evolucionar posteriormente hacia:

- workflows operacionales
- auditoría automática
- máquina de estados
- dashboards operativos
- integración con sistemas corporativos

---

# Gestión de Modelos

## Funcionalidades implementadas

- Alta de modelos
- Edición de modelos
- Eliminación de modelos
- Asociación Marca ↔ Modelo
- Asociación Tipo ↔ Modelo
- Gestión de tensiones auxiliares
- Validación de duplicados
- Métricas operativas por modelo
- Conteo de relés activos
- Conteo de relés dados de baja
- Conteo total de relés
- Visualización operacional de uso real

## Estado visual

Los modelos sin relés activos:

- continúan visibles
- aparecen visualmente atenuados
- mantienen trazabilidad histórica

---

# Gestión de Relés

## Funcionalidades implementadas

- Alta de relés
- Edición de relés
- Asociación con modelos
- Número de serie único
- Gestión de garantía
- Asociación logística
- Estado operacional actual
- Posición actual
- Destino actual
- Historial operativo
- Relación con movimientos
- Búsqueda por serial
- Búsqueda parcial
- Paginación
- Sorting dinámico

---

# Baja Lógica de Relés

## Funcionalidades implementadas

El sistema implementa:

```text
soft delete operacional
```

mediante:

- activo
- motivoBaja
- fechaBaja

## Beneficios

- preservación histórica
- trazabilidad completa
- integridad operacional
- protección de movimientos históricos
- auditoría futura

## Frontend

- botón "Dar de baja"
- dialog de confirmación
- motivo obligatorio
- visualización ACTIVO / BAJA
- filtros:
  - activos
  - inactivos
  - todos

## Backend

Endpoint:

```http
PATCH /api/reles/{id}/baja
```

---

# Gestión de Movimientos

## Concepto operacional

Los movimientos representan:

```text
eventos históricos operativos
```

y constituyen:

- la trazabilidad del equipo
- los cambios de estado
- los cambios de ubicación
- el historial técnico

---

# Funcionalidades implementadas

- Registro de movimientos
- Estados operativos
- Posiciones
- Destinos
- Responsable
- Fecha automática
- Notas operativas
- Historial operativo
- Orden descendente por fecha
- Timeline operacional básico

---

# UX Operacional Implementada

## Selector inteligente de relés

Se reemplazó el selector tradicional por:

```text
Autocomplete operacional
```

permitiendo búsqueda por:

- número de serie
- marca
- modelo
- tensión

## Visualización contextual

Formato visual:

```text
REL-001 | ABB | REL670 | 110-250 VCC
```

---

# Panel Contextual Operacional

Al seleccionar un relé:

el sistema muestra automáticamente:

- estado actual
- posición actual
- destino actual
- garantía
- marca
- modelo
- tensión

Esto reduce:

- errores operativos
- movimientos incorrectos
- ambigüedad operacional

---

# Historial por Relé

## Funcionalidades implementadas

- visualización histórica
- consulta por relé
- dialog operacional
- movimientos ordenados
- fechas formateadas
- notas operativas
- responsable
- estado histórico
- destino histórico

## Endpoint

```http
GET /api/reles/{id}/movimientos
```

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

## Ubicaciones

- /api/destinos

## Gestión logística

- /api/proveedores
- /api/remitos

## Usuarios

- /api/usuarios

---

# Endpoints Avanzados

## Relés

### Obtener relés paginados

```http
GET /api/reles?page=0&size=10
```

### Sorting dinámico

```http
GET /api/reles?page=0&size=10&sort=numeroSerie,asc
```

### Buscar serial exacto

```http
GET /api/reles/serial/REL-001
```

### Buscar serial parcial

```http
GET /api/reles/buscar?serial=REL
```

### Historial de movimientos

```http
GET /api/reles/{id}/movimientos
```

### Obtener relé por ID

```http
GET /api/reles/{id}
```

### Obtener estado actual

```http
GET /api/reles/{id}/estado-actual
```

### Filtrar por estado actual

```http
GET /api/reles/estado/{estado}
```

### Opciones frontend

```http
GET /api/reles/opciones
```

### Dar de baja

```http
PATCH /api/reles/{id}/baja
```

---

# Capacidades Backend

## Persistencia

- Hibernate/JPA
- PostgreSQL
- Spring Data JPA

## Arquitectura

- Arquitectura por capas
- DTOs desacoplados
- Bean Validation
- Exception Handling
- Responses REST profesionales

## REST API

- CRUD completo
- Status HTTP correctos
- JSON responses
- ResponseEntity

## Trazabilidad

- Historial de movimientos
- Estado actual derivado
- Posición actual derivada
- Tracking operativo
- Soft delete operacional

## Queries avanzadas

- búsqueda exacta por serial
- búsqueda parcial
- filtros por estado
- paginación
- sorting dinámico

---

# Capacidades Frontend

## Arquitectura

- React + TypeScript
- Arquitectura desacoplada
- React Router
- Axios centralizado
- Componentización

## UI/UX

- Material UI
- Theme institucional EPEC
- Navbar corporativa
- Branding Transmisión
- Formularios enterprise
- Selects dinámicos
- Autocomplete operacional
- Tablas operativas
- Historial contextual
- Chips operativos
- Feedback visual
- Loading states
- Dialogs operacionales

## Fullstack

- Consumo API real
- CRUD operativo
- Persistencia funcional
- Integración React ↔ Spring Boot

---

# Dashboard Futuro

## Métricas previstas

- Relés por estado
- Relés por destino
- Relés instalados
- Equipos en reparación
- Garantías próximas a vencer
- Últimos movimientos
- Modelos más utilizados
- Marcas más utilizadas

## Tecnologías previstas

- Recharts
- MUI Charts
- KPIs operativos

---

# Próximos Pasos

## Operación

- workflow de estados
- validaciones operacionales
- transiciones válidas
- auditoría automática

## Frontend

- Dashboard operativo
- DataGrid avanzado
- KPIs operativos
- filtros visuales
- timeline visual
- búsqueda avanzada

## Backend

- Soft delete global
- Auditoría automática
- Seguridad JWT
- Roles y permisos
- Optimización de queries

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
- Uso de migraciones incrementales
- No modificar migrations ejecutadas
- Separación entre lógica y persistencia
- Convención REST para endpoints

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

## Verificar compilación frontend

```bash
cd frontend
npm run build
```

---

## Frontend

```text
http://localhost:5173
```

---

## Swagger

```text
http://localhost:8082/swagger-ui/index.html
```

---

# Commit actual recomendado

```bash
git add .
git commit -m "feat: implementar trazabilidad operacional de relés"
```

---

# Autor

Proyecto desarrollado como iniciativa de modernización y digitalización operativa para el área de Protecciones y Teleoperación de EPEC Transmisión.