import { CvData } from "@/types/cv";
import {
  CertificationsList,
  CompactLabel,
  ContactFields,
  ContactGrid,
  EducationList,
  ExperienceList,
  fieldValue,
  InterestsInline,
  LEVEL_LABELS,
  LanguagesList,
  NumberedHeader,
  Photo,
  SectionBlock,
  SectionTitle,
  SkillBar,
  SkillsBullets,
  SkillsInline,
} from "./cv-template-shared";

export function CorporateTemplate({ cv }: { cv: CvData }) {
  const color = cv.customization.primaryColor;
  const pi = cv.personalInfo;

  return (
    <div className="flex flex-1 flex-col min-h-full bg-white" style={{ fontFamily: cv.customization.fontFamily }}>
      <div className="px-8 py-6 text-white flex items-center gap-5" style={{ backgroundColor: color }}>
        <Photo cv={cv} className="w-20 h-20 shrink-0" borderStyle={{ border: "3px solid rgba(255,255,255,0.35)" }} />
        <div className="flex-1 min-w-0">
          <h1 className="text-[24px] font-bold tracking-tight uppercase">
            {pi.firstName} {pi.lastName}
          </h1>
          {pi.profession && (
            <p className="text-[11px] mt-1 tracking-[0.15em] uppercase opacity-90">{pi.profession}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-[9.5px] opacity-85">
            {pi.phone && <span>{pi.phone}</span>}
            {pi.email && <span>{pi.email}</span>}
            {pi.address && <span>{pi.address}</span>}
            {pi.linkedin && <span>{pi.linkedin}</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-[32%] shrink-0 border-r px-5 py-6 bg-slate-50/80 space-y-5">
          {pi.summary && (
            <div>
              <SectionTitle title="Profil" color={color} />
              <p className="text-[10px] leading-[1.6] text-slate-600">{pi.summary}</p>
            </div>
          )}
          {cv.skills.length > 0 && (
            <div>
              <SectionTitle title="Compétences clés" color={color} />
              <div className="space-y-2">
                {cv.skills.map((s) => (
                  <div key={s.id}>
                    <p className="text-[10px] font-semibold mb-1">{s.name}</p>
                    <SkillBar level={s.level} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {cv.languages.length > 0 && (
            <div>
              <SectionTitle title="Langues" color={color} />
              {cv.languages.map((l) => (
                <div key={l.id} className="flex justify-between text-[10px] mb-1">
                  <span className="font-medium">{l.language}</span>
                  <span className="text-slate-400">{LEVEL_LABELS[l.level]}</span>
                </div>
              ))}
            </div>
          )}
          {cv.certifications.length > 0 && (
            <div>
              <SectionTitle title="Certifications" color={color} />
              {cv.certifications.map((c) => (
                <div key={c.id} className="mb-2 text-[10px]">
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-slate-500">{c.organization} · {c.year}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 px-6 py-6 space-y-5">
          {cv.experiences.length > 0 && (
            <div>
              <SectionTitle title="Parcours professionnel" color={color} large />
              <div className="space-y-4">
                {cv.experiences.map((e) => (
                  <div key={e.id} className="grid grid-cols-[72px,1fr] gap-3">
                    <div className="text-[9px] font-bold uppercase text-slate-400 pt-0.5 leading-relaxed">
                      {e.startDate}<br />{e.current ? "Présent" : e.endDate}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold">{e.position}</p>
                      <p className="text-[10px] font-semibold mt-0.5" style={{ color }}>{e.company}{e.city ? ` — ${e.city}` : ""}</p>
                      {e.description && <p className="text-[10px] text-slate-600 mt-1.5 leading-[1.6]">{e.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {cv.education.length > 0 && (
            <div>
              <SectionTitle title="Formation" color={color} large />
              {cv.education.map((ed) => (
                <div key={ed.id} className="grid grid-cols-[72px,1fr] gap-3 mb-3">
                  <div className="text-[9px] font-bold text-slate-400 pt-0.5">{ed.year}</div>
                  <div>
                    <p className="text-[11px] font-bold">{ed.degree}{ed.field ? ` — ${ed.field}` : ""}</p>
                    <p className="text-[10px] text-slate-500">{ed.school}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {cv.projects.length > 0 && (
            <div>
              <SectionTitle title="Projets" color={color} />
              {cv.projects.map((p) => (
                <div key={p.id} className="mb-2">
                  <p className="text-[10.5px] font-bold">{p.title}</p>
                  {p.description && <p className="text-[10px] text-slate-600">{p.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ConsultantTemplate({ cv }: { cv: CvData }) {
  const color = cv.customization.primaryColor;
  const pi = cv.personalInfo;
  const fullName = [pi.firstName, pi.lastName].filter((s) => s?.trim()).join(" ");
  const font = cv.customization.fontFamily;

  return (
    <div
      className="flex flex-1 flex-col min-h-0 overflow-hidden bg-white"
      style={{ fontFamily: font }}
    >
      <header className="px-7 pt-5 pb-3 border-b shrink-0" style={{ borderColor: `${color}35` }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-[22px] font-bold tracking-tight leading-tight">
              {fullName || fieldValue("")}
            </h1>
            <p className={`text-[10px] uppercase tracking-[0.14em] mt-1 ${pi.profession?.trim() ? "text-slate-500" : "text-slate-400 italic normal-case tracking-normal"}`}>
              {fieldValue(pi.profession)}
            </p>
          </div>
          <Photo
            cv={cv}
            placeholder
            className="w-[58px] h-[58px] shrink-0"
            borderStyle={{ border: `2px solid ${color}` }}
          />
        </div>
        <div className="mt-2.5">
          <ContactGrid cv={cv} className="text-[9px]" />
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <main className="flex-1 min-w-0 px-7 py-4 space-y-3 overflow-hidden">
          <section>
            <NumberedHeader num="01" title="Profil" color={color} />
            <p className={`text-[10px] leading-[1.55] ${pi.summary?.trim() ? "text-slate-600" : "text-slate-400 italic"}`}>
              {fieldValue(pi.summary)}
            </p>
          </section>

          <section>
            <NumberedHeader num="02" title="Expérience" color={color} />
            <ExperienceList cv={cv} color={color} />
          </section>

          <section>
            <NumberedHeader num="03" title="Formation" color={color} />
            <EducationList cv={cv} color={color} />
          </section>

          <section>
            <NumberedHeader num="04" title="Projets" color={color} />
            {cv.projects.length > 0 ? (
              <div className="space-y-1.5">
                {cv.projects.map((p) => (
                  <div key={p.id}>
                    <p className={`text-[10px] font-semibold ${p.title?.trim() ? "text-slate-900" : "text-slate-400 italic"}`}>
                      {fieldValue(p.title)}
                    </p>
                    <p className={`text-[9.5px] mt-0.5 leading-[1.5] ${p.description?.trim() ? "text-slate-600" : "text-slate-400 italic"}`}>
                      {fieldValue(p.description)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 italic">vide</p>
            )}
          </section>
        </main>

        <aside className="w-[34%] shrink-0 border-l px-5 py-4 bg-slate-50/60 space-y-3 overflow-hidden" style={{ borderColor: `${color}20` }}>
          <section>
            <NumberedHeader num="05" title="Expertise" color={color} />
            {cv.skills.length > 0 ? (
              <div className="space-y-1.5">
                {cv.skills.map((s) => (
                  <div key={s.id} className="text-[9.5px] flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className={s.name?.trim() ? "text-slate-700" : "text-slate-400 italic"}>{fieldValue(s.name)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 italic">vide</p>
            )}
          </section>

          <section>
            <NumberedHeader num="06" title="Langues" color={color} />
            <LanguagesList cv={cv} />
          </section>

          <section>
            <NumberedHeader num="07" title="Certifications" color={color} />
            <CertificationsList cv={cv} />
          </section>

          <section>
            <NumberedHeader num="08" title="Centres d'intérêt" color={color} />
            <InterestsInline cv={cv} />
          </section>
        </aside>
      </div>
    </div>
  );
}

export function MinimalTemplate({ cv }: { cv: CvData }) {
  const color = cv.customization.primaryColor;
  const pi = cv.personalInfo;
  const fullName = [pi.firstName, pi.lastName].filter((s) => s?.trim()).join(" ");

  return (
    <div
      className="flex flex-1 flex-col min-h-0 overflow-hidden px-7 pt-9 pb-4 bg-white cv-template-minimal"
      style={{ fontFamily: cv.customization.fontFamily }}
    >
      <header className="flex items-start gap-4 mb-3 shrink-0">
        <Photo
          cv={cv}
          placeholder
          className="w-[56px] h-[56px] shrink-0"
          borderStyle={{ border: `1px solid ${color}35` }}
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-[22px] font-light tracking-tight text-slate-900 leading-tight">
            {fullName ? (
              <>
                {pi.firstName?.trim() || ""}{" "}
                <span className="font-semibold">{pi.lastName?.trim() || fieldValue("")}</span>
              </>
            ) : (
              <span className="italic text-slate-400">{fieldValue("")}</span>
            )}
          </h1>
          <p className={`text-[10px] mt-0.5 ${pi.profession?.trim() ? "text-slate-500 tracking-[0.14em] uppercase" : "text-slate-400 italic"}`}>
            {fieldValue(pi.profession)}
          </p>
          <div className="mt-1.5 h-px w-10" style={{ backgroundColor: color }} />
        </div>
      </header>

      <ContactGrid cv={cv} className="text-[9px] mb-3 shrink-0" />

      <section className="mb-3 shrink-0">
        <CompactLabel>Résumé</CompactLabel>
        <p className={`text-[10px] leading-[1.5] ${pi.summary?.trim() ? "text-slate-600" : "text-slate-400 italic"}`}>
          {fieldValue(pi.summary)}
        </p>
      </section>

      <section className="mb-3">
        <CompactLabel>Expérience</CompactLabel>
        <ExperienceList cv={cv} color={color} />
      </section>

      <div className="grid grid-cols-2 gap-x-5 gap-y-2.5 flex-1 content-start">
        <section>
          <CompactLabel>Formation</CompactLabel>
          <EducationList cv={cv} color={color} />
        </section>
        <section>
          <CompactLabel>Compétences</CompactLabel>
          <SkillsInline cv={cv} />
        </section>
        <section>
          <CompactLabel>Langues</CompactLabel>
          <LanguagesList cv={cv} />
        </section>
        <section>
          <CompactLabel>Certifications</CompactLabel>
          <CertificationsList cv={cv} />
        </section>
        <section>
          <CompactLabel>Projets</CompactLabel>
          {cv.projects.length > 0 ? (
            cv.projects.map((p) => (
              <p key={p.id} className="text-[9.5px] text-slate-600 mb-0.5 leading-snug">
                {fieldValue(p.title)}
              </p>
            ))
          ) : (
            <p className="text-[10px] text-slate-400 italic">vide</p>
          )}
        </section>
        <section>
          <CompactLabel>Centres d'intérêt</CompactLabel>
          <InterestsInline cv={cv} />
        </section>
      </div>
    </div>
  );
}

export function InternationalTemplate({ cv }: { cv: CvData }) {
  const color = cv.customization.primaryColor;
  const pi = cv.personalInfo;
  const name = [pi.firstName, pi.lastName].filter((s) => s?.trim()).join(" ");

  return (
    <div
      className="flex flex-1 flex-col min-h-0 overflow-hidden px-7 py-5 bg-white"
      style={{ fontFamily: cv.customization.fontFamily }}
    >
      <header className="flex items-start gap-4 border-b pb-3 mb-3 shrink-0" style={{ borderColor: `${color}35` }}>
        <Photo
          cv={cv}
          placeholder
          className="w-[60px] h-[60px] shrink-0"
          borderStyle={{ border: `2px solid ${color}50` }}
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-[20px] font-bold uppercase tracking-wide leading-tight" style={{ color }}>
            {name || fieldValue("")}
          </h1>
          <p className={`text-[10px] mt-0.5 ${pi.profession?.trim() ? "text-slate-600" : "text-slate-400 italic"}`}>
            {fieldValue(pi.profession)}
          </p>
          <div className="mt-2">
            <ContactFields cv={cv} labels className="text-[9px]" />
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">
        <SectionBlock title="Summary" color={color} className="mb-0 shrink-0">
          <p className={`text-[10px] leading-[1.5] ${pi.summary?.trim() ? "text-slate-700" : "text-slate-400 italic"}`}>
            {fieldValue(pi.summary)}
          </p>
        </SectionBlock>

        <SectionBlock title="Professional Experience" color={color} className="mb-0">
          <ExperienceList cv={cv} color={color} presentLabel="Present" />
        </SectionBlock>

        <SectionBlock title="Education" color={color} className="mb-0">
          <EducationList cv={cv} color={color} />
        </SectionBlock>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <SectionBlock title="Skills" color={color} className="mb-0">
            <SkillsBullets cv={cv} />
          </SectionBlock>
          <SectionBlock title="Languages" color={color} className="mb-0">
            <LanguagesList cv={cv} />
          </SectionBlock>
          <SectionBlock title="Certifications" color={color} className="mb-0">
            <CertificationsList cv={cv} />
          </SectionBlock>
          <SectionBlock title="Interests" color={color} className="mb-0">
            <InterestsInline cv={cv} />
          </SectionBlock>
        </div>
      </div>
    </div>
  );
}

export function ExecutiveTemplate({ cv }: { cv: CvData }) {
  const color = cv.customization.primaryColor;
  const pi = cv.personalInfo;
  const fullName = [pi.firstName, pi.lastName].filter((s) => s?.trim()).join(" ");
  const font = cv.customization.fontFamily;

  return (
    <div
      className="flex flex-1 flex-col min-h-0 overflow-hidden bg-white text-slate-900"
      style={{ fontFamily: font }}
    >
      <header className="px-7 pt-5 pb-3 shrink-0" style={{ borderBottom: `2px solid ${color}` }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-[24px] font-bold tracking-tight leading-tight">
              {fullName ? (
                <>
                  {pi.firstName?.trim() || ""}{" "}
                  <span style={{ color }}>{pi.lastName?.trim() || fieldValue("")}</span>
                </>
              ) : (
                <span className="italic text-slate-400">{fieldValue("")}</span>
              )}
            </h1>
            <p className={`text-[10px] uppercase tracking-[0.16em] mt-1 ${pi.profession?.trim() ? "text-slate-500" : "text-slate-400 italic normal-case tracking-normal"}`}>
              {fieldValue(pi.profession)}
            </p>
          </div>
          <Photo
            cv={cv}
            placeholder
            className="w-[62px] h-[62px] shrink-0"
            borderStyle={{ border: `2px solid ${color}` }}
          />
        </div>
        <div className="mt-2.5 py-2 border-y" style={{ borderColor: `${color}20` }}>
          <ContactGrid cv={cv} className="text-[9px]" />
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <main className="flex-1 min-w-0 px-7 py-4 space-y-3 overflow-hidden">
          <section>
            <SectionTitle title="Profil" color={color} />
            <p className={`text-[10px] leading-[1.55] ${pi.summary?.trim() ? "text-slate-600" : "text-slate-400 italic"}`}>
              {fieldValue(pi.summary)}
            </p>
          </section>

          <section>
            <SectionTitle title="Expérience" color={color} large />
            <ExperienceList cv={cv} color={color} />
          </section>

          <section>
            <SectionTitle title="Formation" color={color} large />
            <EducationList cv={cv} color={color} />
          </section>

          <section>
            <SectionTitle title="Projets" color={color} />
            {cv.projects.length > 0 ? (
              <div className="space-y-1.5">
                {cv.projects.map((p) => (
                  <div key={p.id}>
                    <p className={`text-[10px] font-semibold ${p.title?.trim() ? "text-slate-900" : "text-slate-400 italic"}`}>
                      {fieldValue(p.title)}
                    </p>
                    <p className={`text-[9.5px] mt-0.5 leading-[1.5] ${p.description?.trim() ? "text-slate-600" : "text-slate-400 italic"}`}>
                      {fieldValue(p.description)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 italic">vide</p>
            )}
          </section>
        </main>

        <aside className="w-[32%] shrink-0 border-l px-5 py-4 space-y-3 bg-slate-50/50" style={{ borderColor: `${color}18` }}>
          <section>
            <SectionTitle title="Compétences" color={color} />
            {cv.skills.length > 0 ? (
              <div className="space-y-2">
                {cv.skills.map((s) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <span className={`text-[9.5px] flex-1 ${s.name?.trim() ? "font-medium text-slate-800" : "text-slate-400 italic"}`}>
                      {fieldValue(s.name)}
                    </span>
                    <div className="flex gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: i <= s.level ? color : "#e2e8f0" }}
                        />
                      ))}
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

          <section>
            <SectionTitle title="Certifications" color={color} />
            <CertificationsList cv={cv} />
          </section>

          <section>
            <SectionTitle title="Centres d'intérêt" color={color} />
            <InterestsInline cv={cv} />
          </section>
        </aside>
      </div>
    </div>
  );
}
