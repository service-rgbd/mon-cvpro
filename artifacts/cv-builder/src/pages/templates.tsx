import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CvPreview from "@/components/cv-preview";
import Logo from "@/components/logo";
import { CV_TEMPLATES, CATEGORY_LABELS } from "@/data/templates";
import { defaultCvData } from "@/types/cv";

const SAMPLE_CV = {
  ...defaultCvData,
  personalInfo: {
    firstName: "Marie",
    lastName: "Dupont",
    profession: "Ingénieure Logiciel Senior",
    phone: "+33 7 98 76 54 32",
    email: "marie.dupont@email.com",
    address: "Lyon, France",
    linkedin: "linkedin.com/in/mariedupont",
    summary: "Développeuse full-stack avec 6 ans d'expérience dans la conception d'architectures scalables et la livraison de produits SaaS à fort impact.",
    photoUrl: null,
  },
  experiences: [
    { id: "1", company: "Innovatech SAS", position: "Lead Developer", city: "Lyon", startDate: "2020", current: true, description: "Architecture et développement d'une plateforme B2B en React/Node.js, 50k utilisateurs actifs." },
    { id: "2", company: "WebFactory", position: "Développeuse Frontend", city: "Paris", startDate: "2018", endDate: "2020", current: false, description: "Intégration d'interfaces UI complexes, migration vers TypeScript." },
  ],
  education: [
    { id: "1", school: "INSA Lyon", degree: "Ingénieur Informatique", field: "Génie Logiciel", year: "2018" },
  ],
  skills: [
    { id: "1", name: "React / TypeScript", level: 5, category: "technical" as const },
    { id: "2", name: "Node.js", level: 4, category: "technical" as const },
    { id: "3", name: "PostgreSQL", level: 4, category: "computer" as const },
    { id: "4", name: "Leadership", level: 4, category: "soft" as const },
  ],
  languages: [
    { id: "1", language: "Français", level: "native" as const },
    { id: "2", language: "Anglais", level: "fluent" as const },
  ],
  interests: [{ id: "1", name: "Open Source" }, { id: "2", name: "Trail" }],
};

const TEMPLATES = CV_TEMPLATES;

const CATEGORY_LABELS_MAP = CATEGORY_LABELS;

export default function Templates() {
  const [selected, setSelected] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const handleSelect = (templateId: string) => {
    setSelected(templateId);
    localStorage.setItem("cv_selected_template", templateId);
    setTimeout(() => setLocation("/builder"), 300);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Accueil</span>
          </Link>
          <Logo height={56} />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Choisissez votre template
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Chaque template est conçu par des experts RH pour maximiser vos chances. Cliquez pour sélectionner et commencer.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-6">
          {TEMPLATES.map((t) => (
            <div
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className={`group relative rounded-2xl border-2 overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 ${selected === t.id ? "border-primary shadow-lg shadow-primary/20" : "border-border hover:border-primary/50"}`}
              data-testid={`card-template-${t.id}`}
            >
              {/* CV Preview */}
              <div className="relative bg-white" style={{ height: "360px", overflow: "hidden" }}>
                <div style={{ transform: "scale(0.52)", transformOrigin: "top left", width: "539px", height: "693px" }}>
                  <CvPreview cv={{ ...SAMPLE_CV, customization: { ...SAMPLE_CV.customization, templateId: t.id, primaryColor: t.color } }} />
                </div>
                {selected === t.id && (
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-3">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5 border-t bg-card">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: t.color + "20", color: t.color }}>
                        {CATEGORY_LABELS_MAP[t.category]}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg">{t.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t.desc}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full shrink-0 ml-3 mt-1" style={{ backgroundColor: t.color }} />
                </div>
                <Button className="w-full mt-4 gap-2 group-hover:gap-3 transition-all" variant={selected === t.id ? "default" : "outline"} data-testid={`button-select-${t.id}`}>
                  {selected === t.id ? "Sélectionné" : "Utiliser ce template"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
