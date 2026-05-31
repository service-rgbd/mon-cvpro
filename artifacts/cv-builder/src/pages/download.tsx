import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Download,
  CheckCircle,
  ArrowLeft,
  Printer,
  Lock,
  FileText,
  Pencil,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CvPreviewScaled from "@/components/cv-preview-scaled";
import CvPrintPortal from "@/components/cv-print-portal";
import CvShareButton from "@/components/cv-share-actions";
import Logo from "@/components/logo";
import { formatPriceFcfa } from "@/config/pricing";
import { useGetCv, useGetCvDownloadToken } from "@workspace/api-client-react";
import { CvData, cvFromApi, defaultCvData } from "@/types/cv";
import { useToast } from "@/hooks/use-toast";
import { getCvMissingRequiredFields } from "@/lib/cv-validation";
import { exportCvToPdfBlob } from "@/lib/cv-pdf-export";

const FEATURES = [
  "Format PDF haute qualité",
  "Optimisé pour l'impression A4",
  "Compatible tous les ATS",
] as const;

export default function DownloadPage() {
  const cvId = localStorage.getItem("cv_id") || "";
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [printing, setPrinting] = useState(false);

  const { data: cvData, isLoading: cvLoading } = useGetCv(cvId, {
    query: { enabled: !!cvId },
  });

  const getToken = useGetCvDownloadToken();

  const cv: CvData = cvData
    ? cvFromApi(cvData as Record<string, unknown>, localStorage.getItem("cv_photo"))
    : defaultCvData;

  const isLoading = cvLoading;
  const isPaid = cv.isPaid === true;

  useEffect(() => {
    if (isLoading || !cvData) return;
    const missing = getCvMissingRequiredFields(cv);
    if (missing.length > 0) {
      toast({
        title: "Informations obligatoires manquantes",
        description: `Complétez : ${missing.map((f) => f.label).join(", ")}`,
        variant: "destructive",
      });
      setLocation("/builder");
    }
  }, [cv, cvData, isLoading, setLocation, toast]);

  useEffect(() => {
    const onBeforePrint = () => {
      if (!isPaid) {
        toast({
          title: "Paiement requis",
          description: `Payez ${formatPriceFcfa()} pour télécharger votre CV.`,
          variant: "destructive",
        });
      }
    };
    window.addEventListener("beforeprint", onBeforePrint);
    return () => window.removeEventListener("beforeprint", onBeforePrint);
  }, [isPaid, toast]);

  const handlePrint = useCallback(() => {
    if (!isPaid) {
      toast({
        title: "Paiement requis",
        description: `Payez ${formatPriceFcfa()} pour télécharger votre CV.`,
        variant: "destructive",
      });
      return;
    }

    if (!cvId) {
      toast({ title: "Erreur", description: "Aucun CV trouvé.", variant: "destructive" });
      return;
    }

    getToken.mutate(
      { id: cvId, data: {} },
      {
        onSuccess: () => {
          setPrinting(true);
          document.body.classList.add("cv-paid-print");

          const cleanup = () => {
            document.body.classList.remove("cv-paid-print");
            setPrinting(false);
            window.removeEventListener("afterprint", cleanup);
          };

          window.addEventListener("afterprint", cleanup);

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              window.print();
            });
          });
        },
        onError: () => {
          toast({
            title: "Paiement requis",
            description: "Le téléchargement nécessite un paiement confirmé.",
            variant: "destructive",
          });
        },
      },
    );
  }, [cvId, getToken, isPaid, toast]);

  const generatePdfForShare = useCallback(async () => {
    if (!cvId || !isPaid) {
      throw new Error("Paiement requis");
    }
    await getToken.mutateAsync({ id: cvId, data: {} });
    return exportCvToPdfBlob();
  }, [cvId, getToken, isPaid]);

  return (
    <>
      <div className="h-[100dvh] flex flex-col bg-white overflow-hidden print:hidden">
        <header className="shrink-0 z-20 border-b bg-white">
          <div className="h-20 px-4 sm:px-6 flex items-center gap-3 sm:gap-4">
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Modifier mon CV</span>
            </Link>

            <Logo height={56} />

            <div className="flex-1 min-w-0" />

            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="opacity-50">1. Créer</span>
              <span className="opacity-30">→</span>
              <span className="opacity-50">2. Payer</span>
              <span className="opacity-30">→</span>
              <span className="font-medium text-foreground">3. Télécharger</span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shrink-0 ${
                isPaid
                  ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                  : "bg-amber-50 text-amber-900 ring-1 ring-amber-200"
              }`}
            >
              {isPaid ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Payé
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  Aperçu protégé
                </>
              )}
            </span>
          </div>
        </header>

        <main className="flex-1 min-h-0 flex flex-col lg:flex-row">
          <section className="flex-1 min-h-0 flex flex-col min-w-0">
            <div className="shrink-0 px-4 sm:px-6 pt-4 pb-2">
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight">Aperçu final</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isPaid
                  ? "Votre CV est prêt — téléchargez-le en PDF sans filigrane."
                  : `Filigrane actif. Payez ${formatPriceFcfa()} pour débloquer le PDF net.`}
              </p>
            </div>

            <div className="flex-1 min-h-0 px-4 sm:px-6 pb-4">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="rounded-2xl border bg-white/80 w-full max-w-sm aspect-[210/297] flex items-center justify-center shadow-sm">
                    <div className="text-center text-muted-foreground">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      Chargement de l&apos;aperçu…
                    </div>
                  </div>
                </div>
              ) : (
                <CvPreviewScaled
                  cv={cv}
                  fit="contain"
                  maxWidth={720}
                  className="h-full w-full"
                  watermarked={!isPaid}
                  watermarkMode="final"
                />
              )}
            </div>
          </section>

          <aside className="shrink-0 w-full lg:w-[320px] xl:w-[360px] border-t lg:border-t-0 lg:border-l bg-white flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="rounded-2xl border bg-white p-5">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isPaid ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-primary"
                    }`}
                  >
                    {isPaid ? <FileText className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold leading-snug">
                      {isPaid ? "Télécharger votre CV" : "Débloquer votre CV"}
                    </h2>
                    {!isPaid && (
                      <p className="text-lg font-bold text-primary mt-1">{formatPriceFcfa()}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {isPaid ? "Paiement unique confirmé" : "Paiement unique par document"}
                    </p>
                  </div>
                </div>

                <ul className="mt-4 space-y-2">
                  {FEATURES.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                  {isPaid && (
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      Retéléchargement illimité
                    </li>
                  )}
                </ul>
              </div>

              <div className="space-y-2">
                {isPaid ? (
                  <>
                    <Button
                      className="w-full gap-2 h-11"
                      size="lg"
                      onClick={handlePrint}
                      disabled={getToken.isPending || printing || isLoading}
                      data-testid="button-download-cv"
                    >
                      {getToken.isPending || printing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Génération du PDF…
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Télécharger en PDF
                        </>
                      )}
                    </Button>
                    <CvShareButton
                      cv={cv}
                      disabled={isLoading || getToken.isPending}
                      generatePdf={generatePdfForShare}
                    />
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={handlePrint}
                      disabled={getToken.isPending || printing || isLoading}
                      data-testid="button-print-cv"
                    >
                      <Printer className="w-4 h-4" />
                      Imprimer
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/payment">
                      <Button className="w-full gap-2 h-11" size="lg" data-testid="button-go-payment">
                        <Lock className="w-4 h-4" />
                        Payer {formatPriceFcfa()}
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full gap-2" disabled data-testid="button-download-cv">
                      <Download className="w-4 h-4" />
                      Télécharger en PDF
                    </Button>
                  </>
                )}
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                <Shield className="w-3 h-3" />
                {isPaid ? "Export PDF sécurisé" : "Paiement sécurisé via Paystack"}
              </div>
            </div>

            <div className="shrink-0 border-t p-4 sm:p-5 bg-white">
              <Link href="/builder">
                <Button variant="ghost" size="sm" className="w-full gap-2 text-muted-foreground">
                  <Pencil className="w-4 h-4" />
                  Retourner dans l&apos;éditeur
                </Button>
              </Link>
            </div>
          </aside>
        </main>
      </div>

      <CvPrintPortal cv={cv} enabled={isPaid && !isLoading} />
    </>
  );
}
