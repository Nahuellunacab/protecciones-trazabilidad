-- ============================================================
-- REDEFINICION DE LA MAQUINA DE ESTADOS
-- Ver docs/maquina-estados.md para el diseno completo y su
-- justificacion (mapeo con el proceso historico de Access).
-- ============================================================

-- ------------------------------------------------------------
-- 1. Limpieza de estados huerfanos
-- ------------------------------------------------------------
-- 'INSTALADO' fue insertado en V5 pero jamas formo parte de
-- ninguna transicion desde V15 en adelante (V29 solo referencia
-- 'EN STOCK', 'EN_SERVICIO', 'GARANTIA_PROVEEDOR' y 'RESERVA' por
-- nombre al importar el historial real). Se borra para poder
-- reutilizar el nombre 'INSTALADO' en el paso 2 sin violar la
-- constraint UNIQUE de estado.nombre.
DELETE FROM estado WHERE nombre = 'INSTALADO';

-- ------------------------------------------------------------
-- 2. Renombres (UPDATE conserva el id, no rompe ningun FK)
-- ------------------------------------------------------------
UPDATE estado SET nombre = 'EN_STOCK' WHERE nombre = 'EN STOCK';
UPDATE estado SET nombre = 'EN_REPARACION' WHERE nombre = 'EN REPARACION';
UPDATE estado SET nombre = 'EN_ENSAYO' WHERE nombre = 'ENSAYO';
UPDATE estado SET nombre = 'INSTALADO' WHERE nombre = 'EN_SERVICIO';

-- ------------------------------------------------------------
-- 3. Estados nuevos
-- ------------------------------------------------------------
INSERT INTO estado (nombre, descripcion)
VALUES
(
    'RECHAZADO',
    'No cumple la especificacion tecnica (PDCG) o el ensayo no fue aprobado'
)
ON CONFLICT DO NOTHING;

INSERT INTO estado (nombre, descripcion)
VALUES
(
    'PRESTADO',
    'Cedido temporalmente (ej. laboratorio) sin instalacion definitiva, se espera su devolucion'
)
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 4. Maquina de estados completa (reemplaza a V20)
-- ------------------------------------------------------------
DELETE FROM transicion_estado;

INSERT INTO transicion_estado
(estado_origen_id, estado_destino_id)
VALUES

-- EN_STOCK (estado inicial)
((SELECT id FROM estado WHERE nombre='EN_STOCK'),(SELECT id FROM estado WHERE nombre='EN_ENSAYO')),
((SELECT id FROM estado WHERE nombre='EN_STOCK'),(SELECT id FROM estado WHERE nombre='GARANTIA_PROVEEDOR')),
((SELECT id FROM estado WHERE nombre='EN_STOCK'),(SELECT id FROM estado WHERE nombre='APROBADO')),
((SELECT id FROM estado WHERE nombre='EN_STOCK'),(SELECT id FROM estado WHERE nombre='RESERVA')),
((SELECT id FROM estado WHERE nombre='EN_STOCK'),(SELECT id FROM estado WHERE nombre='BAJA')),

-- EN_ENSAYO
((SELECT id FROM estado WHERE nombre='EN_ENSAYO'),(SELECT id FROM estado WHERE nombre='APROBADO')),
((SELECT id FROM estado WHERE nombre='EN_ENSAYO'),(SELECT id FROM estado WHERE nombre='RECHAZADO')),
((SELECT id FROM estado WHERE nombre='EN_ENSAYO'),(SELECT id FROM estado WHERE nombre='GARANTIA_PROVEEDOR')),
((SELECT id FROM estado WHERE nombre='EN_ENSAYO'),(SELECT id FROM estado WHERE nombre='BAJA')),

-- RECHAZADO
((SELECT id FROM estado WHERE nombre='RECHAZADO'),(SELECT id FROM estado WHERE nombre='EN_ENSAYO')),
((SELECT id FROM estado WHERE nombre='RECHAZADO'),(SELECT id FROM estado WHERE nombre='BAJA')),

-- GARANTIA_PROVEEDOR
((SELECT id FROM estado WHERE nombre='GARANTIA_PROVEEDOR'),(SELECT id FROM estado WHERE nombre='APROBADO')),
((SELECT id FROM estado WHERE nombre='GARANTIA_PROVEEDOR'),(SELECT id FROM estado WHERE nombre='BAJA')),

-- APROBADO
((SELECT id FROM estado WHERE nombre='APROBADO'),(SELECT id FROM estado WHERE nombre='INSTALADO')),
((SELECT id FROM estado WHERE nombre='APROBADO'),(SELECT id FROM estado WHERE nombre='RESERVA')),
((SELECT id FROM estado WHERE nombre='APROBADO'),(SELECT id FROM estado WHERE nombre='PRESTADO')),
((SELECT id FROM estado WHERE nombre='APROBADO'),(SELECT id FROM estado WHERE nombre='BAJA')),

-- RESERVA
((SELECT id FROM estado WHERE nombre='RESERVA'),(SELECT id FROM estado WHERE nombre='INSTALADO')),
((SELECT id FROM estado WHERE nombre='RESERVA'),(SELECT id FROM estado WHERE nombre='PRESTADO')),
((SELECT id FROM estado WHERE nombre='RESERVA'),(SELECT id FROM estado WHERE nombre='BAJA')),

-- PRESTADO
((SELECT id FROM estado WHERE nombre='PRESTADO'),(SELECT id FROM estado WHERE nombre='INSTALADO')),
((SELECT id FROM estado WHERE nombre='PRESTADO'),(SELECT id FROM estado WHERE nombre='EN_STOCK')),
((SELECT id FROM estado WHERE nombre='PRESTADO'),(SELECT id FROM estado WHERE nombre='BAJA')),

-- INSTALADO
((SELECT id FROM estado WHERE nombre='INSTALADO'),(SELECT id FROM estado WHERE nombre='EN_REPARACION')),
((SELECT id FROM estado WHERE nombre='INSTALADO'),(SELECT id FROM estado WHERE nombre='GARANTIA_PROVEEDOR')),
((SELECT id FROM estado WHERE nombre='INSTALADO'),(SELECT id FROM estado WHERE nombre='BAJA')),

-- EN_REPARACION
((SELECT id FROM estado WHERE nombre='EN_REPARACION'),(SELECT id FROM estado WHERE nombre='EN_STOCK')),
((SELECT id FROM estado WHERE nombre='EN_REPARACION'),(SELECT id FROM estado WHERE nombre='GARANTIA_PROVEEDOR')),
((SELECT id FROM estado WHERE nombre='EN_REPARACION'),(SELECT id FROM estado WHERE nombre='BAJA'));
