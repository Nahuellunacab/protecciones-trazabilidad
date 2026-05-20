CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,

    email VARCHAR(150) UNIQUE
);

CREATE TABLE movimiento (
    id BIGSERIAL PRIMARY KEY,

    fecha_movimiento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    notas TEXT,

    rele_id BIGINT NOT NULL,
    estado_id BIGINT NOT NULL,
    posicion_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,

    CONSTRAINT fk_movimiento_rele
        FOREIGN KEY (rele_id)
        REFERENCES rele(id),

    CONSTRAINT fk_movimiento_estado
        FOREIGN KEY (estado_id)
        REFERENCES estado(id),

    CONSTRAINT fk_movimiento_posicion
        FOREIGN KEY (posicion_id)
        REFERENCES posicion(id),

    CONSTRAINT fk_movimiento_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
);