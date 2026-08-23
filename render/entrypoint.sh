#!/bin/sh
# =====================================================================
# Entrypoint do PetLink (Render):
#  1. sobe o backend Spring Boot em background
#  2. aguarda o backend responder
#  3. sobe o nginx em primeiro plano (mantem o container vivo)
# =====================================================================
set -e

JAVA_OPTS="${JAVA_OPTS:--Xmx256m -XX:MaxRAMPercentage=50}"

echo "[petlink] Iniciando backend (java ${JAVA_OPTS})..."
java ${JAVA_OPTS} -jar /app/app.jar &
BACK_PID=$!

cleanup() {
  echo "[petlink] Encerrando backend (pid ${BACK_PID})..."
  kill "${BACK_PID}" 2>/dev/null || true
}
trap cleanup EXIT TERM INT

echo "[petlink] Aguardando o backend responder em http://localhost:8090/ ..."
i=0
until curl -fs http://localhost:8090/ >/dev/null 2>&1; do
  i=$((i + 1))
  if [ "${BACK_PID}" -gt 0 ] && ! kill -0 "${BACK_PID}" 2>/dev/null; then
    echo "[petlink] ERRO: backend encerrou antes de responder."
    exit 1
  fi
  if [ "${i}" -ge 120 ]; then
    echo "[petlink] AVISO: backend ainda nao respondeu; iniciando nginx mesmo assim."
    break
  fi
  sleep 1
done

echo "[petlink] Iniciando nginx..."

# Render injeta PORT (padrao 10000); usa 80 como fallback (docker local)
export PORT="${PORT:-80}"
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp \
  && mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

echo "[petlink] nginx escutando na porta ${PORT}"
exec nginx -g "daemon off;"