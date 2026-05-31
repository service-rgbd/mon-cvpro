import type { CSSProperties, ReactNode } from "react";
import { User } from "lucide-react";
import { CvData } from "@/types/cv";

export const LEVEL_LABELS: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
  fluent: "Courant",
  native: "Langue maternelle",
};

export function SectionTitle({
  title,
  color,
  light = false,
  large = false,
}: {
  title: string;
  color: string;
  light?: boolean;
  large?: boolean;
}) {
  return (
    <div className="mb-2">
      <h3
        className={`font-bold uppercase tracking-[0.16em] ${large ? "text-[12px]" : "text-[10px]"} ${light ? "text-white/90" : ""}`}
        style={light ? undefined : { color }}
      >
        {title}
      </h3>
      <div
        className={`mt-1.5 h-[2px] rounded-full ${light ? "bg-white/35" : ""}`}
        style={light ? undefined : { backgroundColor: color, width: large ? "48px" : "36px" }}
      />
    </div>
  );
}

export function SkillBar({ level, light = false }: { level: number; light?: boolean }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-1.5 w-5 rounded-full"
          style={{
            backgroundColor: i <= level
              ? light ? "rgba(255,255,255,0.95)" : "currentColor"
              : light ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.12)",
          }}
        />
      ))}
    </div>
  );
}

export function Photo({
  cv,
  className,
  borderStyle,
  placeholder = false,
}: {
  cv: CvData;
  className: string;
  borderStyle?: CSSProperties;
  /** Affiche un cadre même sans photo (sauf si photoStyle === "none") */
  placeholder?: boolean;
}) {
  const pi = cv.personalInfo;
  const rounded = cv.customization.photoStyle === "circle" ? "rounded-full" : "rounded-md";

  if (cv.customization.photoStyle === "none") return null;

  if (pi.photoUrl) {
    return (
      <img
        src={pi.photoUrl}
        alt="Photo"
        className={`object-cover ${rounded} ${className}`}
        style={borderStyle}
      />
    );
  }

  if (!placeholder) return null;

  return (
    <div
      className={`flex items-center justify-center bg-slate-100/90 ${rounded} ${className}`}
      style={{
        border: borderStyle?.border ?? "2px dashed rgba(148, 163, 184, 0.65)",
        ...borderStyle,
      }}
      aria-hidden="true"
    >
      <User className="w-[38%] h-[38%] text-slate-300" strokeWidth={1.25} />
    </div>
  );
}

