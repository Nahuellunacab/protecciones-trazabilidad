-- Se elimina "Tipo" y los atributos técnicos de tensión del modelo de negocio:
-- Modelo ya no distingue por tipo ni rango de tensión, solo por nombre y marca.
ALTER TABLE modelo
DROP COLUMN tipo_id;

ALTER TABLE modelo
DROP COLUMN tension_desde;

ALTER TABLE modelo
DROP COLUMN tension_hasta;

ALTER TABLE modelo
DROP COLUMN tipo_tension;

DROP TABLE tipo;
