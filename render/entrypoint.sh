#!/bin/sh
# =====================================================================
# Entrypoint do Zoop (Render / docker-compose):
#  1. sobe o backend Spring Boot em background (porta ${SERVER_PORT})
#  2. sobe o frontend Vinext em background (porta ${VINEXT_PORT})
#  3. sobe o nginx em primeiro plano (mantem o container vivo)
# =====================================================================
set -e

JAVA_OPTS="${JAVA_OPTS:--Xmx256m -XX:MaxRAMPercentage=50}"
SERVER_PORT="${SERVER_PORT:-8090}"
VINEXT_PORT="${VINEXT_PORT:-3000}"

echo "[zoop] Iniciando backend (java ${JAVA_OPTS}) na porta ${SERVER_PORT}..."
java ${JAVA_OPTS} -jar /app/app.jar &
BACK_PID=$!

echo "[zoop] Aguardando o backend responder em http://localhost:${SERVER_PORT}/ ..."
i=0
until curl -fs "http://localhost:${SERVER_PORT}/" >/dev/null 2>&1; do
  i=$((i + 1))
  if [ "${BACK_PID}" -gt 0 ] && ! kill -0 "${BACK_PID}" 2>/dev/null; then
    echo "[zoop] ERRO: backend encerrou antes de responder."
    exit 1
  fi
  if [ "${i}" -ge 120 ]; then
    echo "[zoop] AVISO: backend ainda nao respondeu; seguindo mesmo assim."
    break
  fi
  sleep 1
done

echo "[zoop] Iniciando frontend vinext na porta ${VINEXT_PORT}..."
node_modules/.bin/vinext start --port "${VINEXT_PORT}" >/tmp/vinext.log 2>&1 &
FRONT_PID=$!

echo "[zoop] Aguardando o frontend responder em http://localhost:${VINEXT_PORT}/ ..."
i=0
until curl -fs "http://localhost:${VINEXT_PORT}/" >/dev/null 2>&1; do
  i=$((i + 1))
  if [ "${FRONT_PID}" -gt 0 ] && ! kill -0 "${FRONT_PID}" 2>/dev/null; then
    echo "[zoop] ERRO: frontend encerrou antes de responder. Log:"
    tail -30 /tmp/vinext.log || true
    exit 1
  fi
  if [ "${i}" -ge 120 ]; then
    echo "[zoop] AVISO: frontend ainda nao respondeu; seguindo mesmo assim."
    break
  fi
  sleep 1
done

echo "[zoop] Iniciando nginx..."

# Render injeta PORT (padrao 10000); usa 80 como fallback (docker local)
export PORT="${PORT:-80}"
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp \
  && mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

echo "[zoop] nginx escutando na porta ${PORT}"
exec nginx -g "daemon off;"