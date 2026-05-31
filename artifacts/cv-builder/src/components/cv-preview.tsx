import type { ComponentType } from "react";
import { CvData } from "@/types/cv";
import { LEVEL_LABELS, Photo, SectionTitle, SkillBar, SectionBlock, fieldValue, ExperienceList, EducationList, LanguagesList } from "./cv-template-shared";
import {
  ConsultantTemplate,
  CorporateTemplate,
  ExecutiveTemplate,
  InternationalTemplate,
  MinimalTemplate,
} from "./cv-templates-pro";

interface CvPreviewProps {
  cv: CvData;
  scale?: number;
  printMode?: boolean;
  /** Filtre visuel agressif — builder Style uniquement, jamais export */
  stylePreviewFilter?: boolean;
}

function CvFooter({ cv, templateId }: { cv: CvData; templateId: string }) {
  const color = cv.customization.primaryColor;
  const pi = cv.personalInfo;
  const name = [pi.firstName, pi.lastName].filter(Boolean).join(" ") || "Curriculum Vitae";
  const profession = pi.profession?.trim();
  const contacts = [
    pi.email && { label: "Email", value: pi.email },
    pi.phone && { label: "Tel", value: pi.phone },
    pi.linkedin && { label: "LinkedIn", value: pi.linkedin },
    pi.website && { label: "Web", value: pi.website },
  ].filter(Boolean) as { label: string; value: string }[];

  if (templateId === "corporate") {
    return (
      <div className="mt-auto shrink-0 px-8 py-3 text-white text-[8.5px] flex justify-between gap-4" style={{ backgroundColor: color }}>
        <span className="font-bold uppercase tracking-[0.14em] truncate">{name}</span>
        <span className="opacity-80 truncate">{contacts.map((c) => c.value).join("  ·  ")}</span>
      </div>
    );
  }

  if (templateId === "consultant") {
    return (
      <div className="mt-auto shrink-0 px-7 py-2.5 border-t flex justify-between gap-4 text-[8px] text-slate-500" style={{ borderColor: color }}>
        <span className="font-semibold uppercase tracking-[0.1em]" style={{ color }}>{name}</span>
        <span className="truncate">{fieldValue(pi.email)} · {fieldValue(pi.phone)}</span>
      </div>
    );
  }

  if (templateId === "minimal") {
    return (
      <div className="mt-auto shrink-0 px-7 py-2.5 flex justify-between items-center text-[8px] text-slate-400 uppercase tracking-[0.16em]">
        <span>{name || fieldValue("")}</span>
        <span className={profession ? "" : "italic normal-case tracking-normal"}>{fieldValue(profession)}</span>
      </div>
    );
  }

  if (templateId === "international") {
    return (
      <div className="mt-auto shrink-0 px-7 py-2.5 border-t text-center text-[8px] text-slate-500" style={{ borderColor: `${color}25` }}>
        {name || fieldValue("")} · {fieldValue(profession)} · {fieldValue(pi.email)}
      </div>
    );
  }

  if (templateId === "classic") {
    return (
      <div className="mt-auto shrink-0 border-t-2 px-7 py-3" style={{ borderColor: color }}>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] truncate" style={{ color }}>
              {name || fieldValue("")}
            </p>
            <p className={`text-[8.5px] mt-0.5 truncate ${profession ? "text-slate-500 uppercase tracking-[0.14em]" : "text-slate-400 italic normal-case tracking-normal"}`}>
              {fieldValue(profession)}
            </p>
          </div>
          <div className="text-right text-[8px] text-slate-400 leading-snug shrink-0">
            {[pi.email, pi.phone, pi.linkedin].map((v, i) => (
              <div key={i} className={v?.trim() ? "" : "italic"}>{fieldValue(v)}</div>
            ))}
          </div>
        </div>
        <div className="mt-2 h-px w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      </div>
    );
  }

  if (templateId === "creative") {
    return (
      <div className="mt-auto shrink-0 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
            backgroundSize: "10px 10px",
          }}
        />
        <div
          className="px-8 py-4 flex items-center justify-between gap-4 relative"
          style={{ background: `linear-gradient(120deg, ${color}18 0%, ${color}08 100%)` }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: color }}>
              CV
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold truncate" style={{ color }}>{name}</p>
              {profession && <p className="text-[8.5px] text-slate-500 truncate">{profession}</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-end shrink-0">
            {contacts.slice(0, 2).map((c) => (
              <span
                key={c.label}
                className="text-[8px] px-2 py-1 rounded-full font-medium text-white"
                style={{ backgroundColor: color }}
              >
                {c.value}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "executive") {
    return (
      <div className="mt-auto shrink-0 px-7 py-3 border-t flex justify-between items-center gap-4 text-[8.5px]" style={{ borderColor: `${color}25` }}>
        <div>
          <p className="font-bold text-[10px] tracking-tight" style={{ color }}>{name}</p>
          <p className={`mt-0.5 ${profession ? "text-slate-500 uppercase tracking-[0.14em]" : "text-slate-400 italic normal-case tracking-normal"}`}>
            {fieldValue(profession)}
          </p>
        </div>
        <div className="text-right text-slate-400 leading-relaxed shrink-0">
          {[pi.email, pi.phone, pi.linkedin].map((v, i) => (
            <div key={i} className={v?.trim() ? "" : "italic"}>{fieldValue(v)}</div>
          ))}
        </div>
      </div>
    );
  }

  // Modern (default)
  return (
    <div className="mt-auto shrink-0 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(-45deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 8px)`,
        }}
      />
      <div
        className="px-7 py-4 flex items-center justify-between gap-4 relative text-white"
        style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 55%, ${color}aa 100%)` }}
      >
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-95 truncate">{name}</p>
          {profession && (
            <p className="text-[9px] opacity-75 mt-1 tracking-wide truncate">{profession}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0 text-[8px] opacity-90 max-w-[52%] text-right">
          {contacts.length > 0 ? (
            contacts.slice(0, 3).map((c) => (
              <span key={c.label} className="truncate">{c.value}</span>
            ))
          ) : (
            <span className="italic opacity-70">Profil professionnel</span>
          )}
        </div>
      </div>
      <div
        className="h-[3px]"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}88, ${color})` }}
      />
    </div>
  );
}