export function ContactFields({
  cv,
  className = "text-[10px]",
  labels = false,
}: {
  cv: CvData;
  className?: string;
  labels?: boolean;
}) {
  const pi = cv.personalInfo;
  const fields = [
    { label: "Tel", value: pi.phone },
    { label: "Email", value: pi.email },
    { label: "Address", value: pi.address },
    { label: "LinkedIn", value: pi.linkedin },
    { label: "Web", value: pi.website },
  ];

  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-1 ${className}`}>
      {fields.map((f) => (
        <div key={f.label} className="min-w-0">
          {labels && <span className="text-slate-400 mr-1">{f.label}:</span>}
          <span className={f.value?.trim() ? "text-slate-600 break-all" : "text-slate-400 italic"}>
            {fieldValue(f.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SectionBlock({
  title,
  color,
  children,
  className = "mb-4",
  minHeight,
}: {
  title: string;
  color: string;
  children: ReactNode;
  className?: string;
  minHeight?: string;
}) {
  return (
    <section className={className} style={minHeight ? { minHeight } : undefined}>
      <SectionTitle title={title} color={color} />
      {children}
    </section>
  );
}

export function fieldValue(value?: string | null): string {
  return value?.trim() || "vide";
}

export function formatPeriod(
  startDate?: string | null,
  endDate?: string | null,
  current?: boolean,
  presentLabel = "Présent",
): string {
  if (!startDate?.trim() && !endDate?.trim() && !current) return "vide";
  return `${fieldValue(startDate)} — ${current ? presentLabel : fieldValue(endDate)}`;
}

export function EmptyContent({ className = "text-[10px]" }: { className?: string }) {
  return <p className={`${className} text-slate-400 italic`}>vide</p>;
}

export function CompactLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[8.5px] uppercase tracking-[0.18em] text-slate-400 mb-1">{children}</h3>
  );
}

export function NumberedHeader({ num, title, color }: { num: string; title: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span
        className="text-[8px] font-bold px-1.5 py-0.5 text-white rounded shrink-0"
        style={{ backgroundColor: color }}
      >
        {num}
      </span>
      <h3 className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color }}>
        {title}
      </h3>
    </div>
  );
}

export function ExperienceList({
  cv,
  color,
  presentLabel = "Présent",
}: {
  cv: CvData;
  color: string;
  presentLabel?: string;
}) {
  if (!cv.experiences.length) return <EmptyContent />;

  return (
    <div className="space-y-2">
      {cv.experiences.map((e) => (
        <div key={e.id}>
          <div className="flex justify-between items-baseline gap-2">
            <p className={`text-[10.5px] font-semibold leading-snug ${e.position?.trim() ? "text-slate-900" : "text-slate-400 italic"}`}>
              {fieldValue(e.position)}
            </p>
            <span className="text-[9px] text-slate-400 shrink-0">
              {formatPeriod(e.startDate, e.endDate, e.current, presentLabel)}
            </span>
          </div>
          <p className={`text-[9.5px] mt-0.5 ${e.company?.trim() ? "font-medium" : "italic text-slate-400"}`} style={e.company?.trim() ? { color } : undefined}>
            {fieldValue(e.company)}{e.city?.trim() ? ` · ${e.city}` : ""}
          </p>
          <p className={`text-[9.5px] mt-0.5 leading-[1.5] ${e.description?.trim() ? "text-slate-600" : "text-slate-400 italic"}`}>
            {fieldValue(e.description)}
          </p>
        </div>
      ))}
    </div>
  );
}

export function EducationList({ cv, color }: { cv: CvData; color: string }) {
  if (!cv.education.length) return <EmptyContent />;

  return (
    <div className="space-y-1.5">
      {cv.education.map((ed) => (
        <div key={ed.id} className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <p className={`text-[10px] font-semibold ${ed.degree?.trim() ? "text-slate-900" : "text-slate-400 italic"}`}>
              {fieldValue(ed.degree)}{ed.field?.trim() ? ` — ${ed.field}` : ""}
            </p>
            <p className={`text-[9.5px] mt-0.5 ${ed.school?.trim() ? "text-slate-500" : "text-slate-400 italic"}`}>
              {fieldValue(ed.school)}
            </p>
          </div>
          <span className="text-[9px] text-slate-400 shrink-0">{fieldValue(ed.year)}</span>
        </div>
      ))}
    </div>
  );
}

export function SkillsInline({ cv }: { cv: CvData }) {
  if (!cv.skills.length) return <EmptyContent />;
  return (
    <p className="text-[10px] text-slate-600 leading-[1.55]">
      {cv.skills.map((s) => s.name).join(" · ")}
    </p>
  );
}

export function SkillsBullets({ cv }: { cv: CvData }) {
  if (!cv.skills.length) return <EmptyContent />;
  return (
    <ul className="list-disc pl-3.5 space-y-0.5">
      {cv.skills.map((s) => (
        <li key={s.id} className="text-[9.5px] text-slate-700">{s.name}</li>
      ))}
    </ul>
  );
}

export function LanguagesList({ cv }: { cv: CvData }) {
  if (!cv.languages.length) return <EmptyContent />;
  return (
    <div className="space-y-0.5">
      {cv.languages.map((l) => (
        <p key={l.id} className="text-[9.5px] text-slate-700">
          {fieldValue(l.language)} — {LEVEL_LABELS[l.level]}
        </p>
      ))}
    </div>
  );
}

export function CertificationsList({ cv }: { cv: CvData }) {
  if (!cv.certifications.length) return <EmptyContent />;
  return (
    <div className="space-y-0.5">
      {cv.certifications.map((c) => (
        <p key={c.id} className="text-[9.5px] text-slate-700">
          {fieldValue(c.title)} — {fieldValue(c.organization)} ({fieldValue(c.year)})
        </p>
      ))}
    </div>
  );
}

export function InterestsInline({ cv }: { cv: CvData }) {
  if (!cv.interests.length) return <EmptyContent />;
  return (
    <p className="text-[9.5px] text-slate-700">{cv.interests.map((i) => i.name).join(" · ")}</p>
  );
}

export function ContactGrid({
  cv,
  className = "text-[9.5px]",
}: {
  cv: CvData;
  className?: string;
}) {
  const pi = cv.personalInfo;
  const rows = [
    { label: "Téléphone", value: pi.phone },
    { label: "Email", value: pi.email },
    { label: "Adresse", value: pi.address },
    { label: "LinkedIn", value: pi.linkedin },
    { label: "Site web", value: pi.website },
  ];

  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-0.5 ${className}`}>
      {rows.map(({ label, value }) => (
        <div key={label} className="flex gap-1.5 min-w-0 leading-snug">
          <span className="text-slate-400 shrink-0">{label}</span>
          <span className={`min-w-0 truncate ${value?.trim() ? "text-slate-700" : "text-slate-400 italic"}`}>
            {fieldValue(value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ContactLine({ cv, className = "text-[10px]" }: { cv: CvData; className?: string }) {
  const pi = cv.personalInfo;
  const items = [pi.phone, pi.email, pi.address, pi.linkedin, pi.website].filter(Boolean);
  if (!items.length) return null;
  return <p className={`${className} text-slate-500`}>{items.join("  ·  ")}</p>;
}
