-- La unicidad de numero_remito solo se validaba en Java
-- (RemitoService.validarDuplicado, case-insensitive), sin respaldo en la
-- base: dos altas simultaneas con el mismo numero podian colar dos filas
-- duplicadas. Se agrega un indice UNICO funcional sobre
-- UPPER(TRIM(numero_remito)) (mismo criterio case-insensitive que ya usa
-- el Service) sin normalizar los valores ya cargados: son textos
-- descriptivos libres ("Licitacion Diferencial Trafos 06/2013"), no
-- codigos cortos como rele.numero_serie, y forzarlos a mayusculas
-- degradaria su legibilidad en pantalla.
CREATE UNIQUE INDEX uk_remito_numero_remito
    ON remito (UPPER(TRIM(numero_remito)));
