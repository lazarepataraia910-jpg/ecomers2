# Healthy Recipe Finder

A static website built from the [healthy-recipe-website Figma design](https://www.figma.com/design/8CqX4OlW3stWW0nkqIlOxw/healthy-recipe-website), with an admin panel for uploading new recipes.

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| About | `about.html` |
| Recipes (search + prep/cook filters) | `recipes.html` |
| Recipe details | `recipe.html?slug=…` |
| Admin panel | `admin.html` |

## Favorites

Tap the heart on any recipe card (or the button on a recipe page) to save it. Your favorites are on `favorites.html` and are stored in your browser.

## Login and admin panel

- Login: `login.html` (also linked as **Admin** in the footer). The admin panel is `admin.html` and redirects to the login page if you are not signed in.
- From the admin panel you can upload a recipe with an image, title, description, servings, prep/cook time, ingredients and steps, and edit or delete the recipes you uploaded.

### Local mode (works right now)

Until Supabase is connected the site saves recipes in the browser's `localStorage` and the login password is **`admin123`** (`LOCAL_PASSWORD` in `js/store.js`). Only the browser that added a recipe can see it, and this password check is not real security.

### Connect Supabase (recipes visible to everyone, real login)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the contents of `supabase/setup.sql` and run it. This creates the `recipes` table, the security rules and the public `recipe-images` bucket.
3. Open **Authentication → Users → Add user**, and create your admin email and password (tick "Auto Confirm User").
4. Open **Authentication → Sign In / Providers** and turn **off** "Allow new users to sign up". Otherwise anyone could register and become an admin.
5. Open **Project Settings → API** and copy the Project URL and the publishable (anon) key into `js/supabase.js`.

After that, `login.html` asks for the email and password from step 3, and uploaded recipes and images are stored in Supabase.

## Run locally

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

The site is plain HTML/CSS/JS, so it runs on GitHub Pages as is: go to **Settings → Pages**, set the source to `main` / root, and save.
