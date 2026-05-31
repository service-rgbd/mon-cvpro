const CONSENT_KEY = "cvpro_cookie_consent";

export type CookieConsentChoice = {
  essential: true;
  analytics: boolean;
  decidedAt: string;
};

export function getCookieConsent(): CookieConsentChoice | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentChoice;
    if (parsed.essential !== true || typeof parsed.analytics !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveCookieConsent(analytics: boolean) {
  const choice: CookieConsentChoice = {
    essential: true,
    analytics,
    decidedAt: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(choice));
}

export function hasCookieConsentDecision(): boolean {
  return getCookieConsent() !== null;
}
