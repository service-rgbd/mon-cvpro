import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CheckCircle, Loader2, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { useVerifyPaystackPayment } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/cv-session";

type CallbackStatus = "verifying" | "success" | "failed";

export default function PaymentCallbackPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const verifyPaystack = useVerifyPaystackPayment();

  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const paymentId = params.get("payment_id") || "";
  const reference = params.get("reference") || params.get("trxref") || "";

  const [status, setStatus] = useState<CallbackStatus>("verifying");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const runVerify = useCallback(() => {
    if (!paymentId) {
      setStatus("failed");
      setErrorDetail("Identifiant de transaction manquant dans l'URL de retour.");
      return;
    }

    setStatus("verifying");
    setErrorDetail(null);

    verifyPaystack.mutate(
      { id: paymentId, data: reference ? { reference } : {} },
      {
        onSuccess: () => {
          setStatus("success");
          setTimeout(() => setLocation("/download"), 1200);
        },
        onError: (err) => {
          setStatus("failed");
          const msg =
            getApiErrorMessage(err) ??
            "Le paiement n'a pas pu être confirmé côté serveur.";
          setErrorDetail(msg);
          toast({
            title: "Vérification en attente",
            description:
              "Si votre compte a été débité, attendez 30 secondes puis cliquez sur « Vérifier à nouveau ».",
            variant: "destructive",
          });
        },
      },
    );
  }, [paymentId, reference, setLocation, toast, verifyPaystack]);

  useEffect(() => {
    runVerify();
  }, [runVerify]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <Logo height={52} href="/" />
        <div className="mt-8">
          {status === "failed" ? (
            <>
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-amber-600" />
              </div>
              <h1 className="text-xl font-bold mb-2">Confirmation en attente</h1>
              <p className="text-muted-foreground text-sm mb-4">
                Paystack a peut-être déjà débité votre compte, mais la confirmation n&apos;a pas
                abouti immédiatement (délai réseau ou traitement Mobile Money).
              </p>
              {errorDetail && (
                <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 mb-4 text-left">
                  {errorDetail}
                </p>
              )}
              <div className="flex flex-col gap-2">
                <Button
                  className="gap-2"
                  onClick={runVerify}
                  disabled={verifyPaystack.isPending}
                >
                  <RefreshCw className={`w-4 h-4 ${verifyPaystack.isPending ? "animate-spin" : ""}`} />
                  Vérifier à nouveau
                </Button>
                <Link href="/download">
                  <Button variant="outline" className="w-full">
                    Aller au téléchargement
                  </Button>
                </Link>
                <Link href="/payment">
                  <Button variant="ghost" className="w-full">
                    Réessayer un nouveau paiement
                  </Button>
                </Link>
              </div>
            </>
          ) : status === "success" ? (
            <>
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-xl font-bold mb-2">Paiement confirmé !</h1>
              <p className="text-muted-foreground text-sm">Redirection vers le téléchargement...</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h1 className="text-xl font-bold mb-2">Vérification Paystack</h1>
              <p className="text-muted-foreground text-sm">
                Confirmation de votre paiement en cours… (jusqu&apos;à 20 secondes)
              </p>
            </>
          )}
        </div>
        <Link
          href="/builder"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;éditeur
        </Link>
      </div>
    </div>
  );
}
