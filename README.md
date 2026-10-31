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

## Admin panel

Open `admin.html` and log in. The default password is **`admin123`**. Change `ADMIN_PASSWORD` in `js/admin.js` before you publish.

From the admin panel you can:

- upload a recipe with an image (drag and drop or click), title, description, servings, prep/cook time, ingredients and steps
- edit or delete the recipes you uploaded
- view any recipe

> **Note:** There is no backend, so uploaded recipes are saved in the browser's `localStorage`. They only show in the browser that added them, and the password check only keeps casual visitors out. To share uploads with every visitor, connect a backend or database (for example Firebase or Supabase), or add the recipe to `DEFAULT_RECIPES` in `js/data.js`.

## Run locally

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

The site is plain HTML/CSS/JS, so it runs on GitHub Pages as is: go to **Settings → Pages**, set the source to `main` / root, and save.
