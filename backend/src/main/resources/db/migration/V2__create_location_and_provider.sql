CREATE TABLE localidad (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,

    provincia_id BIGINT NOT NULL,

    CONSTRAINT fk_localidad_provincia
        FOREIGN KEY (provincia_id)
        REFERENCES provincia(id)
);

CREATE TABLE proveedor (
    id BIGSERIAL PRIMARY KEY,

    nombre VARCHAR(150) NOT NULL,
    domicilio VARCHAR(250),
    telefono VARCHAR(50),

    localidad_id BIGINT,

    CONSTRAINT fk_proveedor_localidad
        FOREIGN KEY (localidad_id)
        REFERENCES localidad(id)
);

CREATE TABLE destino (
    id BIGSERIAL PRIMARY KEY,

    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(250),
    telefono VARCHAR(50),
    coordenadas VARCHAR(150),

    localidad_id BIGINT NOT NULL,

    CONSTRAINT fk_destino_localidad
        FOREIGN KEY (localidad_id)
        REFERENCES localidad(id)
);

CREATE TABLE posicion (
    id BIGSERIAL PRIMARY KEY,

    nombre VARCHAR(150) NOT NULL,
    etiqueta VARCHAR(100),

    destino_id BIGINT NOT NULL,

    CONSTRAINT fk_posicion_destino
        FOREIGN KEY (destino_id)
        REFERENCES destino(id)
);