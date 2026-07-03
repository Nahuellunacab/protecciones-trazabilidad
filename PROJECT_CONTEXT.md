Sistema: Protecciones Trazabilidad
Objetivo: Reemplazar base Access usada por EPEC.
Stack Backend:
- Java 21
- Spring Boot
- Hibernate
- JPA
- Flyway
Frontend:
- React
- TypeScript
- MUI
Base de datos:
- PostgreSQL 16
- Docker Compose
Entidades:
- Rele
- Movimiento
- Estado
- Posicion
- Modelo
- Marca
- Tipo
- Remito
- OrdenProvision
Reglas:
- Un rele tiene historial de movimientos
- Estado actual depende del ultimo movimiento
- PDFs se almacenan en servidor local
- Existe trazabilidad completa
- Se planea agregar JWT
