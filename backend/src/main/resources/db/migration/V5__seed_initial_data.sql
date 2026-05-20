INSERT INTO provincia (
    nombre
)
VALUES (
    'Córdoba'
);

INSERT INTO localidad (
    nombre,
    provincia_id
)
VALUES (
    'Córdoba Capital',
    1
);

INSERT INTO destino (
    nombre,
    localidad_id
)
VALUES (
    'Depósito Central',
    1
);

INSERT INTO posicion (
    nombre,
    etiqueta,
    destino_id
)
VALUES (
    'Estantería A',
    'A-01',
    1
);

INSERT INTO usuario (
    nombre,
    apellido,
    email
)
VALUES (
    'Sistema',
    'Backend',
    'sistema@local'
);

INSERT INTO marca (
    nombre
)
VALUES (
    'ABB'
);

INSERT INTO tipo (
    nombre
)
VALUES (
    'Protección'
);

INSERT INTO modelo (
    nombre,
    tension,
    marca_id,
    tipo_id
)
VALUES (
    'REL670',
    '125VCC',
    1,
    1
);

INSERT INTO estado (
    nombre,
    descripcion
)
VALUES
(
    'EN STOCK',
    'Equipo disponible'
),
(
    'INSTALADO',
    'Equipo instalado'
),
(
    'EN REPARACION',
    'Equipo enviado a reparación'
);

INSERT INTO proveedor (
    nombre,
    telefono,
    domicilio,
    localidad_id
)
VALUES (
    'ABB Argentina',
    '351000000',
    'Av Siempre Viva 123',
    1
);

INSERT INTO remito (
    numero_remito,
    fecha,
    proveedor_id
)
VALUES (
    'REM-001',
    CURRENT_DATE,
    1
);

INSERT INTO rele (
    numero_serie,
    garantia_meses,
    modelo_id,
    remito_id
)
VALUES (
    'REL-001',
    12,
    1,
    1
);