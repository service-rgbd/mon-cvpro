import { Link, useLocation } from "wouter";
import FooterLogo from "@/components/footer-logo";

const FOOTER_NAV = {
  Produit: [
    { href: "/builder", label: "Créer un CV" },
    { href: "/templates", label: "Templates" },
    { href: "/aide", label: "Centre d'aide" },
  ],
  Légal: [
    { href: "/conditions", label: "Conditions d'utilisation" },
    { href: "/confidentialite", label: "Confidentialité & cookies" },
  ],
};

export default function SiteFooter() {
  const [location] = useLocation();

  if (location === "/builder" || location === "/download" || location === "/payment") return null;

  return (
    <footer className="border-t bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-[1.2fr,1fr] lg:grid-cols-[1.4fr,1fr,1fr]">
          <div>
            <FooterLogo height={72} href="/" />
            <p className="text-sm text-muted-foreground mt-4 max-w-sm leading-relaxed">
              MonCV Pro — créateur de CV professionnel. Créez, personnalisez et téléchargez votre PDF sans créer de compte.
            </p>
          </div>

          {Object.entries(FOOTER_NAV).map(([title, links]) => (
            <div key={title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">{title}</p>
              <nav aria-label={title} className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MonCV Pro. Tous droits réservés.</p>
          <p className="sm:text-right">Session anonyme — vos données restent sur votre appareil.</p>
        </div>
      </div>
    </footer>
  );
}
