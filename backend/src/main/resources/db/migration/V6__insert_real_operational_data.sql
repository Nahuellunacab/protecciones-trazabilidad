-- =====================================================
-- NUEVOS TIPOS
-- =====================================================

INSERT INTO tipo (nombre)
VALUES
('DISTANCIA')
ON CONFLICT DO NOTHING;

INSERT INTO tipo (nombre)
VALUES
('DIFERENCIAL')
ON CONFLICT DO NOTHING;

INSERT INTO tipo (nombre)
VALUES
('SOBRECORRIENTE')
ON CONFLICT DO NOTHING;

INSERT INTO tipo (nombre)
VALUES
('CONTROL')
ON CONFLICT DO NOTHING;

-- =====================================================
-- NUEVAS MARCAS
-- =====================================================

INSERT INTO marca (nombre)
VALUES
('SIEMENS')
ON CONFLICT DO NOTHING;

INSERT INTO marca (nombre)
VALUES
('GE')
ON CONFLICT DO NOTHING;

INSERT INTO marca (nombre)
VALUES
('AREVA')
ON CONFLICT DO NOTHING;

INSERT INTO marca (nombre)
VALUES
('SCHNEIDER')
ON CONFLICT DO NOTHING;

-- =====================================================
-- DESTINOS
-- =====================================================

INSERT INTO destino (
    nombre,
    localidad_id
)
VALUES
(
    'ET MALVINAS',
    1
)
ON CONFLICT DO NOTHING;

INSERT INTO destino (
    nombre,
    localidad_id
)
VALUES
(
    'ET ALMAFUERTE',
    1
)
ON CONFLICT DO NOTHING;

INSERT INTO destino (
    nombre,
    localidad_id
)
VALUES
(
    'ET ARROYO CABRAL',
    1
)
ON CONFLICT DO NOTHING;

INSERT INTO destino (
    nombre,
    localidad_id
)
VALUES
(
    'LABORATORIO',
    1
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- POSICIONES
-- =====================================================

INSERT INTO posicion (
    nombre,
    etiqueta,
    destino_id
)
VALUES
(
    'PANEL LINEA 1',

    'PL1',

    (
        SELECT id
        FROM destino
        WHERE nombre = 'ET MALVINAS'
    )
)
ON CONFLICT DO NOTHING;

INSERT INTO posicion (
    nombre,
    etiqueta,
    destino_id
)
VALUES
(
    'PANEL LINEA 2',

    'PL2',

    (
        SELECT id
        FROM destino
        WHERE nombre = 'ET MALVINAS'
    )
)
ON CONFLICT DO NOTHING;

INSERT INTO posicion (
    nombre,
    etiqueta,
    destino_id
)
VALUES
(
    'TRANSFORMADOR T1',

    'T1',

    (
        SELECT id
        FROM destino
        WHERE nombre = 'ET ALMAFUERTE'
    )
)
ON CONFLICT DO NOTHING;

INSERT INTO posicion (
    nombre,
    etiqueta,
    destino_id
)
VALUES
(
    'BANCO ENSAYO',

    'LAB-01',

    (
        SELECT id
        FROM destino
        WHERE nombre = 'LABORATORIO'
    )
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- NUEVOS ESTADOS
-- =====================================================

INSERT INTO estado (
    nombre,
    descripcion
)
VALUES
(
    'ENSAYO',
    'Equipo en pruebas'
)
ON CONFLICT DO NOTHING;

INSERT INTO estado (
    nombre,
    descripcion
)
VALUES
(
    'RESERVA',
    'Equipo de backup'
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- NUEVOS MODELOS
-- =====================================================

INSERT INTO modelo (
    nombre,
    tension,
    marca_id,
    tipo_id
)
VALUES
(
    'REG670',

    '125VCC',

    (
        SELECT id
        FROM marca
        WHERE nombre = 'ABB'
    ),

    (
        SELECT id
        FROM tipo
        WHERE nombre = 'DIFERENCIAL'
    )
)
ON CONFLICT DO NOTHING;

INSERT INTO modelo (
    nombre,
    tension,
    marca_id,
    tipo_id
)
VALUES
(
    'SIPROTEC 5',

    '110VCC',

    (
        SELECT id
        FROM marca
        WHERE nombre = 'SIEMENS'
    ),

    (
        SELECT id
        FROM tipo
        WHERE nombre = 'DISTANCIA'
    )
)
ON CONFLICT DO NOTHING;

INSERT INTO modelo (
    nombre,
    tension,
    marca_id,
    tipo_id
)
VALUES
(
    'MiCOM P442',

    '125VCC',

    (
        SELECT id
        FROM marca
        WHERE nombre = 'AREVA'
    ),

    (
        SELECT id
        FROM tipo
        WHERE nombre = 'SOBRECORRIENTE'
    )
)
ON CONFLICT DO NOTHING;

INSERT INTO modelo (
    nombre,
    tension,
    marca_id,
    tipo_id
)
VALUES
(
    'MULTILIN 850',

    '125VCC',

    (
        SELECT id
        FROM marca
        WHERE nombre = 'GE'
    ),

    (
        SELECT id
        FROM tipo
        WHERE nombre = 'CONTROL'
    )
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- NUEVOS REMITOS
-- =====================================================

INSERT INTO remito (
    numero_remito,
    fecha,
    proveedor_id
)
VALUES
(
    'REM-002',
    CURRENT_DATE,
    1
)
ON CONFLICT DO NOTHING;

INSERT INTO remito (
    numero_remito,
    fecha,
    proveedor_id
)
VALUES
(
    'REM-003',
    CURRENT_DATE,
    1
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- NUEVOS RELES
-- =====================================================

INSERT INTO rele (
    numero_serie,
    garantia_meses,
    modelo_id,
    remito_id
)
VALUES
(
    'REL-ABB-002',

    24,

    (
        SELECT id
        FROM modelo
        WHERE nombre = 'REG670'
    ),

    1
)
ON CONFLICT DO NOTHING;

INSERT INTO rele (
    numero_serie,
    garantia_meses,
    modelo_id,
    remito_id
)
VALUES
(
    'REL-SIE-001',

    36,

    (
        SELECT id
        FROM modelo
        WHERE nombre = 'SIPROTEC 5'
    ),

    2
)
ON CONFLICT DO NOTHING;

INSERT INTO rele (
    numero_serie,
    garantia_meses,
    modelo_id,
    remito_id
)
VALUES
(
    'REL-ARE-001',

    24,

    (
        SELECT id
        FROM modelo
        WHERE nombre = 'MiCOM P442'
    ),

    2
)
ON CONFLICT DO NOTHING;

INSERT INTO rele (
    numero_serie,
    garantia_meses,
    modelo_id,
    remito_id
)
VALUES
(
    'REL-GE-001',

    12,

    (
        SELECT id
        FROM modelo
        WHERE nombre = 'MULTILIN 850'
    ),

    1
)
ON CONFLICT DO NOTHING;