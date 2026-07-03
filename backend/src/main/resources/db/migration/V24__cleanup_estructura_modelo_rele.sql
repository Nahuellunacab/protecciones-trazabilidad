-- ============================================
-- LIMPIEZA DE ESTRUCTURA OBSOLETA DE MODELOS
-- Se elimina configuracion_modelo, tipo y
-- atributos técnicos ya no utilizados
-- ============================================


-- --------------------------------------------
-- 1. Eliminar FK desde rele hacia configuracion_modelo
-- --------------------------------------------

ALTER TABLE rele
DROP COLUMN configuracion_modelo_id;


-- --------------------------------------------
-- 2. Eliminar tabla configuracion_modelo
-- --------------------------------------------

DROP TABLE configuracion_modelo;


-- --------------------------------------------
-- 3. Eliminar FK desde modelo hacia tipo
-- --------------------------------------------

ALTER TABLE modelo
DROP COLUMN tipo_id;


-- --------------------------------------------
-- 4. Eliminar atributos técnicos de modelo
-- --------------------------------------------

ALTER TABLE modelo
DROP COLUMN tension_desde;

ALTER TABLE modelo
DROP COLUMN tension_hasta;

ALTER TABLE modelo
DROP COLUMN tipo_tension;


-- --------------------------------------------
-- 5. Eliminar tabla tipo
-- --------------------------------------------

DROP TABLE tipo;