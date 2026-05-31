import { setBaseUrl } from "@workspace/api-client-react";

/** URL de l'API en prod (ex. https://ci-cv.binary-security.com). Vide en local → proxy Vite /api */
export function configureApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!raw?.trim()) return;
  setBaseUrl(raw.trim().replace(/\/+$/, ""));
}
