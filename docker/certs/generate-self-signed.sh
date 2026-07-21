#!/bin/sh
# Genera un certificado autofirmado para el proxy TLS de producción
# (docker/nginx/proxy.conf). Pensado para acceso solo por red interna, sin
# dominio público (no aplica Let's Encrypt, que necesita validar un dominio).
#
# Uso:
#   ./generate-self-signed.sh <CN>
#
# <CN> es el nombre o IP con el que los usuarios van a acceder al sistema
# (ej. "protecciones.epec.local" o "10.20.30.40"). Correrlo de nuevo
# sobrescribe el certificado anterior (ej. si cambia la IP del servidor).
#
# El navegador va a mostrar una advertencia de "certificado no confiable" al
# entrar la primera vez, porque no lo firmó una CA pública — es esperable en
# este escenario. Para evitarlo habría que instalar server.crt como
# certificado de confianza en cada máquina cliente, o tener una CA interna.

set -e

CN="${1:?Uso: ./generate-self-signed.sh <hostname-o-ip-del-servidor>}"
DIR="$(cd "$(dirname "$0")" && pwd)"

# El SAN tiene que ser del tipo correcto (IP vs DNS) para que el navegador lo
# acepte: si $CN parece una IPv4, se genera como IP; si no, como DNS.
case "$CN" in
  [0-9]*.[0-9]*.[0-9]*.[0-9]*)
    SAN="IP:$CN"
    ;;
  *)
    SAN="DNS:$CN"
    ;;
esac

openssl req \
  -x509 \
  -nodes \
  -newkey rsa:2048 \
  -days 825 \
  -keyout "$DIR/server.key" \
  -out "$DIR/server.crt" \
  -subj "/CN=$CN" \
  -addext "subjectAltName=$SAN"

chmod 600 "$DIR/server.key"

echo "Certificado generado en $DIR (CN=$CN, valido 825 dias)."
echo "Reiniciar el servicio proxy para que lo tome: docker compose -f docker-compose.yml -f docker-compose.prod.yml restart proxy"
