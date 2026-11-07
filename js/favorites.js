// Favorite recipes, saved per browser in localStorage.
const FAV_KEY = "hrf_favorites";

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch {
    return [];
  }
}

function isFavorite(slug) {
  return getFavorites().includes(slug);
}

function toggleFavorite(slug) {
  const favs = getFavorites();
  const next = favs.includes(slug) ? favs.filter((s) => s !== slug) : [...favs, slug];
  localStorage.setItem(FAV_KEY, JSON.stringify(next));
  return next.includes(slug);
}

// One delegated listener handles every heart button on the page.
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".fav-btn");
  if (!btn) return;
  const on = toggleFavorite(btn.dataset.slug);
  btn.classList.toggle("active", on);
  btn.setAttribute("aria-pressed", String(on));
  btn.setAttribute("aria-label", on ? "Remove from favorites" : "Add to favorites");
  document.dispatchEvent(new CustomEvent("favorites-changed", { detail: { slug: btn.dataset.slug, on } }));
});
