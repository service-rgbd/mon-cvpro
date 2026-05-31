import { useState, useEffect, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Link } from "wouter";
import {
  ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, Upload,
  Download, Eye, Settings2, User, Briefcase, GraduationCap,
  Star, Globe, Award, FolderOpen, Heart, AlignLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import CvPreviewScaled from "@/components/cv-preview-scaled";
import Logo from "@/components/logo";
import { CV_TEMPLATES } from "@/data/templates";
import {
  useCreateCv,
  useUpdateCv,
  useGetCv,
  getGetCvQueryKey,
} from "@workspace/api-client-react";
import { CvData, defaultCvData, cvFromApi, Experience, Education, Skill, Language, Certification, Project, Interest } from "@/types/cv";
import { useToast } from "@/hooks/use-toast";
import { clearCvSession, isNotFoundError } from "@/lib/cv-session";
import { shouldShowBuilderGuide } from "@/lib/builder-guide";
import { getCvMissingRequiredFields, isCvReadyForDownload } from "@/lib/cv-validation";
import { buildCvUpdatePayload } from "@/lib/cv-persist";
import CvAssistant from "@/components/cv-assistant";
import SectionHeader from "@/components/section-header";

function nanoid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const SECTIONS = [
  { id: "personal", label: "Informations", icon: User },
  { id: "summary", label: "Résumé", icon: AlignLeft },
  { id: "experience", label: "Expériences", icon: Briefcase },
  { id: "education", label: "Formation", icon: GraduationCap },
  { id: "skills", label: "Compétences", icon: Star },
  { id: "languages", label: "Langues", icon: Globe },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "projects", label: "Projets", icon: FolderOpen },
  { id: "interests", label: "Intérêts", icon: Heart },
  { id: "customize", label: "Style", icon: Settings2 },
];

const FONT_OPTIONS = ["Inter", "Georgia", "Times New Roman", "Arial", "Helvetica", "Roboto"];
const COLORS = ["#5D5CFF", "#7C3AED", "#059669", "#DC2626", "#D97706", "#0891B2", "#1e293b", "#B45309"];
const LEVEL_LABELS: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
  fluent: "Courant",
  native: "Langue maternelle",
};

