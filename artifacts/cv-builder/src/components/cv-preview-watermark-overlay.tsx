const FINAL_WATERMARKS = [
  "CVPro",
  "APERÇU",
  "CVPro",
  "APERÇU",
  "CVPro",
  "APERÇU",
  "CVPro",
  "APERÇU",
  "CVPro",
  "APERÇU",
  "CVPro",
  "APERÇU",
];

/** Grille dense pour le builder — contenu lisible mais gêné par les filigranes */
function buildEditorWatermarks() {
  const labels = ["APERÇU", "APERÇU", "CVPro", "APERÇU"];
  const items: Array<{ text: string; top: string; left: string; rotate: number; size: number }> = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 5; col++) {
      const i = row * 5 + col;
      items.push({
        text: labels[i % labels.length],
        top: `${-2 + row * 11.5 + (col % 2) * 3}%`,
        left: `${-14 + col * 22 + (row % 2) * 9}%`,
        rotate: i % 2 === 0 ? -32 : -26,
        size: i % 3 === 0 ? 19 : i % 3 === 1 ? 15 : 17,
      });
    }
  }

  return items;
}

const EDITOR_WATERMARKS = buildEditorWatermarks();

interface CvPreviewWatermarkOverlayProps {
  mode?: "editor" | "final";
}

/** Calque filigrane — aperçu non payé uniquement */
export default function CvPreviewWatermarkOverlay({ mode = "final" }: CvPreviewWatermarkOverlayProps) {
  const isEditor = mode === "editor";
  const opacity = isEditor ? 0.34 : 0.32;
  const veil = isEditor
    ? "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.1) 100%)"
    : "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.72) 38%, rgba(248,250,252,0.88) 100%)";

  const watermarks = isEditor ? EDITOR_WATERMARKS : FINAL_WATERMARKS.map((text, i) => ({
    text,
    top: `${2 + (i % 4) * 20}%`,
    left: `${-12 + (i % 3) * 24 + Math.floor(i / 4) * 6}%`,
    rotate: -32,
    size: i % 2 === 0 ? 28 : 22,
  }));

  return (
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none print:hidden select-none" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: veil }} />

      <div className="absolute inset-0" style={{ opacity }}>
        {watermarks.map((item, i) => (
          <span
            key={i}
            className="absolute font-bold text-slate-700 whitespace-nowrap"
            style={{
              fontSize: `${item.size}px`,
              fontFamily: "'Segoe Script', 'Brush Script MT', cursive",
              transform: `rotate(${item.rotate}deg)`,
              top: item.top,
              left: item.left,
            }}
          >
            {item.text}
          </span>
        ))}
      </div>

      {!isEditor && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="px-6 py-3 rounded-lg border-2 border-amber-400/90 bg-amber-50/95 text-center shadow-lg"
            style={{ transform: "rotate(-18deg)" }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-900">Aperçu protégé</p>
            <p className="text-xs mt-1 text-amber-800">CVPro — Paiement requis</p>
          </div>
        </div>
      )}
    </div>
  );
}
