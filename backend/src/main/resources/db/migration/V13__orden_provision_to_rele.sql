ALTER TABLE rele
ADD COLUMN orden_provision_id BIGINT;

ALTER TABLE rele
ADD CONSTRAINT fk_rele_orden_provision
FOREIGN KEY (orden_provision_id)
REFERENCES orden_provision(id);