import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { rpc } from "./rpc.js";
import { detectQueryType } from "./search.js";
import { getCoreWidgets } from "./modules.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/static", express.static("/web"));

app.get("/api/health", async (req, res) => {
  try {
    const info = await rpc("getblockchaininfo");
    res.json({ ok: true, chain: info.chain, blocks: info.blocks });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get("/api/widgets", (req, res) => {
  res.json(getCoreWidgets());
});

app.get("/api/stats", async (req, res) => {
  try {
    const [blockchain, network, mining] = await Promise.all([
      rpc("getblockchaininfo"),
      rpc("getnetworkinfo"),
      rpc("getmininginfo")
    ]);

    res.json({
      blocks: blockchain.blocks,
      bestblockhash: blockchain.bestblockhash,
      difficulty: blockchain.difficulty,
      connections: network.connections,
      version: network.subversion,
      networkhashps: mining.networkhashps ?? null,
      valuePools: blockchain.valuePools ?? []
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/blocks/latest", async (req, res) => {
  try {
    const count = Math.min(parseInt(req.query.count || "10", 10), 20);
    const best = await rpc("getblockcount");
    const out = [];

    for (let h = best; h > best - count && h >= 0; h--) {
      const hash = await rpc("getblockhash", [h]);
      const block = await rpc("getblock", [hash]);
      out.push({
        height: block.height,
        hash: block.hash,
        time: block.time,
        txcount: block.tx.length,
        difficulty: block.difficulty,
        confirmations: block.confirmations
      });
    }

    res.json(out);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/search", async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.status(400).json({ error: "empty query" });

  const type = detectQueryType(q);

  try {
    if (type === "block-height") {
      return res.json({ type, redirect: `/block/${q}` });
    }

    if (type === "hash-or-tx") {
      try {
        await rpc("getblock", [q]);
        return res.json({ type: "block-hash", redirect: `/block/${q}` });
      } catch {}

      try {
        await rpc("getrawtransaction", [q, 1]);
        return res.json({ type: "txid", redirect: `/tx/${q}` });
      } catch {}

      return res.status(404).json({ error: "hash not found" });
    }

    if (type === "address") {
      return res.json({ type, redirect: `/address/${q}` });
    }

    return res.status(400).json({ error: "unknown query type" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/block/:id", async (req, res) => {
  const id = req.params.id;
  res.sendFile(path.join("/web", "index.html"));
});

app.get("/tx/:id", async (req, res) => {
  res.sendFile(path.join("/web", "index.html"));
});

app.get("/address/:id", async (req, res) => {
  res.sendFile(path.join("/web", "index.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join("/web", "index.html"));
});

app.listen(process.env.APP_PORT || 8080, () => {
  console.log(`BTCZ Explorer listening on ${process.env.APP_PORT || 8080}`);
});
