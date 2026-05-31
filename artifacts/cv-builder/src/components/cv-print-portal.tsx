import { createPortal } from "react-dom";
import CvPreview from "@/components/cv-preview";
import { CvData } from "@/types/cv";

interface CvPrintPortalProps {
  cv: CvData;
  enabled: boolean;
}

/** Surface d'impression hors de l'arbre React masqué par print:hidden */
export default function CvPrintPortal({ cv, enabled }: CvPrintPortalProps) {
  if (!enabled || typeof document === "undefined") return null;

  return createPortal(
    <div className="cv-print-surface" aria-hidden="true">
      <CvPreview cv={cv} printMode />
    </div>,
    document.body,
  );
}
