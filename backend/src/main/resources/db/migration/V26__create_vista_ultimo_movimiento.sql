-- ============================================================
-- VISTA: ultimo movimiento por rele
-- ============================================================
-- Centraliza el patron "ultimo movimiento por rele" (fecha desc,
-- id desc como desempate) que estaba duplicado como subquery
-- NOT EXISTS en varias @Query de MovimientoRepository/ReleRepository.
-- Se usa desde el dashboard para KPIs de solo lectura (por estado,
-- por destino) sin repetir la subquery correlacionada.
--
-- No reemplaza las consultas ya existentes usadas por la logica de
-- negocio (validacion de transiciones, busqueda paginada, etc.):
-- esas siguen intactas para no arriesgar romper flujos ya probados.
CREATE VIEW vw_ultimo_movimiento AS
SELECT m.*
FROM movimiento m
WHERE NOT EXISTS (
    SELECT 1
    FROM movimiento m2
    WHERE m2.rele_id = m.rele_id
      AND (
          m2.fecha_movimiento > m.fecha_movimiento
          OR (
              m2.fecha_movimiento = m.fecha_movimiento
              AND m2.id > m.id
          )
      )
);
