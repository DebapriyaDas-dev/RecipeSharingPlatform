// Regenerates backdate.sql from seed-data.js: node seed/make-backdate.js
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { RECIPES } from "./seed-data.js";

const esc = (s) => s.replace(/'/g, "''");
const lines = [
  "-- The API treats createdAt as read-only, so the demo recipes are backdated here.",
  "-- Spreads them over the past weeks so \"Newest\" sorting has an order. Safe to re-run.",
  "USE recipe_sharing;",
  ...RECIPES.map(
    (d, i) =>
      `UPDATE recipes SET created_at = CURDATE() - INTERVAL ${RECIPES.length - i} DAY WHERE recipe_name = '${esc(d.name)}' AND file_name LIKE 'seed-%';`
  ),
];
writeFileSync(fileURLToPath(new URL("./backdate.sql", import.meta.url)), lines.join("\n") + "\n");
console.log(`${RECIPES.length} updates written to seed/backdate.sql`);
