import { getAppUrl } from "./env";

const LOCAL_DEV_ORIGIN = "http://localhost:22723";

/** Origines autorisées pour les requêtes cross-origin (frontend Worker / Vite). */
export function getAllowedOrigins(): string[] {
  const origins = new Set<string>([LOCAL_DEV_ORIGIN]);

  const appUrl = getAppUrl();
  if (appUrl && appUrl !== LOCAL_DEV_ORIGIN) {
    origins.add(appUrl);
  }

  for (const raw of process.env.CORS_ORIGINS?.split(",") ?? []) {
    const origin = raw.trim().replace(/\/+$/, "");
    if (origin) origins.add(origin);
  }

  return [...origins];
}

export function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;
  return getAllowedOrigins().includes(origin);
}
