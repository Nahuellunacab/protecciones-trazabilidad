#!/bin/sh
# Corre dentro del servicio "backup" (docker-compose.prod.yml), con la imagen
# postgres:16 (trae pg_dump/psql). Hace un dump diario de la base a
# docker/backups/ (carpeta del host, montada como bind mount) y borra los
# dumps más viejos que BACKUP_RETENTION_DIAS (default 14).
#
# Restaurar un dump:
#   gunzip -c docker/backups/protecciones_AAAAMMDD_HHMMSS.sql.gz | \
#     docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME"

set -e

RETENCION="${BACKUP_RETENTION_DIAS:-14}"

echo "Servicio de backup iniciado (retención: ${RETENCION} días)."

while true; do
  ARCHIVO="/backups/protecciones_$(date +%Y%m%d_%H%M%S).sql.gz"

  echo "Generando backup: $ARCHIVO"

  if pg_dump -h postgres -U "$DB_USER" -d "$DB_NAME" | gzip > "$ARCHIVO"; then
    echo "Backup OK: $ARCHIVO"
  else
    echo "ERROR generando el backup $ARCHIVO" >&2
    rm -f "$ARCHIVO"
  fi

  find /backups -name "protecciones_*.sql.gz" -mtime "+${RETENCION}" -delete

  sleep 86400
done
