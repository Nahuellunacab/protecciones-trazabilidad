-- Los datos importados en V17/V18 (modelo.tipo_id) referencian los ids 6, 7, 8 y 9
-- de la tabla tipo, que nunca fueron insertados por una migracion. Se agregan aqui
-- con nombres provisorios para no romper el orden de ids esperado por esas migraciones;
-- renombrar desde el CRUD de Tipos una vez identificado el tipo real de cada uno.
INSERT INTO tipo (nombre)
VALUES
('TIPO 6'),
('TIPO 7'),
('TIPO 8'),
('TIPO 9');
