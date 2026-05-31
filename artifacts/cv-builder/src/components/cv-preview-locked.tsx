import { useLayoutEffect, useRef, useState } from "react";
import { EyeOff, Lock } from "lucide-react";
import { CvData } from "@/types/cv";
import { getTemplateMeta } from "@/data/templates";

const A4_RATIO = 297 / 210;

interface CvPreviewLockedProps {
  cv: CvData;
  maxWidth?: number;
  className?: string;
}

/** Aperçu final sans contenu réel — aucune donnée CV dans le DOM (anti-capture) */
export default function CvPreviewLocked({ cv, maxWidth = 560, className = "" }: CvPreviewLockedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);

  const color = cv.customization.primaryColor;
  const templateName = getTemplateMeta(cv.customization.templateId)?.name ?? "CV";

  useLayoutEffect(() => {
    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const available = el.clientWidth;
      setWidth(available > 0 ? Math.min(maxWidth, available) : maxWidth);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [maxWidth]);

  const height = Math.round(width * A4_RATIO);

  return (
    <div
      ref={containerRef}
      className={`w-full min-w-0 cv-preview-screen print:hidden select-none ${className}`}
      style={{ maxWidth }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className="relative rounded-xl overflow-hidden shadow-2xl border mx-auto bg-slate-100"
        style={{ width, height }}
        aria-label="Aperçu masqué — paiement requis"
      >
        {/* Fausses formes décoratives — pas de données personnelles */}
        <div className="absolute inset-0 bg-white">
          <div className="h-[18%] px-[8%] pt-[6%] pb-[4%]" style={{ backgroundColor: `${color}18` }}>
            <div className="flex gap-[5%] items-start">
              <div className="w-[14%] aspect-square rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 rounded-full bg-slate-200 w-[70%]" />
                <div className="h-2 rounded-full bg-slate-100 w-[45%]" />
                <div className="h-1.5 rounded-full bg-slate-100 w-[55%]" />
              </div>
            </div>
          </div>
          <div className="px-[8%] py-[5%] space-y-3">
            {[92, 88, 95, 78, 85, 90].map((w, i) => (
              <div key={i} className="h-2 rounded-full bg-slate-100" style={{ width: `${w}%` }} />
            ))}
            <div className="pt-2 space-y-2">
              <div className="h-2.5 rounded-full bg-slate-200 w-[35%]" />
              {[100, 94, 88, 96].map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-slate-100" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Voile opaque */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(248,250,252,0.94) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div className="w-16 h-16 rounded-full bg-slate-200/90 flex items-center justify-center mb-4 shadow-inner">
            <Lock className="w-8 h-8 text-slate-500" strokeWidth={1.5} />
          </div>
          <p className="text-base font-bold text-slate-800">Contenu masqué</p>
          <p className="text-sm text-slate-600 mt-2 max-w-[240px] leading-relaxed">
            Votre CV ({templateName}) est prêt. Le document final sera visible après paiement.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest">
            <EyeOff className="w-3.5 h-3.5" />
            Aperçu non disponible
          </div>
        </div>
      </div>
    </div>
  );
}
