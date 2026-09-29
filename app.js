const canvas = document.getElementById("galaxy");
const ctx = canvas.getContext("2d");
const tooltip = document.getElementById("tooltip");
const statusEl = document.getElementById("status");
const summaryEl = document.getElementById("summary");
const input = document.getElementById("username");

const COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572a5",
  HTML: "#e34c26", CSS: "#a05bff", Java: "#b07219", "C++": "#f34b7d",
  C: "#aaaaaa", Go: "#00add8", Rust: "#dea584", PHP: "#4f5d95",
  Ruby: "#cc342d", Swift: "#f05138", Kotlin: "#a97bff", Dart: "#00b4ab",
  Shell: "#89e051", Jupyter: "#da5b0b"
};
const colorFor = lang => COLORS[lang] || "#8a93c9";

let planets = [], hovered = null, mouse = { x: -1, y: -1 }, user = "";

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener("resize", resize);
resize();

async function load(name) {
  statusEl.textContent = "Scanning the galaxy...";
  summaryEl.innerHTML = "";
  planets = [];
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(name)}/repos?per_page=100&sort=pushed`
    );
    if (res.status === 404) throw new Error("User not found.");
    if (!res.ok) throw new Error("GitHub rate limit hit. Try again in an hour.");
    let repos = (await res.json()).filter(r => !r.fork);
    if (!repos.length) throw new Error("No original repos to show.");

    repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    repos = repos.slice(0, 60);

    planets = repos.map((r, i) => ({
      repo: r,
      frac: i / repos.length,
      angle: Math.random() * Math.PI * 2,
      speed: 0.0015 + Math.random() * 0.002,
      radius: 7 + Math.sqrt(r.stargazers_count) * 3,
      x: 0, y: 0
    }));

    user = name;
    history.replaceState(null, "", `?user=${name}`);
    statusEl.textContent = `${name}: ${repos.length} repos. Hover a planet, click to open.`;
    showSummary(repos);
  } catch (e) {
    statusEl.textContent = "⚠️ " + e.message;
  }
}

function showSummary(repos) {
  const counts = {};
  repos.forEach(r => { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1; });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  summaryEl.innerHTML = top
    .map(([l, n]) => `<div class="chip"><i style="background:${colorFor(l)}"></i>${l} · ${n} repos</div>`)
    .join("");
}

function draw() {
  const w = canvas.width, h = canvas.height;
  const cx = w / 2, cy = h / 2 + 30;
  const maxOrbit = Math.min(w / 2, h / 1.4) - 40;
  ctx.clearRect(0, 0, w, h);

  const sun = ctx.createRadialGradient(cx, cy, 0, cx, cy, 55);
  sun.addColorStop(0, "#fff6b0");
  sun.addColorStop(0.4, "#ffb347");
  sun.addColorStop(1, "rgba(255,120,0,0)");
  ctx.fillStyle = sun;
  ctx.beginPath(); ctx.arc(cx, cy, 55, 0, Math.PI * 2); ctx.fill();
  if (user) {
    ctx.fillStyle = "#fff"; ctx.font = "bold 12px system-ui"; ctx.textAlign = "center";
    ctx.fillText(user, cx, cy + 4);
  }

  planets.forEach(p => {
    p.angle += p.speed;
    const orbit = 80 + p.frac * (maxOrbit - 80);
    p.x = cx + Math.cos(p.angle) * orbit;
    p.y = cy + Math.sin(p.angle) * orbit * 0.6;

    ctx.strokeStyle = "rgba(120,140,255,0.07)";
    ctx.beginPath(); ctx.ellipse(cx, cy, orbit, orbit * 0.6, 0, 0, Math.PI * 2); ctx.stroke();

    const c = colorFor(p.repo.language);
    ctx.shadowColor = c;
    ctx.shadowBlur = p === hovered ? 30 : 14;
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  });

  requestAnimationFrame(draw);
}

canvas.addEventListener("mousemove", e => {
  mouse = { x: e.clientX, y: e.clientY };
  hovered = planets.find(p => Math.hypot(p.x - mouse.x, p.y - mouse.y) < p.radius + 4) || null;
  if (hovered) {
    const r = hovered.repo;
    tooltip.style.display = "block";
    tooltip.style.left = mouse.x + 14 + "px";
    tooltip.style.top = mouse.y + 14 + "px";
    tooltip.innerHTML = `<b>${r.name}</b><br>⭐ ${r.stargazers_count} · ${r.language || "Unknown"}<br>${r.description || ""}`;
    canvas.style.cursor = "pointer";
  } else {
    tooltip.style.display = "none";
    canvas.style.cursor = "default";
  }
});

canvas.addEventListener("click", () => {
  if (hovered) window.open(hovered.repo.html_url, "_blank");
});

document.getElementById("search").addEventListener("submit", e => {
  e.preventDefault();
  const name = input.value.trim();
  if (name) load(name);
});

const start = new URLSearchParams(location.search).get("user") || "chalanapadpu";
input.value = start;
load(start);
draw();
