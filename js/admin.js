// Admin panel: add, edit and delete recipes. Requires a logged-in user.
import {
  fetchCustomRecipes, saveRecipe, deleteRecipe, resizeImage, uploadImage,
  getUser, signOut, usingSupabase
} from "./store.js";

const user = await getUser();
if (!user) {
  location.replace("login.html");
  throw new Error("Not logged in");
}

renderHeader("");
renderFooter();

const $ = (id) => document.getElementById(id);
const form = $("recipe-form");
let imageBlob = null;
let imagePreview = "";
let editingSlug = null;

if (usingSupabase) $("who").textContent = `Signed in as ${user.email}. Recipes you publish are visible to everyone.`;
else $("local-notice").hidden = false;

$("logout").addEventListener("click", async () => {
  await signOut();
  location.replace("login.html");
});

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 3000);
}

function setPreview(src) {
  imagePreview = src;
  $("preview").src = src || "";
  $("preview").hidden = !src;
  $("drop-text").textContent = src ? "Click to change image" : "Click or drag an image here (JPG, PNG, WebP)";
}

async function handleFile(file) {
  if (!file || !file.type.startsWith("image/")) return toast("Please choose an image file");
  try {
    imageBlob = await resizeImage(file);
    setPreview(URL.createObjectURL(imageBlob));
    $("dropzone").closest(".field").classList.remove("has-error");
  } catch (err) {
    toast(err.message);
  }
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
    [dz, !!imagePreview],
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
  imageBlob = null;
  setPreview("");
  editingSlug = null;
  $("form-title").textContent = "Add new recipe";
  $("submit-btn").textContent = "Publish recipe";
  $("cancel-edit").hidden = true;
  form.querySelectorAll(".has-error").forEach((f) => f.classList.remove("has-error"));
}

$("cancel-edit").addEventListener("click", resetForm);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validate()) return;

  const btn = $("submit-btn");
  const label = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Saving…";

  try {
    const title = $("title").value.trim();
    const existing = await fetchCustomRecipes();
    const taken = new Set([...existing, ...DEFAULT_RECIPES].map((r) => r.slug).filter((s) => s !== editingSlug));
    let slug = editingSlug || slugify(title) || "recipe";
    if (!editingSlug) {
      const base = slug;
      for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
    }

    // Keep the old image when editing without choosing a new one.
    let image = imagePreview;
    if (imageBlob) image = await uploadImage(imageBlob, slug);

    await saveRecipe({
      slug,
      title,
      overview: $("overview").value.trim(),
      servings: Math.max(1, Number($("servings").value) || 1),
      prepMinutes: Math.max(0, Number($("prepMinutes").value) || 0),
      cookMinutes: Math.max(0, Number($("cookMinutes").value) || 0),
      image,
      ingredients: lines($("ingredients").value),
      instructions: lines($("instructions").value),
      custom: true
    }, editingSlug);

    toast(editingSlug ? "Recipe updated" : "Recipe published");
    resetForm();
    await renderLists();
  } catch (err) {
    console.error(err);
    toast(err.name === "QuotaExceededError" ? "Storage is full — delete a recipe or use a smaller image" : `Could not save: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = editingSlug ? "Save changes" : label === "Saving…" ? "Publish recipe" : label;
  }
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

let custom = [];
async function renderLists() {
  custom = await fetchCustomRecipes();
  $("custom-list").innerHTML = custom.length
    ? custom.map((r) => itemHtml(r, true)).join("")
    : '<li class="muted">No uploaded recipes yet. Use the form to add one.</li>';
  $("default-list").innerHTML = DEFAULT_RECIPES.map((r) => itemHtml(r, false)).join("");
}

$("custom-list").addEventListener("click", async (e) => {
  const del = e.target.closest("[data-delete]");
  const edit = e.target.closest("[data-edit]");
  if (del) {
    const slug = del.dataset.delete;
    if (!confirm("Delete this recipe?")) return;
    try {
      await deleteRecipe(slug);
    } catch (err) {
      return toast(`Could not delete: ${err.message}`);
    }
    if (editingSlug === slug) resetForm();
    await renderLists();
    toast("Recipe deleted");
  }
  if (edit) {
    const r = custom.find((x) => x.slug === edit.dataset.edit);
    if (!r) return;
    resetForm();
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

await renderLists();
