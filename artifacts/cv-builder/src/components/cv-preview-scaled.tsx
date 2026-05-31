import { useLayoutEffect, useRef, useState } from "react";
import CvPreview from "@/components/cv-preview";
import CvPreviewWatermarkOverlay from "@/components/cv-preview-watermark-overlay";
import { CvData } from "@/types/cv";

interface CvPreviewScaledProps {
  cv: CvData;
  maxWidth?: number;
  className?: string;
  stylePreviewFilter?: boolean;
  /** width = largeur max ; contain = page A4 entière visible dans la zone */
  fit?: "width" | "contain";
  /** Filigrane — aperçu non payé */
  watermarked?: boolean;
  /** editor = lisible dans le builder ; final = protection renforcée sur /download */
  watermarkMode?: "editor" | "final";
}

export default function CvPreviewScaled({
  cv,
  maxWidth = 520,
  className = "",
  stylePreviewFilter = false,
  fit = "width",
  watermarked = false,
  watermarkMode = "final",
}: CvPreviewScaledProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ scale: 0.68, width: 320, height: 420 });

  useLayoutEffect(() => {
    const measure = () => {
      const contentEl = contentRef.current;
      const containerEl = containerRef.current;
      if (!contentEl || !containerEl) return;

      const naturalWidth = contentEl.offsetWidth;
      const naturalHeight = contentEl.offsetHeight;
      if (!naturalWidth || !naturalHeight) return;

      const availableWidth = containerEl.clientWidth;
      const availableHeight = containerEl.clientHeight;

      let scale: number;
      if (fit === "contain" && availableHeight > 0) {
        const maxW = availableWidth > 0 ? Math.min(maxWidth, availableWidth) : maxWidth;
        scale = Math.min(1, maxW / naturalWidth, availableHeight / naturalHeight);
      } else {
        const targetWidth = availableWidth > 0 ? Math.min(maxWidth, availableWidth) : maxWidth;
        scale = Math.min(1, targetWidth / naturalWidth);
      }

      const displayWidth = Math.ceil(naturalWidth * scale);

      setLayout({
        scale,
        width: displayWidth,
        height: Math.ceil(naturalHeight * scale),
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    if (contentRef.current) observer.observe(contentRef.current);

    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [cv, maxWidth, fit, stylePreviewFilter, watermarked, watermarkMode]);

  const watermarkFilter =
    watermarkMode === "editor" ? "blur(0.5px) saturate(0.98)" : "blur(5px) saturate(0.65)";

  return (
    <div
      ref={containerRef}
      className={`min-w-0 cv-preview-screen print:hidden ${
        fit === "contain" ? "h-full w-full flex items-center justify-center" : "w-full"
      } ${className}`}
      style={fit === "width" ? { maxWidth } : undefined}
    >
      <div
        className={`relative rounded-xl overflow-hidden shadow-2xl bg-white border mx-auto ${watermarked ? "select-none" : ""}`}
        style={{ width: layout.width, height: layout.height }}
        onContextMenu={watermarked ? (e) => e.preventDefault() : undefined}
      >
        <div
          ref={contentRef}
          className={watermarked ? "cv-preview-blurred" : undefined}
          style={{
            transform: `scale(${layout.scale})`,
            transformOrigin: "top left",
            width: "210mm",
            filter: watermarked ? watermarkFilter : undefined,
            WebkitFilter: watermarked ? watermarkFilter : undefined,
          }}
        >
          <CvPreview cv={cv} stylePreviewFilter={stylePreviewFilter} />
        </div>
        {watermarked && <CvPreviewWatermarkOverlay mode={watermarkMode} />}
      </div>
    </div>
  );
}
