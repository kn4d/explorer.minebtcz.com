async function fetchJson(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

function formatTime(ts) {
  if (!ts) return "n/a";
  return new Date(ts * 1000).toLocaleString();
}

function setPageTitle(title, subtitle = "") {
  const main = document.querySelector(".layout");
  main.innerHTML = `
    <section class="hero-card">
      <h2>${title}</h2>
      ${subtitle ? `<p>${subtitle}</p>` : ""}
      <div id="page-content"></div>
    </section>
  `;
}

async function loadHome() {
  const layout = document.querySelector(".layout");

  layout.innerHTML = `
    <section class="hero-card" id="hero-stats">
      <h2>Network Heartbeat</h2>
      <div class="hero-grid" id="stats-grid"></div>
    </section>

    <section>
      <h2>Modules</h2>
      <div class="widget-grid" id="widget-grid"></div>
    </section>
  `;

  await loadStats();
  await loadWidgets();
}

async function loadStats() {
  const grid = document.getElementById("stats-grid");
  if (!grid) return;

  grid.innerHTML = `<div class="stat"><h3>Loading</h3><strong>...</strong></div>`;

  try {
    const data = await fetchJson("/api/stats");

    grid.innerHTML = `
      <div class="stat"><h3>Block Height</h3><strong>${data.blocks}</strong><span>Live</span></div>
      <div class="stat"><h3>Difficulty</h3><strong>${Number(data.difficulty).toFixed(2)}</strong><span>Current</span></div>
      <div class="stat"><h3>Connections</h3><strong>${data.connections}</strong><span>Peers</span></div>
      <div class="stat"><h3>Hashrate</h3><strong>${data.networkhashps ?? "n/a"}</strong><span>Estimated</span></div>
      <div class="stat"><h3>Best Block</h3><strong>${String(data.bestblockhash).slice(0, 12)}...</strong><span>${data.version}</span></div>
    `;
  } catch (e) {
    grid.innerHTML = `<div class="stat"><h3>Error</h3><strong>RPC</strong><span>${e.message}</span></div>`;
  }
}

async function loadWidgets() {
  const grid = document.getElementById("widget-grid");
  if (!grid) return;

  const widgets = await fetchJson("/api/widgets");

  grid.innerHTML = widgets.map(w => `
    <article class="widget">
      <h3>${w.title}</h3>
      <p>Module prêt. Cette carte sera enrichie automatiquement par les addons plus tard.</p>
    </article>
  `).join("");
}

async function loadBlockPage(id) {
  setPageTitle("Block", `Identifier: ${id}`);
  const el = document.getElementById("page-content");

  try {
    const data = await fetchJson(`/api/block/${encodeURIComponent(id)}`);

    el.innerHTML = `
      <div class="widget-grid">
        <article class="widget"><h3>Height</h3><p>${data.height}</p></article>
        <article class="widget"><h3>Hash</h3><p>${data.hash}</p></article>
        <article class="widget"><h3>Time</h3><p>${formatTime(data.time)}</p></article>
        <article class="widget"><h3>Difficulty</h3><p>${data.difficulty}</p></article>
        <article class="widget"><h3>Confirmations</h3><p>${data.confirmations}</p></article>
        <article class="widget"><h3>Transactions</h3><p>${data.tx?.length ?? 0}</p></article>
      </div>

      <section class="hero-card" style="margin-top:20px;">
        <h2>Transactions</h2>
        <div style="max-height:500px; overflow:auto;">
          ${(data.tx || []).map(txid => `<p style="margin:6px 0; word-break:break-all;">${txid}</p>`).join("")}
        </div>
      </section>
    `;
  } catch (e) {
    el.innerHTML = `<p>${e.message}</p>`;
  }
}

async function loadTxPage(id) {
  setPageTitle("Transaction", `TXID: ${id}`);
  const el = document.getElementById("page-content");

  try {
    const data = await fetchJson(`/api/tx/${encodeURIComponent(id)}`);

    el.innerHTML = `
      <div class="widget-grid">
        <article class="widget"><h3>TXID</h3><p>${data.txid}</p></article>
        <article class="widget"><h3>Confirmations</h3><p>${data.confirmations ?? 0}</p></article>
        <article class="widget"><h3>Block Hash</h3><p>${data.blockhash ?? "n/a"}</p></article>
        <article class="widget"><h3>Time</h3><p>${formatTime(data.time)}</p></article>
      </div>

      <section class="hero-card" style="margin-top:20px;">
        <h2>Inputs</h2>
        ${(data.vin || []).map(v => `
          <div class="widget" style="margin-bottom:10px;">
            <p><strong>txid:</strong> ${v.txid ?? "coinbase"}</p>
            <p><strong>vout:</strong> ${v.vout ?? "n/a"}</p>
          </div>
        `).join("")}
      </section>

      <section class="hero-card" style="margin-top:20px;">
        <h2>Outputs</h2>
        ${(data.vout || []).map(v => `
          <div class="widget" style="margin-bottom:10px;">
            <p><strong>value:</strong> ${v.value}</p>
            <p><strong>n:</strong> ${v.n}</p>
            <p><strong>addresses:</strong> ${(v.scriptPubKey?.addresses || []).join(", ") || "n/a"}</p>
            <p><strong>raw input context:</strong></p>
            <pre>{"txid":"${data.txid}","vout":${v.n}}</pre>
          </div>
        `).join("")}
      </section>
    `;
  } catch (e) {
    el.innerHTML = `<p>${e.message}</p>`;
  }
}

async function loadAddressPage(addr) {
  setPageTitle("Address", `Address: ${addr}`);
  const el = document.getElementById("page-content");

  try {
    const data = await fetchJson(`/api/address/${encodeURIComponent(addr)}`);

    const balance = data.balance?.balance ?? "0";
    const received = data.balance?.received ?? "0";

    el.innerHTML = `
      <div class="widget-grid">
        <article class="widget"><h3>Balance (zat)</h3><p>${balance}</p></article>
        <article class="widget"><h3>Received (zat)</h3><p>${received}</p></article>
        <article class="widget"><h3>UTXO Count</h3><p>${data.utxos?.length ?? 0}</p></article>
        <article class="widget"><h3>TX Count</h3><p>${data.txids?.length ?? 0}</p></article>
      </div>

      <section class="hero-card" style="margin-top:20px;">
        <h2>UTXOs</h2>
        ${(data.utxos || []).map(u => `
          <div class="widget" style="margin-bottom:10px;">
            <p><strong>txid:</strong> ${u.txid}</p>
            <p><strong>vout:</strong> ${u.outputIndex ?? u.vout ?? u.index ?? "n/a"}</p>
            <p><strong>satoshis/zat:</strong> ${u.satoshis ?? u.value ?? "n/a"}</p>
            <p><strong>height:</strong> ${u.height ?? "n/a"}</p>
            <p><strong>raw:</strong></p>
            <pre>{"txid":"${u.txid}","vout":${u.outputIndex ?? u.vout ?? u.index ?? 0}}</pre>
          </div>
        `).join("") || "<p>No UTXOs</p>"}
      </section>

      <section class="hero-card" style="margin-top:20px;">
        <h2>Transaction IDs</h2>
        <div style="max-height:500px; overflow:auto;">
          ${(data.txids || []).map(txid => `<p style="margin:6px 0; word-break:break-all;">${txid}</p>`).join("")}
        </div>
      </section>
    `;
  } catch (e) {
    el.innerHTML = `<p>${e.message}</p>`;
  }
}

async function router() {
  const path = window.location.pathname;

  if (path === "/") {
    await loadHome();
    return;
  }

  if (path.startsWith("/block/")) {
    const id = decodeURIComponent(path.replace("/block/", ""));
    await loadBlockPage(id);
    return;
  }

  if (path.startsWith("/tx/")) {
    const id = decodeURIComponent(path.replace("/tx/", ""));
    await loadTxPage(id);
    return;
  }

  if (path.startsWith("/address/")) {
    const id = decodeURIComponent(path.replace("/address/", ""));
    await loadAddressPage(id);
    return;
  }

  await loadHome();
}

document.getElementById("search-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = document.getElementById("search-input").value.trim();
  if (!q) return;

  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
  const data = await res.json();

  if (data.redirect) {
    window.location.href = data.redirect;
    return;
  }

  alert(data.error || "Query not found");
});

await router();
