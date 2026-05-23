import { CvData } from "@/types/cv";

interface CvPreviewProps {
  cv: CvData;
  scale?: number;
  printMode?: boolean;
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
  fluent: "Courant",
  native: "Langue maternelle",
};

function SkillBar({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-1.5 w-5 rounded-full"
          style={{ backgroundColor: i <= level ? "currentColor" : "rgba(0,0,0,0.15)" }}
        />
      ))}
    </div>
  );
}

// MODERN template — two-column with colored sidebar
function ModernTemplate({ cv }: { cv: CvData }) {
  const color = cv.customization.primaryColor;
  const { personalInfo: pi } = cv;

  return (
    <div className="flex min-h-full text-[#1e293b]" style={{ fontFamily: cv.customization.fontFamily }}>
      {/* Left sidebar */}
      <div className="w-[38%] min-h-full text-white flex flex-col" style={{ backgroundColor: color }}>
        {/* Photo */}
        {cv.customization.photoStyle !== "none" && pi.photoUrl && (
          <div className="p-6 pb-4 flex justify-center">
            <img
              src={pi.photoUrl}
              alt="Photo"
              className={cv.customization.photoStyle === "circle" ? "w-28 h-28 rounded-full object-cover border-4 border-white/30" : "w-28 h-28 object-cover border-4 border-white/30"}
            />
          </div>
        )}
        <div className="px-6 py-4 border-b border-white/20">
          <h1 className="text-xl font-bold leading-tight">{pi.firstName} {pi.lastName}</h1>
          <p className="text-sm opacity-80 mt-1">{pi.profession}</p>
        </div>

        {/* Contact */}
        <div className="px-5 py-4 border-b border-white/20">
          <h3 className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-3">Contact</h3>
          <div className="space-y-1.5 text-xs opacity-90">
            {pi.phone && <div>{pi.phone}</div>}
            {pi.email && <div className="break-all">{pi.email}</div>}
            {pi.address && <div>{pi.address}</div>}
            {pi.linkedin && <div>{pi.linkedin}</div>}
            {pi.website && <div>{pi.website}</div>}
          </div>
        </div>

        {/* Skills */}
        {cv.skills.length > 0 && (
          <div className="px-5 py-4 border-b border-white/20">
            <h3 className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-3">Compétences</h3>
            <div className="space-y-2.5">
              {cv.skills.map((s) => (
                <div key={s.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs opacity-90">{s.name}</span>
                  </div>
                  <SkillBar level={s.level} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {cv.languages.length > 0 && (
          <div className="px-5 py-4 border-b border-white/20">
            <h3 className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-3">Langues</h3>
            <div className="space-y-1.5">
              {cv.languages.map((l) => (
                <div key={l.id} className="flex justify-between text-xs opacity-90">
                  <span>{l.language}</span>
                  <span className="opacity-70">{LEVEL_LABELS[l.level]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {cv.interests.length > 0 && (
          <div className="px-5 py-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-3">Centres d'intérêt</h3>
            <div className="flex flex-wrap gap-1.5">
              {cv.interests.map((i) => (
                <span key={i.id} className="text-xs px-2 py-0.5 rounded-full bg-white/20">{i.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right content */}
      <div className="flex-1 px-7 py-6">
        {/* Summary */}
        {pi.summary && (
          <div className="mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color }}>Profil</h3>
            <div className="w-8 h-0.5 mb-3" style={{ backgroundColor: color }} />
            <p className="text-xs leading-relaxed text-gray-600">{pi.summary}</p>
          </div>
        )}

        {/* Experience */}
        {cv.experiences.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color }}>Expérience</h3>
            <div className="w-8 h-0.5 mb-3" style={{ backgroundColor: color }} />
            <div className="space-y-4">
              {cv.experiences.map((e) => (
                <div key={e.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold">{e.position}</p>
                      <p className="text-xs text-gray-500">{e.company}{e.city ? `, ${e.city}` : ""}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{e.startDate} — {e.current ? "Présent" : e.endDate}</span>
                  </div>
                  {e.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{e.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color }}>Formation</h3>
            <div className="w-8 h-0.5 mb-3" style={{ backgroundColor: color }} />
            <div className="space-y-3">
              {cv.education.map((ed) => (
                <div key={ed.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold">{ed.degree}{ed.field ? ` — ${ed.field}` : ""}</p>
                      <p className="text-xs text-gray-500">{ed.school}</p>
                    </div>
                    <span className="text-xs text-gray-400">{ed.year}</span>
                  </div>
                  {ed.description && <p className="text-xs text-gray-600 mt-1">{ed.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {cv.certifications.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color }}>Certifications</h3>
            <div className="w-8 h-0.5 mb-3" style={{ backgroundColor: color }} />
            <div className="space-y-2">
              {cv.certifications.map((c) => (
                <div key={c.id} className="flex justify-between">
                  <div>
                    <p className="text-xs font-medium">{c.title}</p>
                    <p className="text-xs text-gray-500">{c.organization}</p>
                  </div>
                  <span className="text-xs text-gray-400">{c.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {cv.projects.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color }}>Projets</h3>
            <div className="w-8 h-0.5 mb-3" style={{ backgroundColor: color }} />
            <div className="space-y-3">
              {cv.projects.map((p) => (
                <div key={p.id}>
                  <p className="text-xs font-semibold">{p.title}</p>
                  {p.technologies && <p className="text-xs italic text-gray-400 mb-0.5">{p.technologies}</p>}
                  {p.description && <p className="text-xs text-gray-600">{p.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// CLASSIC template — single-column formal
function ClassicTemplate({ cv }: { cv: CvData }) {
  const color = cv.customization.primaryColor;
  const { personalInfo: pi } = cv;

  return (
    <div className="p-8 min-h-full bg-white text-[#1e293b]" style={{ fontFamily: cv.customization.fontFamily }}>
      {/* Header */}
      <div className="text-center mb-6 pb-6 border-b-2" style={{ borderColor: color }}>
        {cv.customization.photoStyle !== "none" && pi.photoUrl && (
          <div className="flex justify-center mb-3">
            <img src={pi.photoUrl} alt="Photo" className={cv.customization.photoStyle === "circle" ? "w-24 h-24 rounded-full object-cover" : "w-24 h-24 object-cover"} style={{ border: `3px solid ${color}` }} />
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-wide uppercase" style={{ color }}>{pi.firstName} {pi.lastName}</h1>
        <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">{pi.profession}</p>
        <div className="flex justify-center flex-wrap gap-3 mt-3 text-xs text-gray-500">
          {pi.phone && <span>{pi.phone}</span>}
          {pi.email && <span>{pi.email}</span>}
          {pi.address && <span>{pi.address}</span>}
          {pi.linkedin && <span>{pi.linkedin}</span>}
        </div>
      </div>

      {pi.summary && (
        <div className="mb-5">
          <p className="text-xs leading-relaxed text-gray-600 text-center italic">{pi.summary}</p>
        </div>
      )}

      {cv.experiences.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color }}>Expérience professionnelle</h3>
          <div className="h-px mb-3" style={{ backgroundColor: color }} />
          <div className="space-y-4">
            {cv.experiences.map((e) => (
              <div key={e.id} className="flex gap-4">
                <div className="w-24 text-right text-xs text-gray-400 shrink-0 pt-0.5">{e.startDate}<br />{e.current ? "Présent" : e.endDate}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{e.position}</p>
                  <p className="text-xs text-gray-500">{e.company}{e.city ? `, ${e.city}` : ""}</p>
                  {e.description && <p className="text-xs text-gray-600 mt-1">{e.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cv.education.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color }}>Formation</h3>
          <div className="h-px mb-3" style={{ backgroundColor: color }} />
          <div className="space-y-3">
            {cv.education.map((ed) => (
              <div key={ed.id} className="flex gap-4">
                <div className="w-24 text-right text-xs text-gray-400 shrink-0 pt-0.5">{ed.year}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{ed.degree}{ed.field ? ` — ${ed.field}` : ""}</p>
                  <p className="text-xs text-gray-500">{ed.school}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {cv.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color }}>Compétences</h3>
            <div className="h-px mb-3" style={{ backgroundColor: color }} />
            <div className="space-y-2">
              {cv.skills.map((s) => (
                <div key={s.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">{s.name}</span>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.level * 20}%`, backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {cv.languages.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color }}>Langues</h3>
            <div className="h-px mb-3" style={{ backgroundColor: color }} />
            <div className="space-y-1.5">
              {cv.languages.map((l) => (
                <div key={l.id} className="flex justify-between text-xs">
                  <span>{l.language}</span>
                  <span className="text-gray-400">{LEVEL_LABELS[l.level]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// CREATIVE template — accent header with icons
function CreativeTemplate({ cv }: { cv: CvData }) {
  const color = cv.customization.primaryColor;
  const { personalInfo: pi } = cv;

  return (
    <div className="min-h-full bg-white text-[#1e293b]" style={{ fontFamily: cv.customization.fontFamily }}>
      {/* Bold header */}
      <div className="px-8 pt-8 pb-6" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}>
        <div className="flex items-center gap-5">
          {cv.customization.photoStyle !== "none" && pi.photoUrl && (
            <img src={pi.photoUrl} alt="Photo" className={cv.customization.photoStyle === "circle" ? "w-20 h-20 rounded-full object-cover border-3 border-white/40 shrink-0" : "w-20 h-20 object-cover border-3 border-white/40 shrink-0"} />
          )}
          <div className="text-white">
            <h1 className="text-2xl font-bold">{pi.firstName} {pi.lastName}</h1>
            <p className="text-sm opacity-80 mt-0.5 uppercase tracking-wider">{pi.profession}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs opacity-70">
              {pi.phone && <span>{pi.phone}</span>}
              {pi.email && <span>{pi.email}</span>}
              {pi.address && <span>{pi.address}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-5">
        {pi.summary && (
          <div className="mb-5 p-3 rounded-lg" style={{ backgroundColor: `${color}10` }}>
            <p className="text-xs leading-relaxed text-gray-600">{pi.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-[1fr,180px] gap-6">
          <div>
            {cv.experiences.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color }}>
                  <span className="w-5 h-5 rounded flex items-center justify-center text-white text-xs" style={{ backgroundColor: color }}>E</span>
                  Expérience
                </h3>
                <div className="space-y-3 border-l-2 pl-4" style={{ borderColor: `${color}40` }}>
                  {cv.experiences.map((e) => (
                    <div key={e.id}>
                      <p className="text-xs font-semibold">{e.position}</p>
                      <p className="text-xs text-gray-500">{e.company} · {e.startDate} — {e.current ? "Présent" : e.endDate}</p>
                      {e.description && <p className="text-xs text-gray-600 mt-0.5">{e.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cv.education.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color }}>
                  <span className="w-5 h-5 rounded flex items-center justify-center text-white text-xs" style={{ backgroundColor: color }}>F</span>
                  Formation
                </h3>
                <div className="space-y-2">
                  {cv.education.map((ed) => (
                    <div key={ed.id}>
                      <p className="text-xs font-semibold">{ed.degree}</p>
                      <p className="text-xs text-gray-500">{ed.school} · {ed.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cv.projects.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color }}>
                  <span className="w-5 h-5 rounded flex items-center justify-center text-white text-xs" style={{ backgroundColor: color }}>P</span>
                  Projets
                </h3>
                <div className="space-y-2">
                  {cv.projects.map((p) => (
                    <div key={p.id} className="p-2 rounded" style={{ backgroundColor: `${color}08` }}>
                      <p className="text-xs font-semibold">{p.title}</p>
                      {p.technologies && <p className="text-xs text-gray-400 italic">{p.technologies}</p>}
                      {p.description && <p className="text-xs text-gray-600">{p.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            {cv.skills.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color }}>Compétences</h3>
                <div className="space-y-1.5">
                  {cv.skills.map((s) => (
                    <div key={s.id}>
                      <span className="text-xs px-2 py-0.5 rounded-full text-white inline-block mb-0.5" style={{ backgroundColor: color }}>{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {cv.languages.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color }}>Langues</h3>
                <div className="space-y-1">
                  {cv.languages.map((l) => (
                    <div key={l.id} className="text-xs">
                      <span className="font-medium">{l.language}</span>
                      <span className="text-gray-400 ml-1">· {LEVEL_LABELS[l.level]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {cv.certifications.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color }}>Certifications</h3>
                <div className="space-y-1">
                  {cv.certifications.map((c) => (
                    <div key={c.id} className="text-xs">
                      <p className="font-medium">{c.title}</p>
                      <p className="text-gray-400">{c.organization} · {c.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// EXECUTIVE template — bold typographic header
function ExecutiveTemplate({ cv }: { cv: CvData }) {
  const color = cv.customization.primaryColor;
  const { personalInfo: pi } = cv;

  return (
    <div className="p-8 min-h-full bg-white text-[#0f172a]" style={{ fontFamily: "Georgia, serif" }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: "#0f172a" }}>
              {pi.firstName} <span style={{ color }}>{pi.lastName}</span>
            </h1>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mt-1 font-light">{pi.profession}</p>
          </div>
          {cv.customization.photoStyle !== "none" && pi.photoUrl && (
            <img src={pi.photoUrl} alt="Photo" className={cv.customization.photoStyle === "circle" ? "w-20 h-20 rounded-full object-cover ml-4 shrink-0" : "w-20 h-20 object-cover ml-4 shrink-0"} style={{ border: `2px solid ${color}` }} />
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500 border-t border-b py-2.5" style={{ borderColor: `${color}30` }}>
          {pi.phone && <span>{pi.phone}</span>}
          {pi.email && <span>{pi.email}</span>}
          {pi.address && <span>{pi.address}</span>}
          {pi.linkedin && <span>{pi.linkedin}</span>}
        </div>
      </div>

      {pi.summary && (
        <div className="mb-6">
          <p className="text-xs leading-relaxed text-gray-600 italic">{pi.summary}</p>
        </div>
      )}

      {cv.experiences.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-bold uppercase tracking-[0.15em] mb-1">Expérience</h3>
          <div className="h-0.5 mb-4" style={{ backgroundColor: color }} />
          <div className="space-y-4">
            {cv.experiences.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-bold">{e.position}</p>
                  <span className="text-xs text-gray-400">{e.startDate} — {e.current ? "Présent" : e.endDate}</span>
                </div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color }}>{e.company}{e.city ? ` · ${e.city}` : ""}</p>
                {e.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{e.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {cv.education.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-bold uppercase tracking-[0.15em] mb-1">Formation</h3>
          <div className="h-0.5 mb-4" style={{ backgroundColor: color }} />
          <div className="space-y-3">
            {cv.education.map((ed) => (
              <div key={ed.id}>
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-bold">{ed.degree}{ed.field ? ` — ${ed.field}` : ""}</p>
                  <span className="text-xs text-gray-400">{ed.year}</span>
                </div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color }}>{ed.school}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {cv.skills.length > 0 && (
          <div>
            <h3 className="text-base font-bold uppercase tracking-[0.15em] mb-1">Compétences</h3>
            <div className="h-0.5 mb-3" style={{ backgroundColor: color }} />
            <div className="space-y-1.5">
              {cv.skills.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <span className="text-xs flex-1">{s.name}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i <= s.level ? color : "#e2e8f0" }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {cv.languages.length > 0 && (
          <div>
            <h3 className="text-base font-bold uppercase tracking-[0.15em] mb-1">Langues</h3>
            <div className="h-0.5 mb-3" style={{ backgroundColor: color }} />
            <div className="space-y-1.5">
              {cv.languages.map((l) => (
                <div key={l.id} className="flex justify-between text-xs">
                  <span className="font-medium">{l.language}</span>
                  <span className="text-gray-400">{LEVEL_LABELS[l.level]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CvPreview({ cv, scale = 1, printMode = false }: CvPreviewProps) {
  const templateId = cv.customization.templateId;

  const content = (
    <div
      id={printMode ? "cv-print-area" : undefined}
      style={{
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: "white",
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: scale !== 1 ? "top left" : undefined,
        fontSize: cv.customization.fontSize === "small" ? "11px" : cv.customization.fontSize === "large" ? "13px" : "12px",
      }}
    >
      {templateId === "modern" && <ModernTemplate cv={cv} />}
      {templateId === "classic" && <ClassicTemplate cv={cv} />}
      {templateId === "creative" && <CreativeTemplate cv={cv} />}
      {templateId === "executive" && <ExecutiveTemplate cv={cv} />}
      {!["modern", "classic", "creative", "executive"].includes(templateId) && <ModernTemplate cv={cv} />}
    </div>
  );

  return content;
}
