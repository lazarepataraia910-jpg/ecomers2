// Admin panel: add, edit and delete custom recipes (stored in localStorage).
// NOTE: the password check runs in the browser, so it only keeps casual
// visitors out. Change ADMIN_PASSWORD before publishing.
const ADMIN_PASSWORD = "admin123";
const SESSION_KEY = "hrf_admin";

renderHeader("");
renderFooter();

const $ = (id) => document.getElementById(id);
const loginEl = $("login");
const dashEl = $("dashboard");
const form = $("recipe-form");
let imageData = "";
let editingSlug = null;

function showView() {
  const loggedIn = sessionStorage.getItem(SESSION_KEY) === "1";
  loginEl.hidden = loggedIn;
  dashEl.hidden = !loggedIn;
  if (loggedIn) renderLists();
}

$("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const field = $("password").closest(".field");
  if ($("password").value === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "1");
    field.classList.remove("has-error");
    showView();
  } else {
    field.classList.add("has-error");
  }
});

$("logout").addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  showView();
});

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2500);
}

// Resize uploads to max 900px so they fit in localStorage.
function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 900 / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function setPreview(src) {
  imageData = src;
  $("preview").src = src || "";
  $("preview").hidden = !src;
  $("drop-text").textContent = src ? "Click to change image" : "Click or drag an image here (JPG, PNG, WebP)";
}

async function handleFile(file) {
  if (!file || !file.type.startsWith("image/")) return toast("Please choose an image file");
  setPreview(await readImage(file));
  $("dropzone").closest(".field").classList.remove("has-error");
}

$("image").addEventListener("change", (e) => handleFile(e.target.files[0]));
const dz = $("dropzone");
dz.addEventListener("dragover", (e) => { e.preventDefault(); dz.classList.add("dragover"); });
dz.addEventListener("dragleave", () => dz.classList.remove("dragover"));
dz.addEventListener("drop", (e) => {
  e.preventDefault();
  dz.classList.remove("dragover");
  handleFile(e.dataTransfer.files[0]);
});

const lines = (text) => text.split("\n").map((l) => l.trim()).filter(Boolean);

function validate() {
  const checks = [
    [dz, !!imageData],
    [$("title"), $("title").value.trim()],
    [$("overview"), $("overview").value.trim()],
    [$("ingredients"), lines($("ingredients").value).length],
    [$("instructions"), lines($("instructions").value).length]
  ];
  let ok = true;
  checks.forEach(([el, valid]) => {
    el.closest(".field").classList.toggle("has-error", !valid);
    if (!valid) ok = false;
  });
  return ok;
}

function resetForm() {
  form.reset();
  setPreview("");
  editingSlug = null;
  $("form-title").textContent = "Add new recipe";
  $("submit-btn").textContent = "Publish recipe";
  $("cancel-edit").hidden = true;
  form.querySelectorAll(".has-error").forEach((f) => f.classList.remove("has-error"));
}

$("cancel-edit").addEventListener("click", resetForm);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate()) return;

  const title = $("title").value.trim();
  const custom = getCustomRecipes();
  const taken = new Set(getAllRecipes().map((r) => r.slug).filter((s) => s !== editingSlug));
  let slug = editingSlug || slugify(title) || "recipe";
  if (!editingSlug) {
    const base = slug;
    for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  }

  const recipe = {
    slug,
    title,
    overview: $("overview").value.trim(),
    servings: Math.max(1, Number($("servings").value) || 1),
    prepMinutes: Math.max(0, Number($("prepMinutes").value) || 0),
    cookMinutes: Math.max(0, Number($("cookMinutes").value) || 0),
    image: imageData,
    ingredients: lines($("ingredients").value),
    instructions: lines($("instructions").value),
    custom: true
  };

  const idx = custom.findIndex((r) => r.slug === slug);
  if (idx >= 0) custom[idx] = recipe;
  else custom.unshift(recipe);

  try {
    saveCustomRecipes(custom);
  } catch {
    return toast("Storage is full — delete a recipe or use a smaller image");
  }
  toast(editingSlug ? "Recipe updated" : "Recipe published");
  resetForm();
  renderLists();
});

function itemHtml(r, editable) {
  return `
    <li class="admin-item">
      <img src="${escapeHtml(r.image)}" alt="" />
      <div class="info">
        <strong>${escapeHtml(r.title)}</strong>
        <span>${r.servings} servings · ${r.prepMinutes + r.cookMinutes} mins</span>
      </div>
      <div class="actions">
        <a class="btn btn-outline" href="recipe.html?slug=${encodeURIComponent(r.slug)}" target="_blank">View</a>
        ${editable ? `
          <button class="btn btn-outline" data-edit="${escapeHtml(r.slug)}">Edit</button>
          <button class="btn btn-danger" data-delete="${escapeHtml(r.slug)}">Delete</button>` : ""}
      </div>
    </li>`;
}

function renderLists() {
  const custom = getCustomRecipes();
  $("custom-list").innerHTML = custom.length
    ? custom.map((r) => itemHtml(r, true)).join("")
    : '<li class="muted">No uploaded recipes yet. Use the form to add one.</li>';
  $("default-list").innerHTML = DEFAULT_RECIPES.map((r) => itemHtml(r, false)).join("");
}

$("custom-list").addEventListener("click", (e) => {
  const del = e.target.closest("[data-delete]");
  const edit = e.target.closest("[data-edit]");
  if (del) {
    const slug = del.dataset.delete;
    if (!confirm("Delete this recipe?")) return;
    saveCustomRecipes(getCustomRecipes().filter((r) => r.slug !== slug));
    if (editingSlug === slug) resetForm();
    renderLists();
    toast("Recipe deleted");
  }
  if (edit) {
    const r = getCustomRecipes().find((x) => x.slug === edit.dataset.edit);
    if (!r) return;
    editingSlug = r.slug;
    $("title").value = r.title;
    $("overview").value = r.overview;
    $("servings").value = r.servings;
    $("prepMinutes").value = r.prepMinutes;
    $("cookMinutes").value = r.cookMinutes;
    $("ingredients").value = r.ingredients.join("\n");
    $("instructions").value = r.instructions.join("\n");
    setPreview(r.image);
    $("form-title").textContent = "Edit recipe";
    $("submit-btn").textContent = "Save changes";
    $("cancel-edit").hidden = false;
    form.scrollIntoView({ behavior: "smooth" });
  }
});

showView();
