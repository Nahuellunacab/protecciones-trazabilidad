ALTER TABLE usuario ADD COLUMN password_hash VARCHAR(255);

ALTER TABLE usuario ADD COLUMN rol VARCHAR(20) NOT NULL DEFAULT 'AUDITOR'
    CHECK (rol IN ('ADMIN', 'AUDITOR'));

ALTER TABLE usuario ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE;

-- Usuario "sistema" (id=1, sistema@local) se conserva sin password_hash: no puede loguearse,
-- solo existe por integridad referencial de movimientos historicos ya insertados.

INSERT INTO usuario (
    nombre,
    apellido,
    email,
    password_hash,
    rol
)
VALUES (
    'Admin',
    'EPEC',
    'admin@epec.local',
    '$2a$10$BCOzyV3EmoeH3B2OGrYXk.VXZz/0KlqlHZbL8NcdYVjYzEu6e0zTW',
    'ADMIN'
);
