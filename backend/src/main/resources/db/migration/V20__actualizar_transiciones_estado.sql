-- ============================================================
-- REDEFINICION DE TRANSICIONES DE ESTADO
-- Workflow Protecciones EPEC
-- ============================================================
-- Los ids se resuelven por nombre (no hardcodeados) porque la
-- numeracion real de la tabla estado no coincide con el orden
-- en que estos estados fueron mencionados historicamente.

DELETE FROM transicion_estado;

INSERT INTO transicion_estado
(estado_origen_id, estado_destino_id)
VALUES

-- ------------------------------------------------------------
-- EN STOCK (estado inicial)
-- ------------------------------------------------------------
((SELECT id FROM estado WHERE nombre='EN STOCK'),(SELECT id FROM estado WHERE nombre='ENSAYO')),
((SELECT id FROM estado WHERE nombre='EN STOCK'),(SELECT id FROM estado WHERE nombre='GARANTIA_PROVEEDOR')),
((SELECT id FROM estado WHERE nombre='EN STOCK'),(SELECT id FROM estado WHERE nombre='APROBADO')),
((SELECT id FROM estado WHERE nombre='EN STOCK'),(SELECT id FROM estado WHERE nombre='RESERVA')),
((SELECT id FROM estado WHERE nombre='EN STOCK'),(SELECT id FROM estado WHERE nombre='BAJA')),

-- ------------------------------------------------------------
-- ENSAYO
-- ------------------------------------------------------------
((SELECT id FROM estado WHERE nombre='ENSAYO'),(SELECT id FROM estado WHERE nombre='APROBADO')),
((SELECT id FROM estado WHERE nombre='ENSAYO'),(SELECT id FROM estado WHERE nombre='GARANTIA_PROVEEDOR')),
((SELECT id FROM estado WHERE nombre='ENSAYO'),(SELECT id FROM estado WHERE nombre='BAJA')),

-- ------------------------------------------------------------
-- GARANTIA PROVEEDOR
-- ------------------------------------------------------------
((SELECT id FROM estado WHERE nombre='GARANTIA_PROVEEDOR'),(SELECT id FROM estado WHERE nombre='APROBADO')),
((SELECT id FROM estado WHERE nombre='GARANTIA_PROVEEDOR'),(SELECT id FROM estado WHERE nombre='BAJA')),

-- ------------------------------------------------------------
-- APROBADO
-- ------------------------------------------------------------
((SELECT id FROM estado WHERE nombre='APROBADO'),(SELECT id FROM estado WHERE nombre='EN_SERVICIO')),
((SELECT id FROM estado WHERE nombre='APROBADO'),(SELECT id FROM estado WHERE nombre='RESERVA')),
((SELECT id FROM estado WHERE nombre='APROBADO'),(SELECT id FROM estado WHERE nombre='BAJA')),

-- ------------------------------------------------------------
-- RESERVA
-- ------------------------------------------------------------
((SELECT id FROM estado WHERE nombre='RESERVA'),(SELECT id FROM estado WHERE nombre='EN_SERVICIO')),
((SELECT id FROM estado WHERE nombre='RESERVA'),(SELECT id FROM estado WHERE nombre='BAJA')),

-- ------------------------------------------------------------
-- EN SERVICIO
-- ------------------------------------------------------------
((SELECT id FROM estado WHERE nombre='EN_SERVICIO'),(SELECT id FROM estado WHERE nombre='EN REPARACION')),
((SELECT id FROM estado WHERE nombre='EN_SERVICIO'),(SELECT id FROM estado WHERE nombre='BAJA')),

-- ------------------------------------------------------------
-- EN REPARACION
-- ------------------------------------------------------------
((SELECT id FROM estado WHERE nombre='EN REPARACION'),(SELECT id FROM estado WHERE nombre='EN STOCK')),
((SELECT id FROM estado WHERE nombre='EN REPARACION'),(SELECT id FROM estado WHERE nombre='BAJA'));
