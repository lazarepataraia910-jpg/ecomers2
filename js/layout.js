// Shared header, footer and recipe card markup.
const ICONS = {
  servings: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="4.5" r="3"/><path d="M2 15c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5z"/></svg>',
  prep: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm.75 6.2-2.6 1.6-.8-1.3 1.9-1.1V5h1.5z"/><path d="M2 3.2 4 1.5l.9 1L2.9 4.3zM14 3.2 12 1.5l-.9 1 2 1.8z"/></svg>',
  cook: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 4.5c-3.6 0-6.5 2.6-6.5 6h13c0-3.4-2.9-6-6.5-6zM7 2h2v2H7zM.5 11.5h15V13H.5z"/></svg>',
  arrow: '<svg viewBox="0 0 20 12" aria-hidden="true"><path d="M8 0c3.3 0 6 2.7 6 6s-2.7 6-6 6V0zM0 5h3v2H0zm4 0h3v2H4z"/></svg>'
};

const LOGO = `
  <svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16 30C8 30 3 24 3 17c0-4 2-8 5-10-1 5 2 9 8 9v14z" fill="#163a34"/>
    <path d="M16 30c7 0 13-5 13-12 0-6-4-10-8-16 0 5-2 8-5 10-2 2-3 4-3 7 0 5 3 11 3 11z" fill="#fe9f6b"/>
  </svg>`;

function renderHeader(active) {
  const links = [
    ["index.html", "Home", "home"],
    ["about.html", "About", "about"],
    ["recipes.html", "Recipes", "recipes"]
  ];
  const nav = links
    .map(([href, label, key]) => `<li><a href="${href}" class="${key === active ? "active" : ""}">${label}</a></li>`)
    .join("");
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="container header-inner">
      <a href="index.html" class="logo">${LOGO}<span>Healthy Recipe Finder</span></a>
      <nav class="main-nav" aria-label="Main"><ul>${nav}</ul></nav>
      <a href="recipes.html" class="btn btn-sm header-cta">Browse recipes</a>
      <button class="menu-toggle" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="mobile-menu" hidden>
      <ul>${nav}</ul>
      <a href="recipes.html" class="btn btn-block">Browse recipes</a>
    </div>`;
  document.body.prepend(header);

  const toggle = header.querySelector(".menu-toggle");
  const menu = header.querySelector(".mobile-menu");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    menu.hidden = open;
  });
}

function renderFooter() {
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="container footer-inner">
      <p>Made with ❤️ and 🥑</p>
      <ul class="socials">
        <li><a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm5.5-3a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"/></svg></a></li>
        <li><a href="#" aria-label="Bluesky"><svg viewBox="0 0 24 24"><path d="M5.2 3.6C7.9 5.6 10.8 9.7 12 12c1.2-2.3 4.1-6.4 6.8-8.4 2-1.5 5.2-2.6 5.2 1 0 .7-.4 6-.6 6.8-.8 2.9-3.7 3.6-6.3 3.2 4.5.8 5.7 3.3 3.2 5.9-4.7 4.8-6.8-1.2-7.3-2.8l-.2-.5-.2.5c-.5 1.6-2.6 7.6-7.3 2.8-2.5-2.6-1.3-5.1 3.2-5.9-2.6.4-5.5-.3-6.3-3.2C.4 10.6 0 5.3 0 4.6c0-3.6 3.2-2.5 5.2-1z"/></svg></a></li>
        <li><a href="#" aria-label="TikTok"><svg viewBox="0 0 24 24"><path d="M16.6 2c.4 2.6 2 4.3 4.6 4.5v3.2c-1.6.1-3.1-.4-4.5-1.3v6.4c0 7.9-8.6 10.4-12 4.7-2.2-3.7-.8-10.1 6.2-10.4v3.4c-.5.1-1.1.2-1.6.4-1.6.5-2.5 1.5-2.2 3.3.5 3.4 6.7 4.4 6.2-2.3V2h3.3z"/></svg></a></li>
      </ul>
    </div>`;
  document.body.append(footer);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function recipeMeta(r) {
  return `
    <ul class="recipe-meta">
      <li>${ICONS.servings}Servings: ${r.servings}</li>
      <li>${ICONS.prep}Prep: ${r.prepMinutes} mins</li>
      <li>${ICONS.cook}Cook: ${r.cookMinutes} mins</li>
    </ul>`;
}

function recipeCard(r) {
  const href = `recipe.html?slug=${encodeURIComponent(r.slug)}`;
  return `
    <article class="recipe-card">
      <img src="${escapeHtml(r.image)}" alt="${escapeHtml(r.title)}" loading="lazy" />
      <h3 title="${escapeHtml(r.title)}">${escapeHtml(r.title)}</h3>
      <p>${escapeHtml(r.overview)}</p>
      ${recipeMeta(r)}
      <a href="${href}" class="btn btn-pill btn-block">View Recipe</a>
    </article>`;
}