function ModernTemplate({ cv }: { cv: CvData }) {
  const color = cv.customization.primaryColor;
  const { personalInfo: pi } = cv;

  return (
    <div className="flex flex-1 min-h-full" style={{ fontFamily: cv.customization.fontFamily }}>
      <div
        className="w-[36%] shrink-0 self-stretch text-white flex flex-col py-7 px-5 gap-5"
        style={{ background: `linear-gradient(180deg, ${color} 0%, ${color}dd 100%)` }}
      >
        <Photo cv={cv} className="w-24 h-24 mx-auto" borderStyle={{ border: "4px solid rgba(255,255,255,0.25)" }} />
        <div className="text-center pb-4 border-b border-white/20">
          <h1 className="text-[22px] font-bold leading-tight tracking-tight">
            {pi.firstName} {pi.lastName}
          </h1>
          {pi.profession && (
            <p className="text-[11px] opacity-85 mt-1.5 font-medium tracking-wide uppercase">{pi.profession}</p>
          )}
        </div>

        <div>
          <SectionTitle title="Contact" color={color} light />
          <div className="space-y-1.5 text-[10px] leading-relaxed opacity-95">
            {pi.phone && <div>{pi.phone}</div>}
            {pi.email && <div className="break-all">{pi.email}</div>}
            {pi.address && <div>{pi.address}</div>}
            {pi.linkedin && <div>{pi.linkedin}</div>}
            {pi.website && <div>{pi.website}</div>}
          </div>
        </div>

        {cv.skills.length > 0 && (
          <div>
            <SectionTitle title="Compétences" color={color} light />
            <div className="space-y-2.5">
              {cv.skills.map((s) => (
                <div key={s.id}>
                  <div className="text-[10px] font-medium mb-1 opacity-95">{s.name}</div>
                  <SkillBar level={s.level} light />
                </div>
              ))}
            </div>
          </div>
        )}

        {cv.languages.length > 0 && (
          <div>
            <SectionTitle title="Langues" color={color} light />
            <div className="space-y-1.5">
              {cv.languages.map((l) => (
                <div key={l.id} className="flex justify-between text-[10px] gap-2">
                  <span className="font-medium">{l.language}</span>
                  <span className="opacity-75 text-right">{LEVEL_LABELS[l.level]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {cv.interests.length > 0 && (
          <div>
            <SectionTitle title="Centres d'intérêt" color={color} light />
            <div className="flex flex-wrap gap-1.5">
              {cv.interests.map((i) => (
                <span key={i.id} className="text-[9px] px-2 py-0.5 rounded-full bg-white/18 font-medium">
                  {i.name}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex-1 min-h-4" aria-hidden="true" />
      </div>

      <div className="flex-1 px-7 py-7 bg-white">
        {pi.summary && (
          <div className="mb-6">
            <SectionTitle title="Profil" color={color} />
            <p className="text-[10.5px] leading-[1.65] text-slate-600">{pi.summary}</p>
          </div>
        )}

        {cv.experiences.length > 0 && (
          <div className="mb-6">
            <SectionTitle title="Expérience professionnelle" color={color} />
            <div className="space-y-4">
              {cv.experiences.map((e) => (
                <div key={e.id} className="relative pl-4 border-l-2" style={{ borderColor: `${color}35` }}>
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="text-[11.5px] font-bold text-slate-900">{e.position}</p>
                      <p className="text-[10px] font-medium mt-0.5" style={{ color }}>
                        {e.company}{e.city ? ` · ${e.city}` : ""}
                      </p>
                    </div>
                    <span className="text-[9.5px] text-slate-400 whitespace-nowrap font-medium">
                      {e.startDate} — {e.current ? "Présent" : e.endDate}
                    </span>
                  </div>
                  {e.description && (
                    <p className="text-[10px] text-slate-600 mt-1.5 leading-[1.6]">{e.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {cv.education.length > 0 && (
          <div className="mb-6">
            <SectionTitle title="Formation" color={color} />
            <div className="space-y-3">
              {cv.education.map((ed) => (
                <div key={ed.id} className="flex justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold">{ed.degree}{ed.field ? ` — ${ed.field}` : ""}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{ed.school}</p>
                    {ed.description && <p className="text-[10px] text-slate-600 mt-1">{ed.description}</p>}
                  </div>
                  <span className="text-[9.5px] text-slate-400 font-medium shrink-0">{ed.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {cv.certifications.length > 0 && (
          <div className="mb-6">
            <SectionTitle title="Certifications" color={color} />
            <div className="space-y-2">
              {cv.certifications.map((c) => (
                <div key={c.id} className="flex justify-between gap-3">
                  <div>
                    <p className="text-[10.5px] font-semibold">{c.title}</p>
                    <p className="text-[10px] text-slate-500">{c.organization}</p>
                  </div>
                  <span className="text-[9.5px] text-slate-400">{c.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {cv.projects.length > 0 && (
          <div>
            <SectionTitle title="Projets" color={color} />
            <div className="space-y-3">
              {cv.projects.map((p) => (
                <div key={p.id}>
                  <p className="text-[10.5px] font-bold">{p.title}</p>
                  {p.technologies && <p className="text-[9.5px] italic text-slate-400 mt-0.5">{p.technologies}</p>}
                  {p.description && <p className="text-[10px] text-slate-600 mt-1 leading-[1.55]">{p.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ClassicTemplate({ cv }: { cv: CvData }) {
  const color = cv.customization.primaryColor;
  const { personalInfo: pi } = cv;

  return (
    <div
      className="flex flex-1 flex-col min-h-0 overflow-hidden px-7 pt-6 pb-1 bg-white cv-template-classic"
      style={{ fontFamily: cv.customization.fontFamily }}
    >
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-2.5">
        <div className="text-center shrink-0 pb-3 border-b-2" style={{ borderColor: color }}>
          <Photo cv={cv} placeholder className="w-20 h-20 mx-auto mb-3" borderStyle={{ border: `3px solid ${color}` }} />
          <h1 className="text-[22px] font-bold tracking-[0.08em] uppercase leading-tight" style={{ color }}>
            {fieldValue(pi.firstName)} {fieldValue(pi.lastName)}
          </h1>
          <p className={`text-[10px] uppercase tracking-[0.16em] mt-1.5 font-medium ${pi.profession?.trim() ? "text-slate-500" : "text-slate-400 italic normal-case tracking-normal"}`}>
            {fieldValue(pi.profession)}
          </p>
          <div className="flex justify-center flex-wrap gap-x-3 gap-y-0.5 mt-2.5 text-[9.5px] text-slate-500">
            {[pi.phone, pi.email, pi.address, pi.linkedin].map((v, i) => (
              <span key={i} className={v?.trim() ? "" : "text-slate-400 italic"}>{fieldValue(v)}</span>
            ))}
          </div>
        </div>

        <section className="shrink-0">
          <SectionTitle title="Profil" color={color} />
          <p className={`text-[10px] leading-[1.55] text-center italic px-2 ${pi.summary?.trim() ? "text-slate-600" : "text-slate-400"}`}>
            {fieldValue(pi.summary)}
          </p>
        </section>

        <section className="min-h-0 overflow-hidden">
          <SectionTitle title="Expérience professionnelle" color={color} large />
          <ExperienceList cv={cv} color={color} />
        </section>

        <section className="min-h-0 overflow-hidden">
          <SectionTitle title="Formation" color={color} large />
          <EducationList cv={cv} color={color} />
        </section>

        <div className="grid grid-cols-2 gap-4 shrink-0">
          <section>
            <SectionTitle title="Compétences" color={color} />
            {cv.skills.length > 0 ? (
              <div className="space-y-2">
                {cv.skills.map((s) => (
                  <div key={s.id}>
                    <p className="text-[9.5px] mb-0.5 font-medium">{fieldValue(s.name)}</p>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.level * 20}%`, backgroundColor: color }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 italic">vide</p>
            )}
          </section>
          <section>
            <SectionTitle title="Langues" color={color} />
            <LanguagesList cv={cv} />
          </section>
        </div>
      </div>
    </div>
  );
}

function CreativeTemplate({ cv }: { cv: CvData }) {
  const color = cv.customization.primaryColor;
  const { personalInfo: pi } = cv;
  const fullName = [pi.firstName, pi.lastName].filter((s) => s?.trim()).join(" ");

  return (
    <div
      className="flex flex-1 flex-col min-h-0 overflow-hidden bg-white"
      style={{ fontFamily: cv.customization.fontFamily }}
    >
      <div
        className="px-6 pt-5 pb-4 relative overflow-hidden shrink-0"
        style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 55%, ${color}99 100%)` }}
      >
        <div className="absolute right-0 top-0 w-28 h-28 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4" />
        <div className="flex items-center gap-4 relative min-w-0">
          <Photo
            cv={cv}
            placeholder
            className="w-[64px] h-[64px] shrink-0"
            borderStyle={{ border: "3px solid rgba(255,255,255,0.4)" }}
          />
          <div className="text-white min-w-0 flex-1">
            <h1 className="text-[20px] font-bold tracking-tight leading-tight truncate">
              {fullName || fieldValue("")}
            </h1>
            <p className={`text-[10px] mt-0.5 uppercase tracking-[0.14em] font-medium ${pi.profession?.trim() ? "opacity-90" : "opacity-70 italic normal-case tracking-normal"}`}>
              {fieldValue(pi.profession)}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-[9px] opacity-85">
              <span className={pi.phone?.trim() ? "" : "italic opacity-70"}>{fieldValue(pi.phone)}</span>
              <span className={`truncate ${pi.email?.trim() ? "" : "italic opacity-70"}`}>{fieldValue(pi.email)}</span>
              {pi.address?.trim() && <span>{pi.address}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 flex-1 min-h-0 overflow-hidden flex flex-col gap-3">
        <SectionBlock title="Profil" color={color} className="shrink-0 mb-0">
          <div className="p-3 rounded-lg border" style={{ backgroundColor: `${color}08`, borderColor: `${color}20` }}>
            <p className={`text-[10px] leading-[1.55] ${pi.summary?.trim() ? "text-slate-600" : "text-slate-400 italic"}`}>
              {fieldValue(pi.summary)}
            </p>
          </div>
        </SectionBlock>

        <div className="grid grid-cols-[minmax(0,1fr)_130px] gap-4 flex-1 min-h-0 overflow-hidden">
          <div className="min-w-0 overflow-hidden space-y-3">
            <SectionBlock title="Expérience" color={color} className="mb-0">
              {cv.experiences.length > 0 ? (
                <div className="space-y-2 border-l-[3px] pl-3" style={{ borderColor: `${color}45` }}>
                  {cv.experiences.map((e) => (
                    <div key={e.id}>
                      <p className={`text-[10.5px] font-bold leading-snug ${e.position?.trim() ? "" : "text-slate-400 italic"}`}>
                        {fieldValue(e.position)}
                      </p>
                      <p className="text-[9.5px] mt-0.5" style={{ color }}>
                        {fieldValue(e.company)} · {e.startDate?.trim() || e.endDate?.trim() || e.current
                          ? `${fieldValue(e.startDate)} — ${e.current ? "Présent" : fieldValue(e.endDate)}`
                          : "vide"}
                      </p>
                      <p className={`text-[9.5px] mt-0.5 leading-[1.5] line-clamp-3 ${e.description?.trim() ? "text-slate-600" : "text-slate-400 italic"}`}>
                        {fieldValue(e.description)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[9.5px] text-slate-400 italic">vide</p>
              )}
            </SectionBlock>

            <SectionBlock title="Formation" color={color} className="mb-0">
              {cv.education.length > 0 ? (
                <div className="space-y-1.5">
                  {cv.education.map((ed) => (
                    <div key={ed.id}>
                      <p className={`text-[10.5px] font-bold ${ed.degree?.trim() ? "" : "text-slate-400 italic"}`}>{fieldValue(ed.degree)}</p>
                      <p className="text-[9.5px] text-slate-500">{fieldValue(ed.school)} · {fieldValue(ed.year)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[9.5px] text-slate-400 italic">vide</p>
              )}
            </SectionBlock>

            <SectionBlock title="Projets" color={color} className="mb-0">
                {cv.projects.length > 0 ? (
                  <div className="space-y-1.5">
                    {cv.projects.map((p) => (
                      <div key={p.id} className="p-2 rounded-lg" style={{ backgroundColor: `${color}06` }}>
                        <p className="text-[10px] font-bold">{p.title}</p>
                        {p.technologies && <p className="text-[9px] text-slate-400 italic mt-0.5">{p.technologies}</p>}
                        {p.description && <p className="text-[9.5px] text-slate-600 mt-0.5 line-clamp-2">{p.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[9.5px] text-slate-400 italic">vide</p>
                )}
              </SectionBlock>
          </div>

          <div className="space-y-3 min-w-0 overflow-hidden">
            <SectionBlock title="Compétences" color={color} className="mb-0">
              {cv.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {cv.skills.map((s) => (
                    <span
                      key={s.id}
                      className="text-[8px] px-2 py-0.5 rounded-full text-white font-semibold"
                      style={{ backgroundColor: color }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[9.5px] text-slate-400 italic">vide</p>
              )}
            </SectionBlock>

            <SectionBlock title="Langues" color={color} className="mb-0">
              {cv.languages.length > 0 ? (
                <div className="space-y-1">
                  {cv.languages.map((l) => (
                    <div key={l.id} className="text-[9.5px]">
                      <span className="font-semibold">{l.language}</span>
                      <span className="text-slate-400 ml-1">· {LEVEL_LABELS[l.level]}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[9.5px] text-slate-400 italic">vide</p>
              )}
            </SectionBlock>

            <SectionBlock title="Certifications" color={color} className="mb-0">
              {cv.certifications.length > 0 ? (
                <div className="space-y-1">
                  {cv.certifications.map((c) => (
                    <div key={c.id} className="text-[9.5px]">
                      <p className={`font-semibold leading-snug ${c.title?.trim() ? "" : "text-slate-400 italic"}`}>{fieldValue(c.title)}</p>
                      <p className="text-slate-500">{fieldValue(c.organization)} · {fieldValue(c.year)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[9.5px] text-slate-400 italic">vide</p>
              )}
            </SectionBlock>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CvPreview({ cv, scale = 1, printMode = false, stylePreviewFilter = false }: CvPreviewProps) {
  const templateId = cv.customization.templateId;
  const fontSize =
    cv.customization.fontSize === "small" ? "10.5px" :
    cv.customization.fontSize === "large" ? "12px" : "11px";

  const templates: Record<string, ComponentType<{ cv: CvData }>> = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    creative: CreativeTemplate,
    executive: ExecutiveTemplate,
    corporate: CorporateTemplate,
    consultant: ConsultantTemplate,
    minimal: MinimalTemplate,
    international: InternationalTemplate,
  };

  const Template = templates[templateId] ?? ModernTemplate;

  return (
    <div
      id={printMode ? "cv-print-area" : undefined}
      className={printMode ? "cv-a4-print" : stylePreviewFilter ? "cv-a4-preview cv-style-filter" : "cv-a4-preview"}
      style={{
        width: "210mm",
        height: printMode ? undefined : "297mm",
        minHeight: "297mm",
        maxHeight: printMode ? undefined : "297mm",
        backgroundColor: "white",
        boxSizing: "border-box",
        fontSize,
        lineHeight: 1.45,
        color: "#1e293b",
        overflow: printMode ? "visible" : "hidden",
        display: "flex",
        flexDirection: "column",
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: scale !== 1 ? "top left" : undefined,
      }}
    >
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
        <Template cv={cv} />
      </div>
      <CvFooter cv={cv} templateId={templateId} />
    </div>
  );
}
