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

CREATE TABLE remito (
    id BIGSERIAL PRIMARY KEY,

    numero_remito VARCHAR(100) NOT NULL,
    fecha DATE,

    archivo_nombre VARCHAR(255),
    archivo_ruta VARCHAR(500),

    proveedor_id BIGINT NOT NULL,

    CONSTRAINT fk_remito_proveedor
        FOREIGN KEY (proveedor_id)
        REFERENCES proveedor(id)
);

CREATE TABLE rele (
    id BIGSERIAL PRIMARY KEY,

    numero_serie VARCHAR(150) NOT NULL UNIQUE,

    garantia_meses INTEGER,

    inicio_garantia DATE,
    fin_garantia DATE,

    modelo_id BIGINT NOT NULL,
    remito_id BIGINT,

    CONSTRAINT fk_rele_modelo
        FOREIGN KEY (modelo_id)
        REFERENCES modelo(id),

    CONSTRAINT fk_rele_remito
        FOREIGN KEY (remito_id)
        REFERENCES remito(id)
);