BitcoinZ Explorer

Explorer minimal et modulaire pour BitcoinZ (BTCZ).

Ce projet fournit :

un explorer léger

un search rapide (block / tx / address)

une architecture modulaire via addons

un déploiement Docker simple

un setup open-source reproductible

Installation
1 — Installer les dépendances système

Sur un VPS Ubuntu / Debian :

sudo apt-get update

sudo apt-get install -y \
git \
curl \
nano \
docker.io \
docker-compose \
ca-certificates

Activer Docker :

sudo systemctl enable docker
sudo systemctl start docker
Cloner le projet

Créer le dossier et cloner le repo :

cd ~
git clone https://github.com/kn4d/explorer.minebtcz.com.git
cd explorer.minebtcz.com
Configuration

Copier le fichier d’environnement :

cp .env.example .env
Setup automatique

Rendre le script exécutable :

chmod +x setup.sh

Puis lancer :

./setup.sh
Démarrer l’explorer
docker compose up -d
Configuration requise du daemon BitcoinZ

Le node bitcoinzd doit être lancé avec les index nécessaires.

Modifier :

~/.bitcoinz/bitcoinz.conf

Ajouter obligatoirement :

txindex=1
addressindex=1
timestampindex=1
spentindex=1

experimentalfeatures=1
insightexplorer=1

rpcuser=change_me
rpcpassword=change_me

rpcbind=0.0.0.0

rpcallowip=127.0.0.1
rpcallowip=172.21.0.0/16

Puis redémarrer le node :

bitcoinz-cli stop
bitcoinzd
Vérifier que le RPC fonctionne
curl --user rpcuser:rpcpassword \
--data-binary '{"jsonrpc":"1.0","id":"test","method":"getblockchaininfo","params":[]}' \
-H 'content-type:text/plain;' \
http://127.0.0.1:1979/
Accès à l’explorer

Local :

http://localhost:8088

ou via domaine :

https://explorer.minebtcz.com
Architecture du projet
explorer.minebtcz.com
│
├── app
│   ├── server.js
│   ├── rpc.js
│   ├── search.js
│   └── modules.js
│
├── web
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── addons
│
├── docker-compose.yml
├── setup.sh
└── README.md
Arrêter l’explorer

Depuis le dossier du projet :

cd ~/btcz-explorer-v2
docker compose down
Purger seulement l’explorer Docker

Cela ne touche pas aux autres containers comme ElectrumX.

Stop + remove des conteneurs explorer
docker stop btcz-explorer btcz-explorer-nginx 2>/dev/null || true
docker rm -f btcz-explorer btcz-explorer-nginx 2>/dev/null || true
Supprimer les images utilisées par l’explorer

Uniquement si elles ne sont pas utilisées ailleurs :

docker image rm node:20-alpine nginx:alpine 2>/dev/null || true
Supprimer le réseau Docker de l’explorer
docker network rm btcz-explorer-net 2>/dev/null || true
