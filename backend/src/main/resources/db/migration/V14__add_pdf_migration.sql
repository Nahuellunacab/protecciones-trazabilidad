ALTER TABLE remito
ADD COLUMN nombre_archivo VARCHAR(255);

ALTER TABLE remito
ADD COLUMN ruta_archivo VARCHAR(500);

ALTER TABLE orden_provision
ADD COLUMN nombre_archivo VARCHAR(255);

ALTER TABLE orden_provision
ADD COLUMN ruta_archivo VARCHAR(500);