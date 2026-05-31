import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ASSISTANT_PERSONAL_FIELDS,
  ASSISTANT_SECTIONS_WITH_FILL,
} from "@/data/assistant-fill-fields";
import { SUMMARY_MIN_LENGTH } from "@/lib/cv-validation";
import type { CvData } from "@/types/cv";

function nanoid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

interface AssistantFillFormProps {
  sectionId: string;
  cv: CvData;
  onPersonalInfoChange: (field: string, value: string) => void;
  onCvUpdate: (updater: (prev: CvData) => CvData) => void;
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Label className="text-[11px] text-muted-foreground mb-1 block">
      {children}
      {required && <span className="text-primary ml-0.5">*</span>}
    </Label>
  );
}

export default function AssistantFillForm({
  sectionId,
  cv,
  onPersonalInfoChange,
  onCvUpdate,
}: AssistantFillFormProps) {
  if (!ASSISTANT_SECTIONS_WITH_FILL.has(sectionId)) return null;

  const pi = cv.personalInfo;

  if (sectionId === "personal") {
    return (
      <div className="ml-9 space-y-2.5 animate-in fade-in duration-300">
        <p className="text-[11px] font-medium text-primary">
          Saisissez ici — les champs se remplissent automatiquement à gauche :
        </p>
        {ASSISTANT_PERSONAL_FIELDS.map((field) => (
          <div key={field.key}>
            <FieldLabel required={field.required}>{field.label}</FieldLabel>
            <Input
              value={(pi[field.key] as string | undefined) || ""}
              onChange={(e) => onPersonalInfoChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="h-8 text-sm"
              data-testid={`assistant-input-${field.key}`}
            />
          </div>
        ))}
      </div>
    );
  }

  if (sectionId === "summary") {
    const len = (pi.summary || "").trim().length;
    return (
      <div className="ml-9 space-y-2 animate-in fade-in duration-300">
        <p className="text-[11px] font-medium text-primary">
          Rédigez votre résumé — il apparaît directement dans le formulaire :
        </p>
        <FieldLabel required>Résumé professionnel</FieldLabel>
        <Textarea
          value={pi.summary || ""}
          onChange={(e) => onPersonalInfoChange("summary", e.target.value)}
          placeholder="Comptable avec 4 ans d'expérience en PME. Maîtrise de Sage et Excel..."
          className="min-h-[88px] text-sm resize-none"
          data-testid="assistant-input-summary"
        />
        <p className="text-[10px] text-muted-foreground">
          {len} / {SUMMARY_MIN_LENGTH} caractères minimum
        </p>
      </div>
    );
  }

  return (
    <AssistantListFillForm
      sectionId={sectionId}
      onCvUpdate={onCvUpdate}
    />
  );
}

function AssistantListFillForm({
  sectionId,
  onCvUpdate,
}: {
  sectionId: string;
  onCvUpdate: (updater: (prev: CvData) => CvData) => void;
}) {
  const [expDraft, setExpDraft] = useState({
    position: "",
    company: "",
    startDate: "",
    description: "",
  });
  const [eduDraft, setEduDraft] = useState({ degree: "", school: "", year: "" });
  const [skillDraft, setSkillDraft] = useState("");
  const [langDraft, setLangDraft] = useState({ language: "", level: "intermediate" as const });
  const [certDraft, setCertDraft] = useState({ title: "", organization: "", year: "" });
  const [projectDraft, setProjectDraft] = useState({ title: "", description: "" });
  const [interestDraft, setInterestDraft] = useState("");

  const intro = (
    <p className="text-[11px] font-medium text-primary mb-2">
      Ajoutez depuis ici — l&apos;entrée apparaît dans le formulaire à gauche :
    </p>
  );

  if (sectionId === "experience") {
    return (
      <div className="ml-9 space-y-2 animate-in fade-in duration-300">
        {intro}
        <FieldLabel required>Poste</FieldLabel>
        <Input
          value={expDraft.position}
          onChange={(e) => setExpDraft((d) => ({ ...d, position: e.target.value }))}
          placeholder="Assistant commercial"
          className="h-8 text-sm"
        />
        <FieldLabel required>Entreprise</FieldLabel>
        <Input
          value={expDraft.company}
          onChange={(e) => setExpDraft((d) => ({ ...d, company: e.target.value }))}
          placeholder="Boutique Teranga"
          className="h-8 text-sm"
        />
        <FieldLabel required>Date début</FieldLabel>
        <Input
          value={expDraft.startDate}
          onChange={(e) => setExpDraft((d) => ({ ...d, startDate: e.target.value }))}
          placeholder="Jan 2023"
          className="h-8 text-sm"
        />
        <FieldLabel>Description</FieldLabel>
        <Textarea
          value={expDraft.description}
          onChange={(e) => setExpDraft((d) => ({ ...d, description: e.target.value }))}
          placeholder="Accueil clients, suivi des stocks..."
          className="min-h-[64px] text-sm resize-none"
        />
        <Button
          type="button"
          size="sm"
          className="w-full gap-1.5 h-8"
          disabled={!expDraft.position.trim() || !expDraft.company.trim()}
          onClick={() => {
            const id = nanoid();
            onCvUpdate((prev) => ({
              ...prev,
              experiences: [
                ...prev.experiences,
                {
                  id,
                  position: expDraft.position.trim(),
                  company: expDraft.company.trim(),
                  startDate: expDraft.startDate.trim(),
                  current: false,
                  description: expDraft.description.trim() || null,
                },
              ],
            }));
            setExpDraft({ position: "", company: "", startDate: "", description: "" });
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter cette expérience
        </Button>
      </div>
    );
  }

  if (sectionId === "education") {
    return (
      <div className="ml-9 space-y-2 animate-in fade-in duration-300">
        {intro}
        <FieldLabel required>Diplôme</FieldLabel>
        <Input
          value={eduDraft.degree}
          onChange={(e) => setEduDraft((d) => ({ ...d, degree: e.target.value }))}
          placeholder="Licence Gestion"
          className="h-8 text-sm"
        />
        <FieldLabel required>Établissement</FieldLabel>
        <Input
          value={eduDraft.school}
          onChange={(e) => setEduDraft((d) => ({ ...d, school: e.target.value }))}
          placeholder="Université Cheikh Anta Diop"
          className="h-8 text-sm"
        />
        <FieldLabel required>Année</FieldLabel>
        <Input
          value={eduDraft.year}
          onChange={(e) => setEduDraft((d) => ({ ...d, year: e.target.value }))}
          placeholder="2022"
          className="h-8 text-sm"
        />
        <Button
          type="button"
          size="sm"
          className="w-full gap-1.5 h-8"
          disabled={!eduDraft.degree.trim() || !eduDraft.school.trim()}
          onClick={() => {
            const id = nanoid();
            onCvUpdate((prev) => ({
              ...prev,
              education: [
                ...prev.education,
                {
                  id,
                  degree: eduDraft.degree.trim(),
                  school: eduDraft.school.trim(),
                  year: eduDraft.year.trim(),
                },
              ],
            }));
            setEduDraft({ degree: "", school: "", year: "" });
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter cette formation
        </Button>
      </div>
    );
  }

  if (sectionId === "skills") {
    return (
      <div className="ml-9 space-y-2 animate-in fade-in duration-300">
        {intro}
        <FieldLabel required>Compétence</FieldLabel>
        <Input
          value={skillDraft}
          onChange={(e) => setSkillDraft(e.target.value)}
          placeholder="Excel, Comptabilité, Relation client..."
          className="h-8 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && skillDraft.trim()) {
              e.preventDefault();
              const id = nanoid();
              onCvUpdate((prev) => ({
                ...prev,
                skills: [
                  ...prev.skills,
                  { id, name: skillDraft.trim(), level: 3, category: "technical" },
                ],
              }));
              setSkillDraft("");
            }
          }}
        />
        <Button
          type="button"
          size="sm"
          className="w-full gap-1.5 h-8"
          disabled={!skillDraft.trim()}
          onClick={() => {
            const id = nanoid();
            onCvUpdate((prev) => ({
              ...prev,
              skills: [
                ...prev.skills,
                { id, name: skillDraft.trim(), level: 3, category: "technical" },
              ],
            }));
            setSkillDraft("");
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter la compétence
        </Button>
      </div>
    );
  }

  if (sectionId === "languages") {
    return (
      <div className="ml-9 space-y-2 animate-in fade-in duration-300">
        {intro}
        <FieldLabel required>Langue</FieldLabel>
        <Input
          value={langDraft.language}
          onChange={(e) => setLangDraft((d) => ({ ...d, language: e.target.value }))}
          placeholder="Anglais"
          className="h-8 text-sm"
        />
        <FieldLabel>Niveau</FieldLabel>
        <Select
          value={langDraft.level}
          onValueChange={(v) =>
            setLangDraft((d) => ({
              ...d,
              level: v as typeof d.level,
            }))
          }
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Débutant</SelectItem>
            <SelectItem value="intermediate">Intermédiaire</SelectItem>
            <SelectItem value="advanced">Avancé</SelectItem>
            <SelectItem value="fluent">Courant</SelectItem>
            <SelectItem value="native">Langue maternelle</SelectItem>
          </SelectContent>
        </Select>
        <Button
          type="button"
          size="sm"
          className="w-full gap-1.5 h-8"
          disabled={!langDraft.language.trim()}
          onClick={() => {
            const id = nanoid();
            onCvUpdate((prev) => ({
              ...prev,
              languages: [
                ...prev.languages,
                { id, language: langDraft.language.trim(), level: langDraft.level },
              ],
            }));
            setLangDraft({ language: "", level: "intermediate" });
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter la langue
        </Button>
      </div>
    );
  }

  if (sectionId === "certifications") {
    return (
      <div className="ml-9 space-y-2 animate-in fade-in duration-300">
        {intro}
        <FieldLabel required>Certification</FieldLabel>
        <Input
          value={certDraft.title}
          onChange={(e) => setCertDraft((d) => ({ ...d, title: e.target.value }))}
          placeholder="Certificat Google Analytics"
          className="h-8 text-sm"
        />
        <FieldLabel required>Organisme</FieldLabel>
        <Input
          value={certDraft.organization}
          onChange={(e) => setCertDraft((d) => ({ ...d, organization: e.target.value }))}
          placeholder="Google"
          className="h-8 text-sm"
        />
        <FieldLabel>Année</FieldLabel>
        <Input
          value={certDraft.year}
          onChange={(e) => setCertDraft((d) => ({ ...d, year: e.target.value }))}
          placeholder="2024"
          className="h-8 text-sm"
        />
        <Button
          type="button"
          size="sm"
          className="w-full gap-1.5 h-8"
          disabled={!certDraft.title.trim() || !certDraft.organization.trim()}
          onClick={() => {
            const id = nanoid();
            onCvUpdate((prev) => ({
              ...prev,
              certifications: [
                ...prev.certifications,
                {
                  id,
                  title: certDraft.title.trim(),
                  organization: certDraft.organization.trim(),
                  year: certDraft.year.trim(),
                },
              ],
            }));
            setCertDraft({ title: "", organization: "", year: "" });
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter la certification
        </Button>
      </div>
    );
  }

  if (sectionId === "projects") {
    return (
      <div className="ml-9 space-y-2 animate-in fade-in duration-300">
        {intro}
        <FieldLabel required>Titre du projet</FieldLabel>
        <Input
          value={projectDraft.title}
          onChange={(e) => setProjectDraft((d) => ({ ...d, title: e.target.value }))}
          placeholder="Site vitrine association"
          className="h-8 text-sm"
        />
        <FieldLabel>Description</FieldLabel>
        <Textarea
          value={projectDraft.description}
          onChange={(e) => setProjectDraft((d) => ({ ...d, description: e.target.value }))}
          placeholder="Création WordPress, +200 visites..."
          className="min-h-[64px] text-sm resize-none"
        />
        <Button
          type="button"
          size="sm"
          className="w-full gap-1.5 h-8"
          disabled={!projectDraft.title.trim()}
          onClick={() => {
            const id = nanoid();
            onCvUpdate((prev) => ({
              ...prev,
              projects: [
                ...prev.projects,
                {
                  id,
                  title: projectDraft.title.trim(),
                  description: projectDraft.description.trim() || null,
                },
              ],
            }));
            setProjectDraft({ title: "", description: "" });
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter le projet
        </Button>
      </div>
    );
  }

  if (sectionId === "interests") {
    return (
      <div className="ml-9 space-y-2 animate-in fade-in duration-300">
        {intro}
        <FieldLabel required>Centre d&apos;intérêt</FieldLabel>
        <Input
          value={interestDraft}
          onChange={(e) => setInterestDraft(e.target.value)}
          placeholder="Football, Lecture, Bénévolat..."
          className="h-8 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && interestDraft.trim()) {
              e.preventDefault();
              const id = nanoid();
              onCvUpdate((prev) => ({
                ...prev,
                interests: [...prev.interests, { id, name: interestDraft.trim() }],
              }));
              setInterestDraft("");
            }
          }}
        />
        <Button
          type="button"
          size="sm"
          className="w-full gap-1.5 h-8"
          disabled={!interestDraft.trim()}
          onClick={() => {
            const id = nanoid();
            onCvUpdate((prev) => ({
              ...prev,
              interests: [...prev.interests, { id, name: interestDraft.trim() }],
            }));
            setInterestDraft("");
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter l&apos;intérêt
        </Button>
      </div>
    );
  }

  return null;
}
