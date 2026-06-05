INSERT INTO transicion_estado
(estado_origen_id, estado_destino_id)

SELECT eo.id, ed.id
FROM estado eo,
     estado ed

WHERE

(
    eo.nombre = 'EN STOCK'
    AND
    ed.nombre = 'INSTALADO'
)

OR
(
    eo.nombre = 'EN STOCK'
    AND
    ed.nombre = 'EN REPARACION'
)

OR
(
    eo.nombre = 'EN STOCK'
    AND
    ed.nombre = 'EN ENSAYO'
)

OR
(
    eo.nombre = 'INSTALADO'
    AND
    ed.nombre = 'EN STOCK'
)

OR
(
    eo.nombre = 'EN REPARACION'
    AND
    ed.nombre = 'EN STOCK'
)

OR
(
    eo.nombre = 'EN ENSAYO'
    AND
    ed.nombre = 'EN STOCK'
);