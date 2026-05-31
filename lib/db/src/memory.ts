import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS cvs (
    id text PRIMARY KEY,
    session_token text NOT NULL,
    personal_info jsonb NOT NULL,
    experiences jsonb NOT NULL DEFAULT '[]'::jsonb,
    education jsonb NOT NULL DEFAULT '[]'::jsonb,
    skills jsonb NOT NULL DEFAULT '[]'::jsonb,
    languages jsonb NOT NULL DEFAULT '[]'::jsonb,
    certifications jsonb NOT NULL DEFAULT '[]'::jsonb,
    projects jsonb NOT NULL DEFAULT '[]'::jsonb,
    interests jsonb NOT NULL DEFAULT '[]'::jsonb,
    customization jsonb NOT NULL,
    is_paid boolean NOT NULL DEFAULT false,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS payments (
    id text PRIMARY KEY,
    cv_id text NOT NULL REFERENCES cvs(id),
    amount integer NOT NULL,
    currency text NOT NULL,
    method text NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamp NOT NULL DEFAULT now()
  );
`;

export async function createMemoryDb() {
  const client = new PGlite();
  await client.exec(SCHEMA_SQL);
  const db = drizzle(client, { schema });

  return { client, db };
}
