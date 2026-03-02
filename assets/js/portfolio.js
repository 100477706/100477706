/**
 * portfolio.js
 * Interactividad ligera para la versión web opcional (index.html).
 *
 * - Filtro por etiquetas (tags) usando botones generados automáticamente.
 * - Búsqueda por texto (título/descripcion).
 *
 * Nota: Esto no afecta al README de GitHub (Markdown). Solo a index.html si decides usarlo.
 */

(function () {
  "use strict";

  const grid = document.querySelector(".grid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".card"));
  if (cards.length === 0) return;

  // Crea barra de herramientas (búsqueda + filtros)
  const toolbar = document.createElement("section");
  toolbar.className = "toolbar";
  toolbar.innerHTML = `
    <div class="toolbar__row">
      <input class="toolbar__search" type="search" placeholder="Buscar proyectos (nombre/stack)..." aria-label="Buscar proyectos" />
      <button class="toolbar__reset" type="button">Reset</button>
    </div>
    <div class="toolbar__filters" aria-label="Filtros por tecnología"></div>
  `;

  grid.parentNode.insertBefore(toolbar, grid);

  const searchInput = toolbar.querySelector(".toolbar__search");
  const resetBtn = toolbar.querySelector(".toolbar__reset");
  const filtersWrap = toolbar.querySelector(".toolbar__filters");

  // Extrae tags de data-tags
  const allTags = new Set();
  for (const card of cards) {
    const tags = (card.getAttribute("data-tags") || "")
      .split(/\s+/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    tags.forEach((t) => allTags.add(t));
  }

  // Estado de filtros
  const state = {
    q: "",
    tag: "all",
  };

  // Render botones de tags
  const sortedTags = ["all", ...Array.from(allTags).sort()];
  for (const tag of sortedTags) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tag";
    btn.dataset.tag = tag;
    btn.textContent = tag === "all" ? "Todas" : tag;

    btn.addEventListener("click", () => {
      state.tag = tag;
      apply();
      highlightActiveTag();
    });

    filtersWrap.appendChild(btn);
  }

  function highlightActiveTag() {
    const btns = Array.from(filtersWrap.querySelectorAll("button.tag"));
    btns.forEach((b) => {
      const active = b.dataset.tag === state.tag;
      b.classList.toggle("tag--active", active);
      b.setAttribute("aria-pressed", String(active));
    });
  }

  function matchesTag(card) {
    if (state.tag === "all") return true;
    const tags = (card.getAttribute("data-tags") || "").toLowerCase().split(/\s+/);
    return tags.includes(state.tag);
  }

  function matchesQuery(card) {
    const q = state.q.trim().toLowerCase();
    if (!q) return true;

    const text = card.textContent.toLowerCase();
    const tags = (card.getAttribute("data-tags") || "").toLowerCase();
    return text.includes(q) || tags.includes(q);
  }

  function apply() {
    for (const card of cards) {
      const ok = matchesTag(card) && matchesQuery(card);
      card.style.display = ok ? "" : "none";
    }
  }

  // Eventos
  searchInput.addEventListener("input", (e) => {
    state.q = e.target.value || "";
    apply();
  });

  resetBtn.addEventListener("click", () => {
    state.q = "";
    state.tag = "all";
    searchInput.value = "";
    apply();
    highlightActiveTag();
  });

  // Inicial
  highlightActiveTag();
  apply();
})();
