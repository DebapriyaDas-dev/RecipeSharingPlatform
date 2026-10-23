// Seeds demo cooks, recipes (with generated photos) and reviews through the API gateway.
// Runs in a browser because the photos are painted on a canvas. See seed/README.md.
import { COOKS, PASSWORD, RECIPES, REVIEWS } from "./seed-data.js";
import { renderDishJpeg } from "./food-art.js";

const API = "http://localhost:8080";

const json = async (method, path, body) => {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(`${method} ${path} -> ${response.status} ${data && data.message}`);
  return data;
};

const slug = (text) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Renders every dish onto one canvas so the art can be reviewed before seeding
export async function preview(container, columns = 4) {
  container.innerHTML = "";
  container.style.cssText = `display:grid;grid-template-columns:repeat(${columns},1fr);gap:8px;padding:8px;background:#000`;
  for (const dish of RECIPES) {
    const blob = await renderDishJpeg(dish, 600, 450);
    const img = document.createElement("img");
    img.src = URL.createObjectURL(blob);
    img.title = dish.name;
    img.style.width = "100%";
    container.appendChild(img);
  }
}

export async function run({ log = console.log } = {}) {
  const summary = { cooksCreated: 0, cooksExisting: 0, recipesCreated: 0, recipesSkipped: 0, images: 0, reviews: 0, errors: [] };

  // 1. Cooks: register, or sign in if the email already exists
  const cookIds = {};
  for (const cook of COOKS) {
    try {
      const user = await json("POST", "/users/register", { name: cook.name, email: cook.email, password: PASSWORD });
      cookIds[cook.key] = user.id;
      summary.cooksCreated++;
    } catch (registerError) {
      try {
        const user = await json("POST", "/users/login", { email: cook.email, password: PASSWORD });
        cookIds[cook.key] = user.id;
        // Login marks the account as signed in; sign it back out
        await fetch(`${API}/users/logout/${user.id}`, { method: "POST" });
        summary.cooksExisting++;
      } catch (loginError) {
        summary.errors.push(`${cook.name}: ${registerError.message}`);
      }
    }
    log(`cook ${cook.name}`);
  }

  // 2. Recipes, each with a generated photo and a spread of creation dates
  const existing = await json("GET", "/recipes/all-recipes");
  const recipeIds = {};
  existing.forEach((r) => {
    recipeIds[r.name] = r.recipeId;
  });

  for (const dish of RECIPES) {
    const userId = cookIds[dish.cook];
    if (!userId) continue;
    if (recipeIds[dish.name]) {
      summary.recipesSkipped++;
      continue;
    }
    try {
      const created = await json("POST", "/recipes/new-recipe", {
        userId,
        name: dish.name,
        recipeDescription: dish.description,
        cookingTime: dish.time,
        kiloCalories: dish.kcal,
        ingredients: dish.ingredients.map(([name, quantity]) => ({ name, quantity })),
      });
      recipeIds[dish.name] = created.recipeId;
      summary.recipesCreated++;

      const blob = await renderDishJpeg(dish);
      const form = new FormData();
      form.append("image", blob, `seed-${slug(dish.name)}.jpg`);
      const upload = await fetch(`${API}/recipes/upload-image/${created.recipeId}`, { method: "POST", body: form });
      if (!upload.ok) throw new Error(`image upload -> ${upload.status}`);
      summary.images++;
      log(`recipe ${dish.name}`);
    } catch (error) {
      summary.errors.push(`${dish.name}: ${error.message}`);
    }
  }

  // 3. Reviews from other cooks, skipping any that already exist
  const ratings = await json("GET", "/ratings/all-ratings");
  const seen = new Set(ratings.map((r) => `${r.recipeId}|${r.userId}|${r.comment}`));
  for (const [recipeName, cookKey, rating, comment] of REVIEWS) {
    const recipeId = recipeIds[recipeName];
    const userId = cookIds[cookKey];
    if (!recipeId || !userId || seen.has(`${recipeId}|${userId}|${comment}`)) continue;
    try {
      await json("POST", "/ratings/new-rating", { userId, recipeId, rating, comment });
      summary.reviews++;
    } catch (error) {
      summary.errors.push(`review ${recipeName}: ${error.message}`);
    }
  }

  log("done");
  return summary;
}
