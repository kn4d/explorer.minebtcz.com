#!/usr/bin/env bash
set -e

echo "=== BTCZ Explorer Setup ==="
echo

read -rp "BTCZ RPC username: " RPC_USER
read -rsp "BTCZ RPC password: " RPC_PASS
echo
read -rp "Explorer domain [explorer.minebtcz.com]: " APP_DOMAIN
APP_DOMAIN=${APP_DOMAIN:-explorer.minebtcz.com}

cat > .env <<EOF
APP_NAME=btcz-explorer
APP_ENV=production
APP_PORT=8080

APP_DOMAIN=${APP_DOMAIN}
TZ=America/Montreal

BTCZ_RPC_HOST=host.docker.internal
BTCZ_RPC_PORT=1979
BTCZ_RPC_USER=${RPC_USER}
BTCZ_RPC_PASSWORD=${RPC_PASS}

DOCKER_HOST_GATEWAY=host-gateway
DOCKER_NETWORK_NAME=btcz-explorer-net
DOCKER_SUBNET=172.21.0.0/16

DEFAULT_THEME=soft-dark
ENABLE_EYE_COMFORT=true
ENABLE_ANIMATIONS=false
EOF

echo
echo ".env créé."
echo
echo "IMPORTANT:"
echo "1) Premier boot: docker compose up -d"
echo "2) Vérifier le subnet Docker:"
echo "   docker network inspect btcz-explorer-net --format '{{range .IPAM.Config}}{{.Subnet}}{{end}}'"
echo "3) Ajouter ce subnet dans bitcoinz.conf avec rpcallowip="
echo "4) Redémarrer bitcoinzd"
echo "5) Relancer: docker compose down && docker compose up -d"
