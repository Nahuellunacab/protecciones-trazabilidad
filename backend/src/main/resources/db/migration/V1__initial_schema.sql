CREATE TABLE tipo (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE marca (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE modelo (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    tension VARCHAR(50),

    tipo_id BIGINT NOT NULL,
    marca_id BIGINT NOT NULL,

    CONSTRAINT fk_modelo_tipo
        FOREIGN KEY (tipo_id)
        REFERENCES tipo(id),

    CONSTRAINT fk_modelo_marca
        FOREIGN KEY (marca_id)
        REFERENCES marca(id)
);