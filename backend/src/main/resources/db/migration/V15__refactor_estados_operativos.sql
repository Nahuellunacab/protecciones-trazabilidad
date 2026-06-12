INSERT INTO estado (nombre, descripcion)
VALUES
('APROBADO', 'Equipo aprobado luego de ensayo')
ON CONFLICT DO NOTHING;

INSERT INTO estado (nombre, descripcion)
VALUES
('GARANTIA_PROVEEDOR', 'Equipo enviado al proveedor por garantía')
ON CONFLICT DO NOTHING;

INSERT INTO estado (nombre, descripcion)
VALUES
('EN_SERVICIO', 'Equipo instalado y operativo')
ON CONFLICT DO NOTHING;

INSERT INTO estado (nombre, descripcion)
VALUES
('BAJA', 'Equipo retirado definitivamente')
ON CONFLICT DO NOTHING;

DELETE FROM transicion_estado;

INSERT INTO transicion_estado
(estado_origen_id, estado_destino_id)

SELECT eo.id, ed.id
FROM estado eo,
     estado ed

WHERE

(
 eo.nombre = 'INGRESADO'
 AND
 ed.nombre = 'ENSAYO'
)

OR

(
 eo.nombre = 'INGRESADO'
 AND
 ed.nombre = 'GARANTIA_PROVEEDOR'
)

OR

(
 eo.nombre = 'INGRESADO'
 AND
 ed.nombre = 'BAJA'
)

OR

(
 eo.nombre = 'ENSAYO'
 AND
 ed.nombre = 'APROBADO'
)

OR

(
 eo.nombre = 'ENSAYO'
 AND
 ed.nombre = 'BAJA'
)

OR

(
 eo.nombre = 'GARANTIA_PROVEEDOR'
 AND
 ed.nombre = 'APROBADO'
)

OR

(
 eo.nombre = 'GARANTIA_PROVEEDOR'
 AND
 ed.nombre = 'BAJA'
)

OR

(
 eo.nombre = 'APROBADO'
 AND
 ed.nombre = 'EN_SERVICIO'
)

OR

(
 eo.nombre = 'EN_SERVICIO'
 AND
 ed.nombre = 'BAJA'
);