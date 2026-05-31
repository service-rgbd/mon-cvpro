import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import { createMemoryDb } from "./memory";

const { Pool } = pg;

const useMemoryDb =
  process.env.DATABASE_URL === "memory://" ||
  process.env.USE_MEMORY_DB === "1";

type Db = ReturnType<typeof drizzlePg<typeof schema>>;

let pool: pg.Pool | undefined;
let db: Db;

if (useMemoryDb) {
  const memory = await createMemoryDb();
  db = memory.db as Db;
} else {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set (Neon Postgres). On Render: Environment → add DATABASE_URL with your Neon connection string.",
    );
  }

  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzlePg(pool, { schema });
}

export { pool, db };
export * from "./schema";
