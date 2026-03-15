# explorer.minebtcz.com
# BTCZ Explorer

Core minimal, RPC-only, sans SQL.

## Quick start

```bash
cp .env.example .env
chmod +x setup.sh
./setup.sh
docker compose up -d


Stop + remove des conteneurs explorer seulement

Depuis le dossier du projet :

cd ~/btcz-explorer-v2
docker compose down

Si tu veux être extra sûr par noms exacts :

docker stop btcz-explorer btcz-explorer-nginx 2>/dev/null || true
docker rm -f btcz-explorer btcz-explorer-nginx 2>/dev/null || true
Supprimer l’image locale utilisée par l’explorer seulement

Ça supprime l’image Node et Nginx si elles ne sont pas utilisées par d’autres conteneurs :

docker image rm node:20-alpine nginx:alpine 2>/dev/null || true
Supprimer le réseau Docker de l’explorer seulement
docker network rm btcz-explorer-net 2>/dev/null || true
Supprimer le dossier projet si tu veux repartir à neuf
rm -rf ~/btcz-explorer-v2
