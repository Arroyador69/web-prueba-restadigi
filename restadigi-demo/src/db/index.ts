import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { getDatabaseUrl } from "@/lib/database-url";

import * as schema from "./schema";

let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error("Database URL is not configured (DATABASE_URL or POSTGRES_URL)");
  }
  if (!db) {
    db = drizzle(neon(url), { schema });
  }
  return db;
}

export { schema };
