# Demo seed data

Fills a local Recipe Sharing Platform with 8 demo cooks, 32 recipes with generated
photos, and 77 reviews. Accounts are listed in [ACCOUNTS.md](ACCOUNTS.md).

| File | What it is |
|---|---|
| `seed-data.js` | Cooks, recipes (with ingredients and art settings) and reviews |
| `food-art.js` | Paints a top-down food illustration per dish on a canvas and exports a JPEG |
| `seed.js` | Creates the accounts, recipes, photos and reviews through the API gateway |
| `serve.cjs` | Tiny server so the app page can import the scripts |
| `backdate.sql` | Spreads the demo recipes over past dates (the API won't set `createdAt`) |
| `make-backdate.js` | Regenerates `backdate.sql` from `seed-data.js` |

## Running it

The photos are drawn on a browser canvas, so the seed runs inside the app's page.

1. Start the backend services and the React app (`http://localhost:3000`).
2. Serve the scripts:

   ```bash
   node seed/serve.cjs
   ```

3. Open `http://localhost:3000`, then in the browser console run:

   ```js
   const seed = await import("http://127.0.0.1:5055/seed.js");
   await seed.run();
   ```

   To look at the generated photos first without writing anything:

   ```js
   const box = document.body.appendChild(document.createElement("div"));
   await seed.preview(box);
   ```

4. Backdate the recipes (optional):

   ```bash
   mysql -uroot -p recipe_sharing < seed/backdate.sql
   ```

`run()` is safe to repeat. Existing cooks are signed in instead of re-registered, and
recipes and reviews that already exist are skipped. Photos are uploaded through
`/recipes/upload-image/{id}`, so the recipe service saves them as
`platform-recipe-service/images/seed-*.jpg`.