export default function Builder() {
  const [cv, setCv] = useState<CvData>(() => {
    // Try to restore from localStorage
    const savedTemplate = localStorage.getItem("cv_selected_template");
    const savedPhoto = localStorage.getItem("cv_photo");
    return {
      ...defaultCvData,
      personalInfo: {
        ...defaultCvData.personalInfo,
        photoUrl: savedPhoto || null,
      },
      customization: {
        ...defaultCvData.customization,
        templateId: savedTemplate || "modern",
      },
    };
  });
  const [activeSection, setActiveSection] = useState("personal");
  const [assistantInitiallyExpanded] = useState(shouldShowBuilderGuide);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewForDownload, setPreviewForDownload] = useState(false);
  const [cvId, setCvId] = useState<string | null>(() => localStorage.getItem("cv_id"));
  const [saving, setSaving] = useState(false);
  const [loadingCv, setLoadingCv] = useState(() => !!localStorage.getItem("cv_id"));
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHydratedRef = useRef(false);
  const [flushing, setFlushing] = useState(false);

  const createCv = useCreateCv();
  const updateCv = useUpdateCv();
  const { data: serverCv, isLoading: fetchingCv, isError, error: cvFetchError } = useGetCv(cvId ?? "", {
    query: { enabled: !!cvId, retry: false },
  });

  // CV introuvable en base (ex. redémarrage API avec DATABASE_URL=memory://)
  useEffect(() => {
    if (!cvId || fetchingCv || !isError || !isNotFoundError(cvFetchError)) return;

    clearCvSession();
    setCvId(null);
    isHydratedRef.current = false;
    setLoadingCv(false);
    toast({
      title: "Session expirée",
      description: "Votre CV n'est plus sur le serveur. Un nouveau brouillon va être créé.",
    });
  }, [cvId, fetchingCv, isError, cvFetchError, toast]);

  // Restaurer le CV depuis l'API après rafraîchissement
  useEffect(() => {
    if (!cvId || fetchingCv) return;

    if (serverCv && !isHydratedRef.current) {
      const restored = cvFromApi(serverCv as Record<string, unknown>, localStorage.getItem("cv_photo"));
      setCv(restored);
      if (restored.personalInfo.photoUrl) {
        localStorage.setItem("cv_photo", restored.personalInfo.photoUrl);
      }
      isHydratedRef.current = true;
      setLoadingCv(false);
      return;
    }

    if (!serverCv) {
      isHydratedRef.current = true;
      setLoadingCv(false);
    }
  }, [cvId, serverCv, fetchingCv]);

  // Créer un CV uniquement s'il n'existe pas encore
  useEffect(() => {
    if (cvId) return;

    createCv.mutate(
      { data: { personalInfo: cv.personalInfo, customization: cv.customization } },
      {
        onSuccess: (data: any) => {
          const id = data.id;
          setCvId(id);
          localStorage.setItem("cv_id", id);
          isHydratedRef.current = true;
          setLoadingCv(false);
        },
        onError: () => {
          toast({ title: "Erreur", description: "Impossible de créer le CV.", variant: "destructive" });
          setLoadingCv(false);
        },
      },
    );
  }, [cvId]);

  const persistCv = useCallback(
    (data: CvData, id: string) =>
      new Promise<void>((resolve, reject) => {
        updateCv.mutate(
          { id, data: buildCvUpdatePayload(data) },
          {
            onSuccess: (saved) => {
              queryClient.setQueryData(getGetCvQueryKey(id), saved);
              resolve();
            },
            onError: () => reject(new Error("save_failed")),
          },
        );
      }),
    [updateCv, queryClient],
  );

  /** Enregistre immédiatement sur le serveur (avant téléchargement / paiement). */
  const flushAutoSave = useCallback(async (): Promise<boolean> => {
    const id = cvId || localStorage.getItem("cv_id");
    if (!id || !isHydratedRef.current) return true;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    setFlushing(true);
    try {
      await persistCv(cv, id);
      return true;
    } catch {
      toast({
        title: "Enregistrement impossible",
        description: "Vérifiez votre connexion et réessayez.",
        variant: "destructive",
      });
      return false;
    } finally {
      setFlushing(false);
      setSaving(false);
    }
  }, [cv, cvId, persistCv, toast]);

  // Debounced auto-save
  const scheduleAutoSave = useCallback(
    (newCv: CvData) => {
      if (!isHydratedRef.current) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        const id = cvId || localStorage.getItem("cv_id");
        if (!id) return;
        setSaving(true);
        void persistCv(newCv, id).finally(() => setSaving(false));
      }, 800);
    },
    [cvId, persistCv],
  );

  const updateCvState = useCallback((updater: (prev: CvData) => CvData) => {
    setCv((prev) => {
      const next = updater(prev);
      scheduleAutoSave(next);
      return next;
    });
  }, [scheduleAutoSave]);

  const updatePersonalInfo = (field: string, value: string) => {
    updateCvState((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      localStorage.setItem("cv_photo", dataUrl);
      updateCvState((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, photoUrl: dataUrl },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleOpenPreviewForDownload = () => {
    const missing = getCvMissingRequiredFields(cv);
    if (missing.length > 0) {
      toast({
        title: "Informations obligatoires manquantes",
        description: `Complétez : ${missing.map((f) => f.label).join(", ")}`,
        variant: "destructive",
      });
      setActiveSection(missing[0].sectionId);
      return;
    }
    setPreviewForDownload(true);
    setPreviewOpen(true);
  };

  const handleContinueToDownload = async () => {
    const missing = getCvMissingRequiredFields(cv);
    if (missing.length > 0) {
      toast({
        title: "Informations obligatoires manquantes",
        description: `Complétez : ${missing.map((f) => f.label).join(", ")}`,
        variant: "destructive",
      });
      setActiveSection(missing[0].sectionId);
      return;
    }

    const ok = await flushAutoSave();
    if (!ok) return;

    setPreviewOpen(false);
    setPreviewForDownload(false);
    setLocation("/download");
  };

  const handleOpenEditorPreview = () => {
    setPreviewForDownload(false);
    setPreviewOpen(true);
  };

  const canDownload = isCvReadyForDownload(cv);

  /** Aperçu éditeur toujours protégé — version nette uniquement sur /download après paiement */
  const previewWatermarked = !loadingCv;

  useEffect(() => {
    if (!previewOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewOpen(false);
        setPreviewForDownload(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [previewOpen]);

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="border-b bg-white shrink-0 h-20 flex items-center px-4 gap-4 z-20">
        <Link href="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Accueil</span>
        </Link>
        <Logo height={56} />
        <div className="flex-1" />
        {(saving || flushing) && (
          <span className="text-xs text-muted-foreground">
            {flushing ? "Synchronisation…" : "Enregistrement…"}
          </span>
        )}
        <Link href="/templates">
          <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
            <Eye className="w-4 h-4" />
            Templates
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 lg:hidden shrink-0"
          onClick={handleOpenEditorPreview}
          disabled={loadingCv}
          data-testid="button-mobile-preview"
        >
          <Eye className="w-4 h-4" />
          Aperçu
        </Button>
        <Button
          size="sm"
          className="gap-2 shrink-0"
          onClick={handleOpenPreviewForDownload}
          disabled={loadingCv || flushing || !canDownload}
          data-testid="button-download"
          title={
            !canDownload
              ? "Remplissez prénom, nom, profession, téléphone, adresse et résumé pour télécharger"
              : undefined
          }
        >
          <Download className="w-4 h-4" />
          Télécharger
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — form */}
        <div className="w-full lg:w-[420px] xl:w-[460px] flex flex-col shrink-0 border-r overflow-hidden">
          {/* Section tabs */}
          <div className="border-b overflow-x-auto shrink-0">
            <div className="flex">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                    activeSection === s.id
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  data-testid={`tab-${s.id}`}
                >
                  <s.icon className="w-4 h-4" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {!canDownload && !loadingCv && (
            <p className="text-xs text-amber-800 bg-amber-50 border-b border-amber-100 px-4 py-2 shrink-0">
              Pour télécharger : prénom, nom, profession, téléphone, adresse et un bref résumé sont requis.
            </p>
          )}

          {/* Form content */}
          <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
            {loadingCv ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3" />
                Chargement de votre CV...
              </div>
            ) : (
              <>
            {activeSection === "personal" && (
              <PersonalSection cv={cv} onChange={updatePersonalInfo} onPhotoUpload={handlePhotoUpload} />
            )}
            {activeSection === "summary" && (
              <SummarySection cv={cv} onChange={(val) => updatePersonalInfo("summary", val)} />
            )}
            {activeSection === "experience" && (
              <ExperienceSection cv={cv} onChange={(experiences) => updateCvState((p) => ({ ...p, experiences }))} />
            )}
            {activeSection === "education" && (
              <EducationSection cv={cv} onChange={(education) => updateCvState((p) => ({ ...p, education }))} />
            )}
            {activeSection === "skills" && (
              <SkillsSection cv={cv} onChange={(skills) => updateCvState((p) => ({ ...p, skills }))} />
            )}
            {activeSection === "languages" && (
              <LanguagesSection cv={cv} onChange={(languages) => updateCvState((p) => ({ ...p, languages }))} />
            )}
            {activeSection === "certifications" && (
              <CertificationsSection cv={cv} onChange={(certifications) => updateCvState((p) => ({ ...p, certifications }))} />
            )}
            {activeSection === "projects" && (
              <ProjectsSection cv={cv} onChange={(projects) => updateCvState((p) => ({ ...p, projects }))} />
            )}
            {activeSection === "interests" && (
              <InterestsSection cv={cv} onChange={(interests) => updateCvState((p) => ({ ...p, interests }))} />
            )}
            {activeSection === "customize" && (
              <CustomizeSection cv={cv} onChange={(customization) => updateCvState((p) => ({ ...p, customization }))} />
            )}
              </>
            )}
          </div>
        </div>

        {/* Right panel — live preview */}
        <div className="hidden lg:flex flex-1 bg-muted/40 items-start justify-center overflow-auto p-6">
          <div className="sticky top-6 w-full flex justify-center">
            {loadingCv ? (
              <div
                className="rounded-xl border bg-white shadow-2xl flex items-center justify-center text-muted-foreground text-sm"
                style={{ width: 520, height: 420 }}
              >
                Chargement de l'aperçu...
              </div>
            ) : (
              <CvPreviewScaled
                cv={cv}
                maxWidth={520}
                stylePreviewFilter={activeSection === "customize"}
                watermarked={previewWatermarked}
                watermarkMode="editor"
              />
            )}
          </div>
        </div>
      </div>

      {previewOpen && (
        <div
          className={`fixed inset-0 z-[150] flex flex-col bg-white ${previewForDownload ? "" : "lg:hidden"}`}
        >
          <div className="shrink-0 h-14 px-4 border-b flex items-center justify-between bg-white">
            <p className="text-sm font-semibold">
              {previewForDownload ? "Aperçu de votre CV" : "Aperçu en temps réel"}
            </p>
            {!previewForDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewOpen(false)}
              >
                Fermer
              </Button>
            )}
          </div>
          <div className="flex-1 min-h-0 p-4 bg-slate-50/50">
            {loadingCv ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                Chargement de l&apos;aperçu…
              </div>
            ) : (
              <CvPreviewScaled
                cv={cv}
                fit="contain"
                maxWidth={720}
                className="h-full w-full"
                stylePreviewFilter={activeSection === "customize"}
                watermarked={previewWatermarked}
                watermarkMode="editor"
              />
            )}
          </div>
          <div className="shrink-0 px-4 py-3 border-t bg-white flex gap-2">
            {previewForDownload ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => {
                    setPreviewOpen(false);
                    setPreviewForDownload(false);
                  }}
                >
                  Retour à l&apos;édition
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => void handleContinueToDownload()}
                  disabled={flushing}
                  data-testid="button-continue-download"
                >
                  {flushing ? "Enregistrement…" : "Continuer vers Télécharger"}
                  <Download className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="w-full"
                onClick={() => setPreviewOpen(false)}
              >
                Fermer
              </Button>
            )}
          </div>
        </div>
      )}

      {!loadingCv && (
        <CvAssistant
          cv={cv}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onPersonalInfoChange={updatePersonalInfo}
          onCvUpdate={updateCvState}
          onGoToPreview={handleOpenPreviewForDownload}
          initialExpanded={assistantInitiallyExpanded}
        />
      )}
    </div>
  );
}

