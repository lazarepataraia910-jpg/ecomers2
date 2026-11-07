// Data + auth layer. Uses Supabase when js/supabase.js is configured,
// otherwise falls back to localStorage and a local admin password.
import { supabase, isConfigured } from "./supabase.js";

const TABLE = "recipes";
const BUCKET = "recipe-images";
// The admin account created in Supabase → Authentication → Users.
// The login form only asks for the password; the email is filled in here.
const ADMIN_EMAIL = "irineirnola@gmail.com";
// Local mode only — the check runs in the browser, so it is not real security.
const LOCAL_PASSWORD = "admin123";
const LOCAL_SESSION = "hrf_admin";

export const usingSupabase = isConfigured;

function fromRow(row) {
  return {
    slug: row.slug,
    title: row.title,
    overview: row.overview,
    servings: row.servings,
    prepMinutes: row.prep_minutes,
    cookMinutes: row.cook_minutes,
    image: row.image_url,
    ingredients: row.ingredients || [],
    instructions: row.instructions || [],
    custom: true
  };
}

function toRow(r) {
  return {
    slug: r.slug,
    title: r.title,
    overview: r.overview,
    servings: r.servings,
    prep_minutes: r.prepMinutes,
    cook_minutes: r.cookMinutes,
    image_url: r.image,
    ingredients: r.ingredients,
    instructions: r.instructions
  };
}

// ---------- Recipes ----------

export async function fetchCustomRecipes() {
  if (!isConfigured) return getCustomRecipes();
  const { data, error } = await supabase.from(TABLE).select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Could not load recipes:", error.message);
    return [];
  }
  return data.map(fromRow);
}

export async function fetchAllRecipes() {
  return [...(await fetchCustomRecipes()), ...DEFAULT_RECIPES];
}

// `originalSlug` is set when editing an existing recipe.
export async function saveRecipe(recipe, originalSlug) {
  if (!isConfigured) {
    const list = getCustomRecipes();
    const idx = list.findIndex((r) => r.slug === (originalSlug || recipe.slug));
    if (idx >= 0) list[idx] = recipe;
    else list.unshift(recipe);
    saveCustomRecipes(list);
    return;
  }
  const query = originalSlug
    ? supabase.from(TABLE).update(toRow(recipe)).eq("slug", originalSlug)
    : supabase.from(TABLE).insert(toRow(recipe));
  const { error } = await query;
  if (error) throw error;
}

export async function deleteRecipe(slug) {
  if (!isConfigured) {
    saveCustomRecipes(getCustomRecipes().filter((r) => r.slug !== slug));
    return;
  }
  const { error } = await supabase.from(TABLE).delete().eq("slug", slug);
  if (error) throw error;
}

// ---------- Images ----------

// Resize to max 1000px and return a JPEG blob.
export function resizeImage(file, max = 1000) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not read image"))), "image/jpeg", 0.82);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error("Could not read image"));
    img.src = URL.createObjectURL(file);
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Returns the URL to store on the recipe.
export async function uploadImage(blob, slug) {
  if (!isConfigured) return blobToDataUrl(blob);
  const path = `${slug}-${Date.now()}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg" });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

// ---------- Auth ----------

export async function signIn(password) {
  if (!isConfigured) {
    if (password !== LOCAL_PASSWORD) throw new Error("Wrong password.");
    sessionStorage.setItem(LOCAL_SESSION, "1");
    return;
  }
  const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
  if (error) throw new Error(error.message === "Invalid login credentials" ? "Wrong password." : error.message);
}

export async function signOut() {
  if (!isConfigured) {
    sessionStorage.removeItem(LOCAL_SESSION);
    return;
  }
  await supabase.auth.signOut();
}

export async function getUser() {
  if (!isConfigured) return sessionStorage.getItem(LOCAL_SESSION) === "1" ? { email: "local admin" } : null;
  const { data } = await supabase.auth.getSession();
  return data.session ? data.session.user : null;
}
