ALTER TABLE modelo
DROP COLUMN tension;

ALTER TABLE modelo
ADD COLUMN tension_desde INTEGER;

ALTER TABLE modelo
ADD COLUMN tension_hasta INTEGER;

ALTER TABLE modelo
ADD COLUMN tipo_tension VARCHAR(10);