import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Cookie, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCookieConsent, hasCookieConsentDecision, saveCookieConsent } from "@/lib/cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    setVisible(!hasCookieConsentDecision());
    const existing = getCookieConsent();
    if (existing) setAnalytics(existing.analytics);
  }, []);

  const accept = (withAnalytics: boolean) => {
    saveCookieConsent(withAnalytics);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-border/80 bg-white shadow-[0_-8px_30px_rgba(15,23,42,0.08)]"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Cookie className="w-5 h-5 text-primary shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <h2 id="cookie-consent-title" className="font-semibold text-sm sm:text-base">
                Cookies & confidentialité
              </h2>
              <p id="cookie-consent-desc" className="text-sm text-muted-foreground mt-1 leading-relaxed">
                CVPro utilise des cookies essentiels pour votre session de création de CV (sans compte).
                Consultez notre{" "}
                <Link href="/confidentialite" className="text-primary hover:underline font-medium">
                  politique de confidentialité
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:shrink-0 sm:items-center">
            <Button size="sm" onClick={() => accept(expanded ? analytics : false)}>
              {expanded && analytics ? "Enregistrer" : "Tout accepter"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => accept(false)}>
              Essentiels uniquement
            </Button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground py-2 transition-colors"
              onClick={() => setExpanded((v) => !v)}
            >
              Personnaliser
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-border/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-8">
              <div className="flex-1">
                <p className="text-sm font-medium">Cookies essentiels</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Session anonyme et mémorisation de votre choix. Toujours actifs.
                </p>
              </div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-primary shrink-0">
                Obligatoire
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-border/40">
              <div className="flex-1">
                <p className="text-sm font-medium">Cookies analytiques</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Mesure d&apos;audience anonymisée. Non utilisés actuellement — refus sans impact.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={analytics}
                aria-label="Activer les cookies analytiques"
                onClick={() => setAnalytics((v) => !v)}
                className={`relative w-11 h-6 shrink-0 transition-colors ${analytics ? "bg-primary" : "bg-muted-foreground/25"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white shadow-sm transition-transform ${analytics ? "translate-x-5" : ""}`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
