Principe

Chaque addon peut :

ajouter un widget

ajouter une route API

ajouter une page web

ajouter un collecteur de données

Les addons sont chargés par le core via :

/addons/
Structure d'un addon

Exemple :

addons/difficulty/
addons/difficulty/
│
├─ addon.js
├─ api.js
├─ widget.html
└─ config.json
addon.js

Fichier principal du module.

Exemple :

export default {
  id: "difficulty",
  name: "Difficulty Monitor",
  widget: "/addons/difficulty/widget.html",
  api: "/addons/difficulty/api.js"
}
api.js

Expose les endpoints API.

Exemple :

export function register(app, rpc) {

  app.get("/api/addon/difficulty", async (req, res) => {

    const info = await rpc("getmininginfo")

    res.json({
      difficulty: info.difficulty,
      networkhashps: info.networkhashps
    })

  })

}
widget.html

Widget affiché sur la page principale.

Exemple :

<div class="widget">
  <h3>Network Difficulty</h3>
  <div id="difficulty-value"></div>
</div>
Chargement automatique

Au démarrage, le serveur charge :

/addons/*

et ajoute automatiquement :

les routes API

les widgets

Activation / Désactivation

Les addons peuvent être activés via .env

ENABLE_ADDONS=true

ou via :

.env
ADDONS=difficulty,node-monitor,richlist
Installation d’un addon

Ajouter simplement le dossier :

addons/nom-addon

Puis redémarrer :

docker compose restart
Exemple d'addons
Node Monitor

Affiche :

nodes connectés

pays

uptime

version

Difficulty Monitor

Historique :

difficulté

hashrate

évolution

Shielded Supply

Affiche :

Sapling pool

Sprout pool

évolution 24h / 30j / 1an

Richlist

Liste des :

top addresses

scrollable sans limite.

Multisig Monitor

Suivi des :

3-of-3 multisig addresses

Affiche :

UTXO

raw transaction input

consolidation possible

Mode Widget

Tous les addons apparaissent comme widgets dynamiques.

Chaque widget peut être :

click → expand page
Philosophie

Le projet vise :

simplicité

open source

déploiement rapide

architecture modulaire

Docker-first

Déploiement

Installation :

git clone
cd btcz-explorer

cp .env.example .env

docker compose up -d
Ajouter un addon

Créer :

addons/nom-addon

puis ajouter :

addon.js
api.js
widget.html

et redémarrer.

Roadmap addons

Modules prévus :

• difficulty history
• network nodes map
• shielded supply analytics
• richlist explorer
• multisig monitor
• mempool visualizer
• orphan block tracker
• fee estimator
• transaction flow graph
• mining pool stats

Contribution

Les addons sont indépendants du core.

Un addon peut être développé sans modifier :

server.js
Vision

Créer un explorer modulaire et extensible capable de devenir :

explorer

analytics

research dashboard

developer tool
