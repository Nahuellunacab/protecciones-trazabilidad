CREATE TABLE orden_provision (

    id BIGSERIAL PRIMARY KEY,

    numero VARCHAR(100)
        NOT NULL UNIQUE,

    observaciones VARCHAR(500),

    activo BOOLEAN
        NOT NULL DEFAULT TRUE
);