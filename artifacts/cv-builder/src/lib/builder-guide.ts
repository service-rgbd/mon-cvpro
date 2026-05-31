import { hasCookieConsentDecision } from "@/lib/cookie-consent";

const BUILDER_GUIDE_KEY = "cvpro_builder_guide_dismissed";

export function isBuilderGuideDismissed(): boolean {
  try {
    return localStorage.getItem(BUILDER_GUIDE_KEY) === "true";
  } catch {
    return false;
  }
}

export function dismissBuilderGuide(): void {
  try {
    localStorage.setItem(BUILDER_GUIDE_KEY, "true");
  } catch {
    /* ignore */
  }
}

/** Affiche les conseils contextuels sauf pour un utilisateur déjà familiarisé. */
export function shouldShowBuilderGuide(): boolean {
  if (isBuilderGuideDismissed()) return false;

  try {
    const hasSession = !!localStorage.getItem("cv_id");
    if (hasCookieConsentDecision() && hasSession) return false;
  } catch {
    /* ignore */
  }

  return true;
}
