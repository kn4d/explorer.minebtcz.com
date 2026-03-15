async function loadStats() {
  const grid = document.getElementById("stats-grid");
  grid.innerHTML = `<div class="stat"><h3>Loading</h3><strong>...</strong></div>`;

  try {
    const res = await fetch("/api/stats");
    const data = await res.json();

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
  const res = await fetch("/api/widgets");
  const widgets = await res.json();

  grid.innerHTML = widgets.map(w => `
    <article class="widget">
      <h3>${w.title}</h3>
      <p>Module prêt. Cette carte sera enrichie automatiquement par les addons plus tard.</p>
    </article>
  `).join("");
}

document.getElementById("search-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = document.getElementById("search-input").value.trim();
  if (!q) return;

  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
  const data = await res.json();

  if (data.redirect) {
    location.href = data.redirect;
    return;
  }

  alert(data.error || "Query not found");
});

await loadStats();
await loadWidgets();
