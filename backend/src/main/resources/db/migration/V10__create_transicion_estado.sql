CREATE TABLE transicion_estado (

    id BIGSERIAL PRIMARY KEY,

    estado_origen_id BIGINT NOT NULL,

    estado_destino_id BIGINT NOT NULL,

    CONSTRAINT fk_transicion_origen
        FOREIGN KEY (estado_origen_id)
        REFERENCES estado(id),

    CONSTRAINT fk_transicion_destino
        FOREIGN KEY (estado_destino_id)
        REFERENCES estado(id)
);

INSERT INTO transicion_estado
(estado_origen_id, estado_destino_id)

SELECT eo.id, ed.id
FROM estado eo,
     estado ed

WHERE
(
    eo.nombre = 'DISPONIBLE'
    AND
    ed.nombre = 'INSTALADO'
)

OR
(
    eo.nombre = 'INSTALADO'
    AND
    ed.nombre = 'REPARACION'
)

OR
(
    eo.nombre = 'REPARACION'
    AND
    ed.nombre = 'ENSAYO'
)

OR
(
    eo.nombre = 'ENSAYO'
    AND
    ed.nombre = 'DISPONIBLE'
);