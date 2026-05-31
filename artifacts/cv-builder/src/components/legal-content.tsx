import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/logo";
import { CV_PRICE_FCFA } from "@/config/pricing";

interface LegalPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({ title, subtitle, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Accueil</span>
          </Link>
          <Logo height={48} />
        </div>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 w-full">
        <header className="mb-10 pb-8 border-b">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">CVPro</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2 text-sm sm:text-base">{subtitle}</p>}
          <p className="text-xs text-muted-foreground mt-4">Dernière mise à jour : mai 2026</p>
        </header>

        <article className="legal-prose space-y-8 text-sm sm:text-[15px] leading-relaxed text-foreground/90">
          {children}
        </article>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3 text-foreground">{title}</h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}

export function ConditionsContent() {
  return (
    <>
      <Section title="1. Objet">
        <p>
          Les présentes conditions générales d&apos;utilisation (« CGU ») régissent l&apos;accès et l&apos;utilisation du service CVPro,
          plateforme en ligne de création et de téléchargement de curriculum vitae au format PDF.
        </p>
        <p>
          En utilisant CVPro, vous acceptez sans réserve les présentes CGU. Si vous n&apos;acceptez pas ces conditions,
          veuillez ne pas utiliser le service.
        </p>
      </Section>

      <Section title="2. Description du service">
        <p>
          CVPro permet de créer un CV à partir de modèles professionnels, de le personnaliser via un éditeur en ligne,
          et de le télécharger en PDF après paiement d&apos;un tarif unique par document.
        </p>
        <p>
          Le service fonctionne <strong>sans création de compte utilisateur</strong>. Votre CV est associé à un identifiant
          de session anonyme stocké localement sur votre appareil (navigateur).
        </p>
      </Section>

      <Section title="3. Tarification et paiement">
        <p>
          Le téléchargement du PDF final sans filigrane est soumis au paiement du tarif affiché sur la plateforme
          au moment de la commande (actuellement {CV_PRICE_FCFA.toLocaleString("fr-FR")} FCFA par CV, sous réserve de modification).
        </p>
        <p>
          Une fois le paiement confirmé, vous pouvez retélécharger le même CV autant de fois que nécessaire,
          tant que le document est accessible via votre session et que le service conserve les données associées.
        </p>
      </Section>

      <Section title="4. Propriété intellectuelle">
        <p>
          Les modèles, l&apos;interface, la marque CVPro et les éléments graphiques du site sont protégés par le droit
          de la propriété intellectuelle. Toute reproduction non autorisée est interdite.
        </p>
        <p>
          Le contenu que vous saisissez (textes, coordonnées, expériences) reste votre propriété. Vous accordez à CVPro
          une licence limitée pour héberger, afficher et générer votre PDF le temps nécessaire à la prestation.
        </p>
      </Section>

      <Section title="5. Utilisation acceptable">
        <p>Vous vous engagez à :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>ne pas utiliser CVPro à des fins illégales ou frauduleuses ;</li>
          <li>ne pas tenter de contourner les mesures de protection des aperçus (filigranes, restrictions d&apos;export) ;</li>
          <li>ne pas surcharger ou perturber le fonctionnement du service ;</li>
          <li>fournir des informations exactes dans votre CV.</li>
        </ul>
      </Section>

      <Section title="6. Disponibilité et responsabilité">
        <p>
          CVPro est fourni « en l&apos;état ». Nous nous efforçons d&apos;assurer une disponibilité continue du service,
          sans garantie d&apos;absence d&apos;interruption. CVPro ne saurait être tenu responsable des conséquences liées
          à l&apos;utilisation du CV généré (recrutement, candidatures, etc.).
        </p>
      </Section>

      <Section title="7. Suppression des données">
        <p>
          Vous pouvez effacer les données locales de session en supprimant les cookies et le stockage local de votre navigateur.
          Les CV hébergés côté serveur peuvent être supprimés selon notre politique de conservation décrite dans la
          politique de confidentialité.
        </p>
      </Section>

      <Section title="8. Modification des CGU">
        <p>
          CVPro se réserve le droit de modifier les présentes CGU. La date de dernière mise à jour est indiquée en haut
          de cette page. L&apos;utilisation continue du service vaut acceptation des CGU modifiées.
        </p>
      </Section>

      <Section title="9. Contact">
        <p>
          Pour toute question relative aux présentes CGU, contactez-nous à{" "}
          <a href="mailto:contact@cvpro.app" className="text-primary hover:underline">contact@cvpro.app</a>.
        </p>
      </Section>
    </>
  );
}

export function ConfidentialiteContent() {
  return (
    <>
      <Section title="1. Notre engagement">
        <p>
          CVPro est conçu pour minimiser la collecte de données personnelles. <strong>Nous ne créons pas de compte utilisateur</strong> et
          ne demandons pas d&apos;inscription par e-mail ou mot de passe pour utiliser le service.
        </p>
      </Section>

      <Section title="2. Données traitées">
        <p>Dans le cadre du service, les données suivantes peuvent être traitées :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Contenu du CV</strong> : informations que vous saisissez volontairement (nom, expériences, formation, etc.) ;</li>
          <li><strong>Identifiant de session</strong> : identifiant technique anonyme (cv_id) permettant de retrouver votre brouillon ;</li>
          <li><strong>Données de paiement</strong> : montant, devise, statut et identifiant de transaction — sans stockage de numéro de carte sur nos serveurs ;</li>
          <li><strong>Photo de profil</strong> : si vous en téléversez une, elle est associée à votre session CV.</li>
        </ul>
      </Section>

      <Section title="3. Où sont stockées vos données">
        <p>
          <strong>Sur votre appareil</strong> : l&apos;identifiant de session (cv_id), votre choix de consentement cookies,
          et éventuellement une copie locale de la photo de profil sont stockés dans le localStorage de votre navigateur.
        </p>
        <p>
          <strong>Sur nos serveurs</strong> : le contenu du CV et l&apos;historique de paiement sont conservés uniquement
          pour fournir le service (sauvegarde, retéléchargement après paiement). Aucun profil utilisateur nominatif n&apos;est créé.
        </p>
      </Section>

      <Section title="4. Cookies et stockage local">
        <p>CVPro utilise les mécanismes suivants :</p>
        <div className="rounded-xl border overflow-hidden mt-3">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Nom / type</th>
                <th className="px-4 py-2.5 font-semibold">Finalité</th>
                <th className="px-4 py-2.5 font-semibold">Durée</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 font-medium">cv_id (localStorage)</td>
                <td className="px-4 py-3 text-muted-foreground">Session anonyme — retrouver votre CV</td>
                <td className="px-4 py-3 text-muted-foreground">Jusqu&apos;à suppression manuelle</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">cvpro_cookie_consent</td>
                <td className="px-4 py-3 text-muted-foreground">Mémoriser votre choix cookies</td>
                <td className="px-4 py-3 text-muted-foreground">12 mois</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">cv_photo (localStorage)</td>
                <td className="px-4 py-3 text-muted-foreground">Aperçu local de la photo de profil</td>
                <td className="px-4 py-3 text-muted-foreground">Jusqu&apos;à suppression manuelle</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          Les cookies analytiques ne sont pas activés par défaut. Vous pouvez modifier votre choix en supprimant
          la clé <code className="text-xs bg-muted px-1 py-0.5 rounded">cvpro_cookie_consent</code> du stockage local
          pour faire réapparaître le bandeau de consentement.
        </p>
      </Section>

      <Section title="5. Base légale et finalités">
        <p>
          Le traitement repose sur l&apos;exécution du contrat (fourniture du service CV) et, le cas échéant,
          sur votre consentement pour les cookies non essentiels.
        </p>
      </Section>

      <Section title="6. Vos droits">
        <p>
          Conformément à la réglementation applicable (RGPD et lois locales), vous disposez d&apos;un droit d&apos;accès,
          de rectification, de suppression et d&apos;opposition concernant vos données. Contactez{" "}
          <a href="mailto:privacy@cvpro.app" className="text-primary hover:underline">privacy@cvpro.app</a>.
        </p>
        <p>
          Vous pouvez supprimer les données locales à tout moment via les paramètres de votre navigateur.
        </p>
      </Section>

      <Section title="7. Conservation">
        <p>
          Les CV et transactions sont conservés le temps nécessaire à la fourniture du service et au retéléchargement
          après paiement, puis supprimés selon une politique de purge périodique côté serveur.
        </p>
      </Section>

      <Section title="8. Contact">
        <p>
          Délégué ou contact confidentialité :{" "}
          <a href="mailto:privacy@cvpro.app" className="text-primary hover:underline">privacy@cvpro.app</a>
        </p>
      </Section>
    </>
  );
}
