import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = neon(process.env.DATABASE_URL ?? "");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const initSql = readFileSync(join(__dirname, "init-db.sql"), "utf8");
const statements = initSql
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql(statement);
  console.log("OK:", statement.slice(0, 60).replace(/\s+/g, " ") + "…");
}

console.log("Database initialized.");
