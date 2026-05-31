import { Link } from "wouter";
import { CheckCircle, ArrowRight, Star, Users, Download, Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import CvPreview from "@/components/cv-preview";
import { defaultCvData } from "@/types/cv";
import { CV_TEMPLATES } from "@/data/templates";

const HERO_IMAGE = `${import.meta.env.BASE_URL}hero-personas.png`;
const PREVIEW_TEMPLATES = CV_TEMPLATES.slice(0, 4);

const SAMPLE_CV = {
  ...defaultCvData,
  personalInfo: {
    firstName: "Sophie",
    lastName: "Martin",
    profession: "Directrice Marketing Digital",
    phone: "+33 6 12 34 56 78",
    email: "sophie.martin@email.com",
    address: "Paris, France",
    linkedin: "linkedin.com/in/sophiemartin",
    summary: "Professionnelle avec 8 ans d'expérience en marketing digital, spécialisée dans la stratégie de contenu et la croissance organique. Passionnée par la data et l'innovation.",
    photoUrl: null,
  },
  experiences: [
    { id: "1", company: "TechVision Paris", position: "Directrice Marketing", city: "Paris", startDate: "2021", current: true, description: "Direction d'une équipe de 12 personnes, croissance de 180% du trafic organique." },
    { id: "2", company: "StartupHub", position: "Marketing Manager", city: "Lyon", startDate: "2018", endDate: "2021", current: false, description: "Lancement de 3 campagnes d'acquisition majeures." },
  ],
  education: [
    { id: "1", school: "HEC Paris", degree: "Master Grande École", field: "Marketing & Stratégie", year: "2017" },
  ],
  skills: [
    { id: "1", name: "Marketing Digital", level: 5, category: "technical" as const },
    { id: "2", name: "SEO / SEA", level: 4, category: "technical" as const },
    { id: "3", name: "Google Analytics", level: 5, category: "computer" as const },
    { id: "4", name: "Leadership", level: 4, category: "soft" as const },
  ],
  languages: [
    { id: "1", language: "Français", level: "native" as const },
    { id: "2", language: "Anglais", level: "fluent" as const },
    { id: "3", language: "Espagnol", level: "intermediate" as const },
  ],
  interests: [{ id: "1", name: "Photographie" }, { id: "2", name: "Voyages" }, { id: "3", name: "Yoga" }],
};

const FEATURES = [
  { icon: Zap, title: "Aperçu en temps réel", description: "Chaque modification apparaît instantanément dans votre CV." },
  { icon: Star, title: "Templates premium", description: "8 modèles professionnels pour tous les secteurs." },
  { icon: Download, title: "Téléchargement PDF", description: "Export haute qualité, optimisé impression et ATS." },
  { icon: Users, title: "Pour tous les profils", description: "Étudiant, pro, freelance ou cadre — CVPro s'adapte." },
];

function TemplatePreviewCard({ templateId, color, name }: { templateId: string; color: string; name: string }) {
  return (
    <div className="group block">
      <div className="relative overflow-hidden bg-white" style={{ height: "200px" }}>
        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${color}12` }}>
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ transform: "scale(0.36)", transformOrigin: "center center" }}
          >
            <div style={{ width: "210mm", minHeight: "297mm", backgroundColor: "white" }}>
              <CvPreview
                cv={{
                  ...SAMPLE_CV,
                  customization: { ...SAMPLE_CV.customization, templateId, primaryColor: color },
                }}
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2.5">
          <p className="text-white font-medium text-sm">{name}</p>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-24 sm:h-28 flex items-center justify-between gap-3">
          <Logo height={96} />
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Link href="/templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
              Templates
            </Link>
            <Link href="/aide" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
              Aide
            </Link>
            <Link href="/builder">
              <Button size="sm" data-testid="button-start-nav">Créer mon CV</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-white">
        <div
          className="absolute inset-y-0 right-0 hidden lg:block w-[52%] bg-no-repeat bg-right bg-contain pointer-events-none select-none"
          style={{ backgroundImage: `url(${HERO_IMAGE})`, backgroundPosition: "right center" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 right-0 hidden lg:block w-[52%] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #ffffff 0%, #ffffff 28%, rgba(255,255,255,0.88) 42%, transparent 58%)",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 lg:pt-20 lg:pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-5">
                <Star className="w-3.5 h-3.5 fill-primary" />
                Générateur de CV professionnel
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-5">
                Votre CV de{" "}
                <span className="text-primary">carrière</span>{" "}
                en quelques minutes
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-7">
                Créez un CV moderne avec aperçu en temps réel. Personnalisez, puis téléchargez en PDF.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/builder">
                  <Button size="lg" className="gap-2" data-testid="button-start-hero">
                    Commencer maintenant
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button size="lg" variant="outline" data-testid="button-view-templates">
                    Voir les templates
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-7">
                {["Aperçu temps réel", "8 templates premium", "Export PDF", "Personnalisation"].map((f) => (
                  <div key={f} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:hidden w-full flex justify-center">
              <img
                src={HERO_IMAGE}
                alt="Professionnelles utilisant CVPro"
                className="w-full max-w-md object-contain object-center"
                loading="eager"
              />
            </div>

            <div className="hidden lg:block min-h-[480px]" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-24">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Une plateforme complète pour créer le CV qui fera la différence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-x-10 sm:gap-y-10 lg:gap-8 max-w-5xl lg:max-w-none mx-auto">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="flex flex-col border-b border-border/60 pb-8 last:border-b-0 sm:border-b-0 sm:pb-0"
              >
                <div className="w-10 h-10 rounded-full bg-primary/8 flex items-center justify-center mb-4 shrink-0">
                  <f.icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-semibold mb-2 leading-snug">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Templates — 4 aperçus */}
      <section className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="mb-10 sm:mb-12 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Templates conçus pour impressionner</h2>
            <p className="text-muted-foreground">Optimisés pour les recruteurs et les ATS modernes.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl lg:max-w-none mx-auto">
            {PREVIEW_TEMPLATES.map((t) => (
              <Link key={t.id} href="/templates" className="block">
                <TemplatePreviewCard templateId={t.id} color={t.color} name={t.name} />
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center">
            <Link
              href="/templates"
              className="inline-flex flex-col items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
            >
              <span>Découvrir le reste</span>
              <ChevronDown className="w-4 h-4 animate-bounce text-primary/70 group-hover:text-primary" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Prêt à créer votre CV ?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Rejoignez des milliers de professionnels qui ont déjà utilisé CVPro pour décrocher leur poste.
          </p>
          <Link href="/builder">
            <Button size="lg" className="gap-2" data-testid="button-start-cta">
              Créer mon CV gratuitement
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
