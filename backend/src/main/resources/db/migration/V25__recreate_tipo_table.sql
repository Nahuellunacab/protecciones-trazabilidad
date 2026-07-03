-- V25: Asegura existencia de la tabla tipo para compatibilidad con entidades JPA

CREATE TABLE IF NOT EXISTS tipo (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR NOT NULL
);
