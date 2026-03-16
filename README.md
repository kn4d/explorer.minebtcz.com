BitcoinZ Explorer
explorer.minebtcz.com

Minimal, modular and Docker-ready explorer for BitcoinZ (BTCZ).

Features:

Fast RPC explorer

Modular addon system

Docker deployment

Minimal core architecture

Designed for open-source extensions

Server Requirements

Recommended VPS:

Ubuntu 22.04 / Debian 12

2 CPU

4GB RAM

40GB disk

BitcoinZ full node running with RPC enabled

Install System Dependencies
sudo apt update
sudo apt upgrade -y

sudo apt install -y \
git \
curl \
nano \
docker.io \
docker-compose-plugin

Enable docker:

sudo systemctl enable docker
sudo systemctl start docker

Verify docker:

docker --version
docker compose version
Clone Repository
cd ~
git clone https://github.com/kn4d/explorer.minebtcz.com.git
cd explorer.minebtcz.com
Configure Environment
cp .env.example .env
Setup RPC + permissions
chmod +x setup.sh
./setup.sh

The setup script will:

configure RPC credentials

prepare Docker network

generate environment variables

Start Explorer
docker compose up -d

Verify:

docker ps

Test API:

curl http://127.0.0.1:8088/api/health

Expected response:

{
 "ok": true,
 "blocks": 1734560
}
Stop Explorer

From the project directory:

cd ~/explorer.minebtcz.com
docker compose down
Remove Containers (Explorer Only)

To ensure explorer containers are stopped:

docker stop btcz-explorer btcz-explorer-nginx 2>/dev/null || true
docker rm -f btcz-explorer btcz-explorer-nginx 2>/dev/null || true
Remove Explorer Images Only

Images are removed only if unused by other containers.

docker image rm node:20-alpine nginx:alpine 2>/dev/null || true
Remove Explorer Docker Network
docker network rm btcz-explorer-net 2>/dev/null || true
Remove Explorer Project (Full Reset)

If you want to start completely fresh:

rm -rf ~/explorer.minebtcz.com
Project Structure
explorer.minebtcz.com
│
├─ app
│   ├─ server.js
│   ├─ rpc.js
│   ├─ search.js
│   └─ modules.js
│
├─ web
│   ├─ index.html
│   ├─ style.css
│   └─ app.js
│
├─ nginx
│   └─ default.conf
│
├─ addons
│
├─ docker-compose.yml
├─ setup.sh
└─ .env
API Endpoints
Health
/api/health
Network Stats
/api/stats
Latest Blocks
/api/blocks/latest
Search
/api/search?q=

Supports:

block height

block hash

transaction id

address

Addons

Explorer supports modular addons.

Addons can include:

widgets

API endpoints

analytics modules

monitoring tools

Example future addons:

difficulty history

shielded pool analytics

node monitor

richlist explorer

mempool visualizer

multisig monitoring

License

MIT License

BitcoinZ

Official project:

https://getbtcz.com