// ===================== SECTION COMPONENTS =====================

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs mb-1.5 block text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function PersonalSection({ cv, onChange, onPhotoUpload }: {
  cv: CvData;
  onChange: (field: string, value: string) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const pi = cv.personalInfo;
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <SectionHeader title="Informations personnelles" sectionId="personal" />
      {/* Photo */}
      <div className="flex items-center gap-4 mb-5 p-3 rounded-lg border bg-muted/20">
        <div className={`w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 overflow-hidden flex items-center justify-center bg-muted/30 ${pi.photoUrl ? "border-solid border-primary/30" : ""}`}>
          {pi.photoUrl ? (
            <img src={pi.photoUrl} alt="Photo" className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-muted-foreground/40" />
          )}
        </div>
        <div className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            data-testid="button-upload-photo"
          >
            <Upload className="w-3 h-3" />
            {pi.photoUrl ? "Changer la photo" : "Ajouter une photo"}
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onPhotoUpload} data-testid="input-photo" />
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, max 5 Mo</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Prénom *">
          <Input value={pi.firstName} onChange={(e) => onChange("firstName", e.target.value)} placeholder="Marie" data-testid="input-firstname" />
        </FormField>
        <FormField label="Nom *">
          <Input value={pi.lastName} onChange={(e) => onChange("lastName", e.target.value)} placeholder="Dupont" data-testid="input-lastname" />
        </FormField>
      </div>
      <FormField label="Profession *">
        <Input value={pi.profession} onChange={(e) => onChange("profession", e.target.value)} placeholder="Développeuse Full-Stack" className="mt-3" data-testid="input-profession" />
      </FormField>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <FormField label="Téléphone *">
          <Input value={pi.phone || ""} onChange={(e) => onChange("phone", e.target.value)} placeholder="+33 6 00 00 00 00" data-testid="input-phone" />
        </FormField>
        <FormField label="Email">
          <Input value={pi.email || ""} onChange={(e) => onChange("email", e.target.value)} placeholder="email@exemple.com" data-testid="input-email" />
        </FormField>
      </div>
      <FormField label="Adresse *">
        <Input value={pi.address || ""} onChange={(e) => onChange("address", e.target.value)} placeholder="Paris, France" className="mt-3" data-testid="input-address" />
      </FormField>
      <FormField label="LinkedIn">
        <Input value={pi.linkedin || ""} onChange={(e) => onChange("linkedin", e.target.value)} placeholder="linkedin.com/in/nom" className="mt-3" data-testid="input-linkedin" />
      </FormField>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <FormField label="Portfolio">
          <Input value={pi.portfolio || ""} onChange={(e) => onChange("portfolio", e.target.value)} placeholder="portfolio.com" data-testid="input-portfolio" />
        </FormField>
        <FormField label="Site web">
          <Input value={pi.website || ""} onChange={(e) => onChange("website", e.target.value)} placeholder="monsite.com" data-testid="input-website" />
        </FormField>
      </div>
    </div>
  );
}

