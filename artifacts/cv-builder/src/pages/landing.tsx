import { Link } from "wouter";
import { CheckCircle, ArrowRight, Star, Users, Download, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import CvPreview from "@/components/cv-preview";
import { defaultCvData } from "@/types/cv";

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
  { icon: Zap, title: "Aperçu en temps réel", description: "Chaque modification apparaît instantanément dans votre CV. Voyez le résultat final au fur et à mesure." },
  { icon: Star, title: "Templates premium", description: "4 modèles de CV professionnels conçus pour impressionner les recruteurs dans tous les secteurs." },
  { icon: Download, title: "Téléchargement PDF", description: "Exportez votre CV en PDF haute qualité, optimisé pour l'impression et les candidatures en ligne." },
  { icon: Users, title: "Pour tous les profils", description: "Étudiant, professionnel, freelance ou cadre dirigeant — CVPro s'adapte à votre niveau et secteur." },
];

const TEMPLATES_PREVIEW = [
  { id: "modern", name: "Modern", color: "#4F46E5", desc: "Épuré et impactant" },
  { id: "creative", name: "Créatif", color: "#7C3AED", desc: "Moderne et audacieux" },
  { id: "classic", name: "Classique", color: "#1e293b", desc: "Sobre et institutionnel" },
  { id: "executive", name: "Exécutif", color: "#B45309", desc: "Haut de gamme et premium" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-lg tracking-tight">CVPro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Templates
            </Link>
            <Link href="/builder">
              <Button size="sm" data-testid="button-start-nav">Créer mon CV</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <Star className="w-3 h-3 fill-primary" />
              Générateur de CV professionnel
            </div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight mb-6">
              Votre CV de{" "}
              <span className="text-primary">carrière</span>{" "}
              en quelques minutes
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Créez un CV moderne et professionnel avec un aperçu en temps réel. Choisissez parmi nos templates premium, personnalisez à votre image, et téléchargez en PDF.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/builder">
                <Button size="lg" className="gap-2" data-testid="button-start-hero">
                  Commencer maintenant
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" data-testid="button-view-templates">Voir les templates</Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              {["Aperçu temps réel", "4 templates premium", "Export PDF", "Personnalisation"].map((f) => (
                <div key={f} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* CV Preview */}
          <div className="relative flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/10 rounded-2xl blur-3xl -z-10 scale-110" />
              <div className="rounded-xl overflow-hidden shadow-2xl border bg-white" style={{ width: "280px", height: "360px" }}>
                <div style={{ transform: "scale(0.52)", transformOrigin: "top left", width: "539px", height: "692px" }}>
                  <CvPreview cv={SAMPLE_CV} />
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -right-6 top-8 bg-white rounded-xl shadow-lg border px-3 py-2 text-xs font-medium">
                <div className="flex items-center gap-1.5 text-green-600">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Mise à jour en direct
                </div>
              </div>
              <div className="absolute -left-6 bottom-12 bg-white rounded-xl shadow-lg border px-3 py-2">
                <div className="text-xs font-semibold">Téléchargé</div>
                <div className="text-xs text-muted-foreground">PDF professionnel</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Tout ce dont vous avez besoin</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Une plateforme complète pour créer le CV qui fera la différence.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates preview */}
      <section className="bg-muted/30 border-t border-b">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Templates conçus pour impressionner</h2>
            <p className="text-muted-foreground">Chaque template est optimisé pour les recruteurs et les ATS modernes.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TEMPLATES_PREVIEW.map((t) => (
              <Link key={t.id} href="/templates" className="group block">
                <div className="relative rounded-xl overflow-hidden border shadow-sm group-hover:shadow-lg transition-all group-hover:-translate-y-1 bg-white" style={{ height: "220px" }}>
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: t.color + "15" }}>
                    <div className="w-full h-full" style={{ transform: "scale(0.38)", transformOrigin: "center center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: "210mm", minHeight: "297mm", backgroundColor: "white" }}>
                        <CvPreview cv={{ ...SAMPLE_CV, customization: { ...SAMPLE_CV.customization, templateId: t.id, primaryColor: t.color } }} />
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-white/70 text-xs">{t.desc}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Prêt à créer votre CV ?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">Rejoignez des milliers de professionnels qui ont déjà utilisé CVPro pour décrocher leur poste.</p>
        <Link href="/builder">
          <Button size="lg" className="gap-2" data-testid="button-start-cta">
            Créer mon CV gratuitement
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">C</span>
            </div>
            <span className="font-bold text-sm">CVPro</span>
          </div>
          <p className="text-sm text-muted-foreground">CVPro — Créateur de CV professionnel</p>
        </div>
      </footer>
    </div>
  );
}
