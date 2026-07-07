ALTER TABLE usuario DROP CONSTRAINT usuario_rol_check;

ALTER TABLE usuario ADD CONSTRAINT usuario_rol_check
    CHECK (rol IN ('ADMIN', 'OPERADOR', 'AUDITOR'));

ALTER TABLE usuario ADD COLUMN numero_sobre VARCHAR(50);

-- Placeholder para los usuarios ya existentes (no tienen legajo real cargado):
-- se usa el propio id como valor temporal, unico por definicion. Reemplazar por
-- el numero de sobre real de cada persona desde /admin/usuarios.
UPDATE usuario SET numero_sobre = id::text WHERE numero_sobre IS NULL;

ALTER TABLE usuario ALTER COLUMN numero_sobre SET NOT NULL;

ALTER TABLE usuario ADD CONSTRAINT usuario_numero_sobre_key UNIQUE (numero_sobre);