function SummarySection({ cv, onChange }: { cv: CvData; onChange: (val: string) => void }) {
  return (
    <div>
      <SectionHeader
        title="Résumé professionnel *"
        subtitle="Présentez-vous en 3-5 phrases percutantes (obligatoire pour télécharger)."
        sectionId="summary"
      />
      <Textarea
        value={cv.personalInfo.summary || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Développeuse full-stack passionnée avec 5 ans d'expérience dans la création d'applications web performantes..."
        className="min-h-40 resize-none"
        data-testid="textarea-summary"
      />
      <p className="text-xs text-muted-foreground mt-2">{(cv.personalInfo.summary || "").length} / 500 caractères recommandés</p>
    </div>
  );
}

function ExperienceSection({ cv, onChange }: { cv: CvData; onChange: (items: Experience[]) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const items = cv.experiences;

  const add = () => {
    const id = nanoid();
    const newItem: Experience = { id, company: "", position: "", startDate: "", current: false };
    onChange([...items, newItem]);
    setExpanded(id);
  };

  const update = (id: string, field: string, value: any) => {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));

  return (
    <div>
      <SectionHeader title="Expériences professionnelles" sectionId="experience" />
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-muted/30 transition-colors text-left"
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              <span className="truncate">{item.position || item.company || "Nouvelle expérience"}</span>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <button onClick={(e) => { e.stopPropagation(); remove(item.id); }} className="text-muted-foreground hover:text-destructive transition-colors" data-testid={`button-remove-experience-${item.id}`}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {expanded === item.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>
            {expanded === item.id && (
              <div className="p-3 border-t space-y-3 bg-muted/10">
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Entreprise *">
                    <Input value={item.company} onChange={(e) => update(item.id, "company", e.target.value)} placeholder="TechCorp" data-testid={`input-exp-company-${item.id}`} />
                  </FormField>
                  <FormField label="Poste *">
                    <Input value={item.position} onChange={(e) => update(item.id, "position", e.target.value)} placeholder="Développeur" data-testid={`input-exp-position-${item.id}`} />
                  </FormField>
                </div>
                <FormField label="Ville">
                  <Input value={item.city || ""} onChange={(e) => update(item.id, "city", e.target.value)} placeholder="Paris" data-testid={`input-exp-city-${item.id}`} />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Date début *">
                    <Input value={item.startDate} onChange={(e) => update(item.id, "startDate", e.target.value)} placeholder="Jan 2020" data-testid={`input-exp-start-${item.id}`} />
                  </FormField>
                  <FormField label="Date fin">
                    <Input value={item.endDate || ""} onChange={(e) => update(item.id, "endDate", e.target.value)} placeholder="Déc 2023" disabled={item.current} data-testid={`input-exp-end-${item.id}`} />
                  </FormField>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`current-${item.id}`}
                    checked={item.current}
                    onCheckedChange={(v) => update(item.id, "current", !!v)}
                    data-testid={`checkbox-exp-current-${item.id}`}
                  />
                  <label htmlFor={`current-${item.id}`} className="text-sm cursor-pointer">Poste actuel</label>
                </div>
                <FormField label="Description">
                  <Textarea value={item.description || ""} onChange={(e) => update(item.id, "description", e.target.value)} placeholder="Décrivez vos responsabilités et réalisations..." className="min-h-20 resize-none" data-testid={`textarea-exp-desc-${item.id}`} />
                </FormField>
              </div>
            )}
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full mt-3 gap-2" onClick={add} data-testid="button-add-experience">
        <Plus className="w-4 h-4" />
        Ajouter une expérience
      </Button>
    </div>
  );
}

function EducationSection({ cv, onChange }: { cv: CvData; onChange: (items: Education[]) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const items = cv.education;

  const add = () => {
    const id = nanoid();
    const newItem: Education = { id, school: "", degree: "", year: "" };
    onChange([...items, newItem]);
    setExpanded(id);
  };

  const update = (id: string, field: string, value: any) => {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));

  return (
    <div>
      <SectionHeader title="Formation" sectionId="education" />
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden">
            <button className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-muted/30 transition-colors text-left" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
              <span className="truncate">{item.degree || item.school || "Nouvelle formation"}</span>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <button onClick={(e) => { e.stopPropagation(); remove(item.id); }} className="text-muted-foreground hover:text-destructive transition-colors" data-testid={`button-remove-education-${item.id}`}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {expanded === item.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>
            {expanded === item.id && (
              <div className="p-3 border-t space-y-3 bg-muted/10">
                <FormField label="École / Université *">
                  <Input value={item.school} onChange={(e) => update(item.id, "school", e.target.value)} placeholder="Université Paris" data-testid={`input-edu-school-${item.id}`} />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Diplôme *">
                    <Input value={item.degree} onChange={(e) => update(item.id, "degree", e.target.value)} placeholder="Master" data-testid={`input-edu-degree-${item.id}`} />
                  </FormField>
                  <FormField label="Année *">
                    <Input value={item.year} onChange={(e) => update(item.id, "year", e.target.value)} placeholder="2022" data-testid={`input-edu-year-${item.id}`} />
                  </FormField>
                </div>
                <FormField label="Spécialité">
                  <Input value={item.field || ""} onChange={(e) => update(item.id, "field", e.target.value)} placeholder="Génie Logiciel" data-testid={`input-edu-field-${item.id}`} />
                </FormField>
                <FormField label="Description">
                  <Textarea value={item.description || ""} onChange={(e) => update(item.id, "description", e.target.value)} placeholder="Mémoire sur..." className="min-h-16 resize-none" data-testid={`textarea-edu-desc-${item.id}`} />
                </FormField>
              </div>
            )}
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full mt-3 gap-2" onClick={add} data-testid="button-add-education">
        <Plus className="w-4 h-4" />
        Ajouter une formation
      </Button>
    </div>
  );
}

function SkillsSection({ cv, onChange }: { cv: CvData; onChange: (items: Skill[]) => void }) {
  const items = cv.skills;

  const add = () => {
    onChange([...items, { id: nanoid(), name: "", level: 3, category: "technical" }]);
  };

  const update = (id: string, field: string, value: any) => {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));

  return (
    <div>
      <SectionHeader title="Compétences" subtitle="Ajoutez vos compétences avec un niveau de maîtrise." sectionId="skills" />
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-3 border rounded-lg space-y-2 bg-muted/10">
            <div className="flex items-center gap-2">
              <Input
                value={item.name}
                onChange={(e) => update(item.id, "name", e.target.value)}
                placeholder="React, Python, Management..."
                className="flex-1"
                data-testid={`input-skill-name-${item.id}`}
              />
              <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive transition-colors" data-testid={`button-remove-skill-${item.id}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-16 shrink-0">Niveau: {item.level}/5</span>
              <Slider
                min={1}
                max={5}
                step={1}
                value={[item.level]}
                onValueChange={([v]) => update(item.id, "level", v)}
                className="flex-1"
                data-testid={`slider-skill-level-${item.id}`}
              />
            </div>
            <Select value={item.category} onValueChange={(v) => update(item.id, "category", v)}>
              <SelectTrigger className="h-8 text-xs" data-testid={`select-skill-category-${item.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technique</SelectItem>
                <SelectItem value="computer">Informatique</SelectItem>
                <SelectItem value="language">Langue</SelectItem>
                <SelectItem value="soft">Savoir-être</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full mt-3 gap-2" onClick={add} data-testid="button-add-skill">
        <Plus className="w-4 h-4" />
        Ajouter une compétence
      </Button>
    </div>
  );
}

function LanguagesSection({ cv, onChange }: { cv: CvData; onChange: (items: Language[]) => void }) {
  const items = cv.languages;

  const add = () => {
    onChange([...items, { id: nanoid(), language: "", level: "intermediate" }]);
  };

  const update = (id: string, field: string, value: any) => {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));

  return (
    <div>
      <SectionHeader title="Langues" sectionId="languages" />
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <Input
              value={item.language}
              onChange={(e) => update(item.id, "language", e.target.value)}
              placeholder="Français"
              className="flex-1"
              data-testid={`input-lang-${item.id}`}
            />
            <Select value={item.level} onValueChange={(v) => update(item.id, "level", v)}>
              <SelectTrigger className="w-36 shrink-0" data-testid={`select-lang-level-${item.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LEVEL_LABELS).map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive shrink-0" data-testid={`button-remove-lang-${item.id}`}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full mt-3 gap-2" onClick={add} data-testid="button-add-language">
        <Plus className="w-4 h-4" />
        Ajouter une langue
      </Button>
    </div>
  );
}

function CertificationsSection({ cv, onChange }: { cv: CvData; onChange: (items: Certification[]) => void }) {
  const items = cv.certifications;

  const add = () => {
    onChange([...items, { id: nanoid(), title: "", organization: "", year: "" }]);
  };

  const update = (id: string, field: string, value: any) => {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));

  return (
    <div>
      <SectionHeader title="Certifications" sectionId="certifications" />
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-3 border rounded-lg space-y-2 bg-muted/10">
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <Input value={item.title} onChange={(e) => update(item.id, "title", e.target.value)} placeholder="AWS Cloud Practitioner" data-testid={`input-cert-title-${item.id}`} />
                <div className="grid grid-cols-2 gap-2">
                  <Input value={item.organization} onChange={(e) => update(item.id, "organization", e.target.value)} placeholder="Amazon" data-testid={`input-cert-org-${item.id}`} />
                  <Input value={item.year} onChange={(e) => update(item.id, "year", e.target.value)} placeholder="2023" data-testid={`input-cert-year-${item.id}`} />
                </div>
              </div>
              <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive mt-1" data-testid={`button-remove-cert-${item.id}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full mt-3 gap-2" onClick={add} data-testid="button-add-certification">
        <Plus className="w-4 h-4" />
        Ajouter une certification
      </Button>
    </div>
  );
}

function ProjectsSection({ cv, onChange }: { cv: CvData; onChange: (items: Project[]) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const items = cv.projects;

  const add = () => {
    const id = nanoid();
    onChange([...items, { id, title: "" }]);
    setExpanded(id);
  };

  const update = (id: string, field: string, value: any) => {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));

  return (
    <div>
      <SectionHeader title="Projets" sectionId="projects" />
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden">
            <button className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-muted/30 text-left" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
              <span className="truncate">{item.title || "Nouveau projet"}</span>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <button onClick={(e) => { e.stopPropagation(); remove(item.id); }} className="text-muted-foreground hover:text-destructive" data-testid={`button-remove-project-${item.id}`}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {expanded === item.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>
            {expanded === item.id && (
              <div className="p-3 border-t space-y-3 bg-muted/10">
                <FormField label="Titre *">
                  <Input value={item.title} onChange={(e) => update(item.id, "title", e.target.value)} placeholder="Portfolio personnel" data-testid={`input-proj-title-${item.id}`} />
                </FormField>
                <FormField label="Technologies">
                  <Input value={item.technologies || ""} onChange={(e) => update(item.id, "technologies", e.target.value)} placeholder="React, TypeScript, Node.js" data-testid={`input-proj-tech-${item.id}`} />
                </FormField>
                <FormField label="Lien">
                  <Input value={item.link || ""} onChange={(e) => update(item.id, "link", e.target.value)} placeholder="github.com/..." data-testid={`input-proj-link-${item.id}`} />
                </FormField>
                <FormField label="Description">
                  <Textarea value={item.description || ""} onChange={(e) => update(item.id, "description", e.target.value)} placeholder="Décrivez le projet..." className="min-h-16 resize-none" data-testid={`textarea-proj-desc-${item.id}`} />
                </FormField>
              </div>
            )}
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full mt-3 gap-2" onClick={add} data-testid="button-add-project">
        <Plus className="w-4 h-4" />
        Ajouter un projet
      </Button>
    </div>
  );
}

function InterestsSection({ cv, onChange }: { cv: CvData; onChange: (items: Interest[]) => void }) {
  const items = cv.interests;
  const [newInterest, setNewInterest] = useState("");

  const add = () => {
    if (!newInterest.trim()) return;
    onChange([...items, { id: nanoid(), name: newInterest.trim() }]);
    setNewInterest("");
  };

  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));

  return (
    <div>
      <SectionHeader title="Centres d'intérêt" sectionId="interests" />
      <div className="flex flex-wrap gap-2 mb-3 min-h-12 p-2 rounded-lg border bg-muted/10">
        {items.length === 0 && <p className="text-xs text-muted-foreground self-center">Aucun intérêt ajouté</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-sm" data-testid={`badge-interest-${item.id}`}>
            <span>{item.name}</span>
            <button onClick={() => remove(item.id)} className="hover:text-destructive ml-0.5" data-testid={`button-remove-interest-${item.id}`}>
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          placeholder="Photographie, Voyages, Sport..."
          onKeyDown={(e) => e.key === "Enter" && add()}
          data-testid="input-new-interest"
        />
        <Button variant="outline" onClick={add} className="shrink-0" data-testid="button-add-interest">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-1.5">Appuyez sur Entrée ou cliquez + pour ajouter</p>
    </div>
  );
}

function CustomizeSection({ cv, onChange }: { cv: CvData; onChange: (c: typeof cv.customization) => void }) {
  const c = cv.customization;

  return (
    <div>
      <SectionHeader title="Personnalisation" subtitle="Ajustez l'apparence de votre CV." sectionId="customize" />

      {/* Template */}
      <div className="mb-5">
        <Label className="text-xs text-muted-foreground mb-2 block">Template</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CV_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange({ ...c, templateId: t.id, primaryColor: t.color })}
              className={`p-2.5 rounded-lg border-2 text-left text-sm font-medium transition-all ${c.templateId === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
              data-testid={`button-template-${t.id}`}
            >
              <div className="w-full h-1.5 rounded-full mb-1.5" style={{ backgroundColor: t.color }} />
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="mb-5">
        <Label className="text-xs text-muted-foreground mb-2 block">Couleur principale</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onChange({ ...c, primaryColor: color })}
              className={`w-8 h-8 rounded-full transition-all ${c.primaryColor === color ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-105"}`}
              style={{ backgroundColor: color }}
              data-testid={`button-color-${color.replace("#", "")}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Personnalisée:</span>
          <input
            type="color"
            value={c.primaryColor}
            onChange={(e) => onChange({ ...c, primaryColor: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer border border-border"
            data-testid="input-color-picker"
          />
          <span className="text-xs font-mono text-muted-foreground">{c.primaryColor}</span>
        </div>
      </div>

      {/* Font */}
      <div className="mb-5">
        <Label className="text-xs text-muted-foreground mb-2 block">Police</Label>
        <Select value={c.fontFamily} onValueChange={(v) => onChange({ ...c, fontFamily: v })}>
          <SelectTrigger data-testid="select-font">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((f) => (
              <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font size */}
      <div className="mb-5">
        <Label className="text-xs text-muted-foreground mb-2 block">Taille du texte</Label>
        <div className="flex gap-2">
          {(["small", "medium", "large"] as const).map((size) => (
            <button
              key={size}
              onClick={() => onChange({ ...c, fontSize: size })}
              className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${c.fontSize === size ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"}`}
              data-testid={`button-fontsize-${size}`}
            >
              {size === "small" ? "Petit" : size === "medium" ? "Moyen" : "Grand"}
            </button>
          ))}
        </div>
      </div>

      {/* Photo style */}
      <div className="mb-5">
        <Label className="text-xs text-muted-foreground mb-2 block">Style de la photo</Label>
        <div className="flex gap-2">
          {(["circle", "square", "none"] as const).map((style) => (
            <button
              key={style}
              onClick={() => onChange({ ...c, photoStyle: style })}
              className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${c.photoStyle === style ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"}`}
              data-testid={`button-photostyle-${style}`}
            >
              {style === "circle" ? "Cercle" : style === "square" ? "Carré" : "Sans photo"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
        <p className="text-xs font-medium text-foreground">Aperçu protégé CVPro</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
          L&apos;aperçu à droite est flouté avec filigrane CVPro pour éviter toute copie directe. Sur cet onglet, un filtre contrasté s&apos;ajoute pour juger couleurs et typographie. Le PDF net est disponible après paiement.
        </p>
      </div>
    </div>
  );
}
