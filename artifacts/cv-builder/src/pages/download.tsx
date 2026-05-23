import { useState } from "react";
import { Link } from "wouter";
import { Download, CheckCircle, ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import CvPreview from "@/components/cv-preview";
import { useGetCv, useGetCvDownloadToken } from "@workspace/api-client-react";
import { CvData, defaultCvData } from "@/types/cv";
import { useToast } from "@/hooks/use-toast";

export default function DownloadPage() {
  const cvId = localStorage.getItem("cv_id") || "";
  const paymentId = localStorage.getItem("payment_id") || "";
  const { toast } = useToast();
  const [printing, setPrinting] = useState(false);

  const { data: cvData, isLoading } = useGetCv(cvId, {
    query: { enabled: !!cvId, queryKey: ["getCv", cvId] as any },
  });

  const getToken = useGetCvDownloadToken();

  const cv: CvData = cvData
    ? {
        ...(cvData as any),
        personalInfo: (cvData as any).personalInfo ?? defaultCvData.personalInfo,
        experiences: (cvData as any).experiences ?? [],
        education: (cvData as any).education ?? [],
        skills: (cvData as any).skills ?? [],
        languages: (cvData as any).languages ?? [],
        certifications: (cvData as any).certifications ?? [],
        projects: (cvData as any).projects ?? [],
        interests: (cvData as any).interests ?? [],
        customization: (cvData as any).customization ?? defaultCvData.customization,
      }
    : defaultCvData;

  const handleDownload = () => {
    if (!cvId || !paymentId) {
      toast({ title: "Erreur", description: "Paiement introuvable.", variant: "destructive" });
      return;
    }

    getToken.mutate(
      { id: cvId, data: { paymentId } },
      {
        onSuccess: () => {
          setPrinting(true);
          setTimeout(() => {
            window.print();
            setPrinting(false);
          }, 300);
        },
        onError: () => {
          toast({ title: "Erreur", description: "Impossible de générer le PDF.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md print:hidden">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/builder" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Modifier mon CV</span>
          </Link>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">C</span>
            </div>
            <span className="font-bold">CVPro</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 print:hidden">
        {/* Success banner */}
        <div className="rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 mb-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="font-bold text-green-900 text-lg">Paiement confirmé — votre CV est prêt !</h2>
            <p className="text-green-700 text-sm mt-1">Téléchargez votre CV en PDF haute qualité ci-dessous. Vous pouvez aussi retourner le modifier si besoin.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,300px] gap-8 items-start">
          {/* CV Preview */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Aperçu final</h3>
            {isLoading ? (
              <div className="rounded-xl border bg-muted/30 h-96 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Chargement...
                </div>
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden shadow-lg border bg-white" style={{ maxWidth: "100%" }}>
                <div className="overflow-hidden" style={{ maxHeight: "700px" }}>
                  <div style={{ transform: "scale(0.75)", transformOrigin: "top left", width: "133%" }}>
                    <CvPreview cv={cv} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Download panel */}
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold mb-4">Télécharger votre CV</h3>
              <div className="space-y-3 mb-5">
                {[
                  "Format PDF haute qualité",
                  "Optimisé pour l'impression A4",
                  "Compatible tous les ATS",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleDownload}
                disabled={getToken.isPending || printing || isLoading}
                data-testid="button-download-cv"
              >
                {(getToken.isPending || printing) ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Télécharger en PDF
                  </>
                )}
              </Button>
              <Button variant="outline" className="w-full gap-2 mt-2" onClick={() => window.print()} data-testid="button-print-cv">
                <Printer className="w-4 h-4" />
                Imprimer
              </Button>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h4 className="font-medium mb-3 text-sm">Modifier votre CV</h4>
              <p className="text-xs text-muted-foreground mb-3">Vous pouvez retourner dans l'éditeur pour apporter des modifications, puis télécharger à nouveau.</p>
              <Link href="/builder">
                <Button variant="outline" size="sm" className="w-full">Retourner dans l'éditeur</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden print area — rendered only when printing */}
      {printing && (
        <div id="cv-print-area" style={{ display: "none" }}>
          <CvPreview cv={cv} printMode />
        </div>
      )}
    </div>
  );
}
