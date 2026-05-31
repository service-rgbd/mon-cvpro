import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Remonte l'arborescence jusqu'à la racine du monorepo (où se trouve env.local) */
function findMonorepoRoot(): string {
  let dir = __dirname;

  for (let i = 0; i < 10; i++) {
    if (
      fs.existsSync(path.join(dir, "env.local")) ||
      fs.existsSync(path.join(dir, ".env.local")) ||
      fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))
    ) {
      return dir;
    }

    const pkgPath = path.join(dir, "package.json");
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as { name?: string };
        if (pkg.name === "workspace") return dir;
      } catch {
        /* ignore */
      }
    }

    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return process.cwd();
}

/** Charge .env.local / env.local à la racine du monorepo (sans écraser les vars déjà définies) */
export function loadEnvFiles() {
  const root = findMonorepoRoot();

  for (const file of [".env.local", "env.local", ".env"]) {
    const filePath = path.join(root, file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;

      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

export function getPaystackSecretKey(): string | undefined {
  return (
    process.env.PAYSTACK_SECRET_KEY ??
    process.env.PAYSTACK_LIVE_KEY ??
    process.env.PAYSTACK_TEST_SECRET_KEY
  );
}

export function getPaystackPublicKey(): string | undefined {
  return (
    process.env.PAYSTACK_PUBLIC_KEY ??
    process.env.PAYSTACK_LIVE_PUBLIC_KEY ??
    process.env.PAYSTACK_TEST_PUBLIC_KEY
  );
}

export function isPaystackConfigured(): boolean {
  return Boolean(getPaystackSecretKey() && getPaystackPublicKey());
}

export function getAppUrl(): string {
  return (
    process.env.APP_URL ??
    process.env.FRONTEND_URL ??
    process.env.VITE_APP_URL ??
    "http://localhost:22723"
  ).replace(/\/+$/, "");
}
