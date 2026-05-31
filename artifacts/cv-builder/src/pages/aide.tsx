import { Link } from "wouter";
import { ArrowLeft, HelpCircle } from "lucide-react";
import Logo from "@/components/logo";
import { CV_PRICE_FCFA } from "@/config/pricing";
import { BUILDER_SECTION_GUIDES } from "@/data/builder-section-guide";

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg font-semibold mb-3 text-foreground">{title}</h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}

function Example({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/40 px-4 py-3 text-sm text-foreground/90 font-mono whitespace-pre-line leading-relaxed">
      {children}
    </div>
  );
}

const SECTION_ORDER = [
  { id: "personal", label: "Informations" },
  { id: "summary", label: "Résumé" },
  { id: "experience", label: "Expériences" },
  { id: "education", label: "Formation" },
  { id: "skills", label: "Compétences" },
  { id: "languages", label: "Langues" },
  { id: "certifications", label: "Certifications" },
  { id: "projects", label: "Projets" },
  { id: "interests", label: "Intérêts" },
  { id: "customize", label: "Style" },
] as const;

export default function AidePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="sticky top-0 z-50 border-b bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Accueil</span>
          </Link>
          <Logo height={48} />
          <div className="flex-1" />
          <Link
            href="/builder"
            className="text-sm font-medium text-primary hover:underline underline-offset-2"
          >
            Ouvrir l'éditeur
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 w-full">
        <header className="mb-10 pb-8 border-b">
          <div className="flex items-center gap-2 text-primary mb-2">
            <HelpCircle className="w-5 h-5" />
            <p className="text-xs font-semibold uppercase tracking-widest">Centre d'aide</p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Comment créer et remplir votre CV
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base leading-relaxed">
            Guide pas à pas pour utiliser MonCV Pro : remplir chaque section, choisir un modèle, éviter
            les erreurs courantes et télécharger votre PDF.
          </p>
        </header>

        <nav
          aria-label="Sommaire"
          className="mb-10 p-4 rounded-lg border bg-muted/30 text-sm space-y-1.5"
        >
          <p className="font-semibold text-foreground mb-2">Sommaire</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>
              <a href="#demarrer" className="hover:text-primary underline-offset-2 hover:underline">
                Bien démarrer
              </a>
            </li>
            <li>
              <a href="#modeles" className="hover:text-primary underline-offset-2 hover:underline">
                Choisir un modèle
              </a>
            </li>
            <li>
              <a href="#sections" className="hover:text-primary underline-offset-2 hover:underline">
                Remplir chaque section
              </a>
            </li>
            <li>
              <a href="#bonnes-pratiques" className="hover:text-primary underline-offset-2 hover:underline">
                Bonnes pratiques
              </a>
            </li>
            <li>
              <a href="#telechargement" className="hover:text-primary underline-offset-2 hover:underline">
                Téléchargement et paiement
              </a>
            </li>
            <li>
              <a href="#problemes" className="hover:text-primary underline-offset-2 hover:underline">
                Problèmes fréquents
              </a>
            </li>
          </ol>
        </nav>

        <article className="space-y-10 text-sm sm:text-[15px] leading-relaxed">
          <Section id="demarrer" title="1. Bien démarrer">
            <p>
              Depuis l'accueil, cliquez sur <strong className="text-foreground">Créer mon CV</strong> ou
              allez directement à{" "}
              <Link href="/builder" className="text-primary hover:underline">
                l'éditeur
              </Link>
              . Votre CV est enregistré automatiquement sur votre appareil — aucun compte n'est requis.
            </p>
            <p>
              L'éditeur est organisé en onglets en haut du panneau gauche. Chaque onglet correspond à une
              section du CV. L'aperçu se met à jour en temps réel à droite (sur ordinateur) ou via le bouton{" "}
              <strong className="text-foreground">Aperçu</strong> sur mobile.
            </p>
            <p>
              Lors de votre première visite, l&apos;<strong className="text-foreground">Assistant CV</strong>{" "}
              s&apos;ouvre automatiquement pour vous guider. Réduisez-le en un clic : il reste visible en
              bas à gauche sous forme de pastille ronde. Cliquez dessus pour rouvrir les conseils à tout moment.
            </p>
          </Section>

          <Section id="modeles" title="2. Choisir un modèle">
            <p>
              Rendez-vous sur la page{" "}
              <Link href="/templates" className="text-primary hover:underline">
                Templates
              </Link>{" "}
              pour parcourir les modèles disponibles. Cliquez sur un modèle pour l'appliquer à votre CV en
              cours — vos textes sont conservés.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1">
              <li>
                <strong className="text-foreground">Moderne</strong> — épuré, idéal tech, marketing, startups.
              </li>
              <li>
                <strong className="text-foreground">Classique</strong> — sobre, adapté administration, finance, droit.
              </li>
              <li>
                <strong className="text-foreground">Créatif</strong> — mise en page plus marquée pour design, communication.
              </li>
              <li>
                <strong className="text-foreground">Minimal</strong> — très lisible, une page dense sans fioritures.
              </li>
            </ul>
            <p>
              Vous pouvez aussi ajuster couleur, police et taille du texte dans l'onglet{" "}
              <strong className="text-foreground">Style</strong> de l'éditeur.
            </p>
            <Example>
              {`Conseil : pour un premier emploi ou un stage, privilégiez un modèle sobre (Classique ou Minimal) avec une seule couleur d'accent.`}
            </Example>
          </Section>

          <Section id="sections" title="3. Remplir chaque section">
            <p className="mb-4">
              Voici ce que chaque onglet attend et un exemple concret pour vous inspirer :
            </p>
            <div className="space-y-8">
              {SECTION_ORDER.map(({ id, label }) => {
                const guide = BUILDER_SECTION_GUIDES[id];
                if (!guide) return null;
                return (
                  <div key={id} id={`section-${id}`} className="scroll-mt-24 border-t pt-6 first:border-t-0 first:pt-0">
                    <h3 className="font-semibold text-foreground mb-2">
                      {label} — {guide.title}
                    </h3>
                    <p className="mb-2">{guide.intro}</p>
                    <ul className="list-disc list-inside space-y-1 mb-3 pl-1">
                      {guide.tips.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                    <Example>{guide.example}</Example>
                  </div>
                );
              })}
            </div>
          </Section>

          <Section id="bonnes-pratiques" title="4. Bonnes pratiques pour un CV propre">
            <ul className="list-disc list-inside space-y-2 pl-1">
              <li>
                <strong className="text-foreground">Une page suffit</strong> si vous avez moins de 5 ans
                d'expérience ; deux pages maximum au-delà.
              </li>
              <li>
                <strong className="text-foreground">Ordre chronologique inverse</strong> pour expériences et
                formations (du plus récent au plus ancien).
              </li>
              <li>
                <strong className="text-foreground">Verbes d'action</strong> en début de puce : « Piloté »,
                « Réduit », « Formé », « Développé ».
              </li>
              <li>
                <strong className="text-foreground">Chiffres et faits</strong> plutôt que des adjectifs vagues
                (« dynamique », « sérieux »).
              </li>
              <li>
                <strong className="text-foreground">Relecture</strong> : fautes d'orthographe, numéros de
                téléphone, e-mail valide.
              </li>
              <li>
                <strong className="text-foreground">Cohérence des dates</strong> : même format partout (ex.
                Jan 2023 – Déc 2024).
              </li>
              <li>
                <strong className="text-foreground">Photo</strong> : optionnelle en France et dans de
                nombreux pays ; si vous en mettez une, qu'elle soit récente et professionnelle.
              </li>
            </ul>
            <Example>
              {`Mauvais : « Responsable des ventes, j'ai bien vendu et je suis motivé. »
Bon : « Responsable des ventes — +18 % de CA en 12 mois grâce au suivi CRM et à la formation de 3 commerciaux. »`}
            </Example>
          </Section>

          <Section id="telechargement" title="5. Téléchargement et paiement">
            <p>
              Quand votre CV est prêt, cliquez sur <strong className="text-foreground">Télécharger</strong>{" "}
              dans l'éditeur. Les champs suivants sont <strong className="text-foreground">obligatoires</strong>{" "}
              avant le téléchargement :
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Prénom et nom</li>
              <li>Profession</li>
              <li>Numéro de téléphone</li>
              <li>Adresse</li>
              <li>Résumé professionnel (au moins 20 caractères)</li>
            </ul>
            <p>
              Le téléchargement au format PDF est proposé moyennant{" "}
              <strong className="text-foreground">{CV_PRICE_FCFA} FCFA</strong> (paiement sécurisé via
              Paystack).
            </p>
            <p>
              Après paiement, vous accédez à la page de téléchargement où vous pouvez enregistrer le PDF,
              l'imprimer ou le partager via le bouton <strong className="text-foreground">Partager mon CV</strong>.
            </p>
            <p>
              Votre session reste active sur le même téléphone ou navigateur : vous pouvez revenir modifier
              votre CV sans tout recommencer.
            </p>
          </Section>

          <Section id="problemes" title="6. Problèmes fréquents">
            <div className="space-y-5">
              <div>
                <p className="font-medium text-foreground mb-1">Mon CV a disparu ou est vide au rechargement</p>
                <p>
                  Votre CV est lié à une session stockée localement (<code className="text-xs bg-muted px-1 rounded">cv_id</code>
                  ). Si vous effacez les données du navigateur ou changez d'appareil, la session est perdue.
                  En environnement de démonstration, un redémarrage du serveur peut aussi réinitialiser les
                  données. Reprenez depuis l'éditeur : un nouveau CV sera créé automatiquement.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Le PDF est blanc ou incomplet</p>
                <p>
                  Attendez que l'aperçu soit entièrement chargé avant de télécharger. Vérifiez que vos
                  sections contiennent du texte. Si le problème persiste, rafraîchissez la page de
                  téléchargement après le paiement.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">La photo ne s'affiche pas</p>
                <p>
                  Utilisez une image JPG ou PNG de taille raisonnable (moins de 2 Mo). La photo est stockée
                  localement sur votre appareil en plus du serveur.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Je ne vois pas l'aperçu sur mobile</p>
                <p>
                  Sur petit écran, l'aperçu n'est pas affiché en permanence. Appuyez sur le bouton{" "}
                  <strong className="text-foreground">Aperçu</strong> en haut à droite de l'éditeur pour
                  l'ouvrir en plein écran.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Le paiement affiche un mauvais montant</p>
                <p>
                  Le montant correct est <strong className="text-foreground">{CV_PRICE_FCFA} FCFA</strong>.
                  Si vous voyez un montant incorrect, rafraîchissez la page et relancez le paiement. En cas
                  de débit sans téléchargement, conservez votre reçu Paystack et contactez le support.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Les conseils contextuels s'affichent encore</p>
                <p>
                  Cliquez sur <strong className="text-foreground">Ne plus afficher les conseils</strong> dans
                  le bandeau d'aide, ou sur la croix pour les masquer définitivement. Ils ne réapparaîtront
                  pas tant que vous conservez les données locales du navigateur.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Cookies et confidentialité</p>
                <p>
                  Consultez notre page{" "}
                  <Link href="/confidentialite" className="text-primary hover:underline">
                    Confidentialité & cookies
                  </Link>{" "}
                  pour comprendre ce qui est stocké sur votre appareil et comment gérer vos préférences.
                </p>
              </div>
            </div>
          </Section>
        </article>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row sm:items-center gap-4">
          <Link
            href="/builder"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Commencer mon CV
          </Link>
          <p className="text-sm text-muted-foreground">
            Besoin d'un modèle ?{" "}
            <Link href="/templates" className="text-primary hover:underline">
              Voir les templates
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
