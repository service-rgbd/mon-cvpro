import { Lock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import CvPreviewScaled from "@/components/cv-preview-scaled";
import { formatPriceFcfa } from "@/config/pricing";
import { CvData } from "@/types/cv";

interface CvPreviewProtectedProps {
  cv: CvData;
  maxWidth?: number;
  className?: string;
  /** true = aperçu avec filigrane (non payé) */
  locked?: boolean;
}

export default function CvPreviewProtected({
  cv,
  maxWidth = 560,
  className = "",
  locked = false,
}: CvPreviewProtectedProps) {
  return (
    <div className={`w-full ${className}`}>
      <CvPreviewScaled
        cv={cv}
        maxWidth={maxWidth}
        className="w-full"
        watermarked={locked}
        watermarkMode={locked ? "final" : undefined}
      />

      {locked && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/90 p-4 sm:p-5 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <p className="font-semibold text-amber-950">Aperçu avec filigrane</p>
                <p className="text-sm text-amber-800/90 mt-0.5 leading-relaxed">
                  Votre CV est visible en aperçu flouté avec filigrane. Payez{" "}
                  <strong>{formatPriceFcfa()}</strong> pour le PDF net, téléchargeable et imprimable.
                </p>
              </div>
            </div>
            <Link href="/payment" className="shrink-0">
              <Button className="w-full sm:w-auto gap-2" data-testid="button-unlock-preview">
                <Lock className="w-4 h-4" />
                Débloquer — {formatPriceFcfa()}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
