import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Shield, CheckCircle, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreatePayment,
  useGetCv,
  useInitializePaystackPayment,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/logo";
import { CV_PRICE_FCFA, CV_CURRENCY, formatPriceFcfa } from "@/config/pricing";
import { clearCvSession, getApiErrorMessage, isNotFoundError } from "@/lib/cv-session";

export default function Payment() {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [email, setEmail] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const createPayment = useCreatePayment();
  const initializePaystack = useInitializePaystackPayment();

  const cvId = localStorage.getItem("cv_id") || "";

  const { data: cvData, isError: cvError, error: cvFetchError } = useGetCv(cvId, {
    query: { enabled: !!cvId, retry: false, staleTime: 0, refetchOnMount: "always" },
  });

  useEffect(() => {
    if (cvData?.isPaid) {
      setLocation("/download");
      return;
    }
    if (cvError && isNotFoundError(cvFetchError)) {
      clearCvSession();
      toast({
        title: "CV introuvable",
        description: "La session a expiré. Recréez votre CV dans l'éditeur.",
        variant: "destructive",
      });
      setTimeout(() => setLocation("/builder"), 1200);
    }
  }, [cvData?.isPaid, cvError, cvFetchError, setLocation, toast]);

  const handlePay = async () => {
    if (!cvId) {
      toast({
        title: "Erreur",
        description: "Aucun CV trouvé. Créez votre CV dans l'éditeur d'abord.",
        variant: "destructive",
      });
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast({
        title: "E-mail requis",
        description: "Paystack a besoin d'une adresse e-mail pour le reçu de paiement.",
        variant: "destructive",
      });
      return;
    }

    setStep("processing");

    try {
      const payment = await createPayment.mutateAsync({
        data: { cvId, amount: CV_PRICE_FCFA, currency: CV_CURRENCY, method: "paystack" },
      });

      const paystackData = await initializePaystack.mutateAsync({
        id: payment.id,
        data: { email: trimmedEmail },
      });

      const checkoutUrl = paystackData.authorizationUrl?.trim();
      if (!checkoutUrl) {
        throw new Error("URL de paiement Paystack indisponible.");
      }

      window.location.assign(checkoutUrl);
    } catch (err) {
      setStep("form");

      if (isNotFoundError(err)) {
        clearCvSession();
        toast({
          title: "CV introuvable",
          description: "Retournez au builder, enregistrez votre CV, puis réessayez.",
          variant: "destructive",
        });
        setTimeout(() => setLocation("/builder"), 1500);
        return;
      }

      const msg = getApiErrorMessage(err) ?? "Impossible d'ouvrir Paystack.";
      const isConfig = /configur/i.test(msg);
      const isPaystackMsg = /paystack|currency|amount|key/i.test(msg);

      toast({
        title: isConfig ? "Paystack non configuré" : "Erreur de paiement",
        description: isConfig
          ? "Vérifiez PAYSTACK_SECRET_KEY et PAYSTACK_PUBLIC_KEY sur le serveur Render."
          : isPaystackMsg
            ? msg
            : `${msg} Réessayez ou contactez le support si le problème persiste.`,
        variant: "destructive",
      });

      const alreadyPaid = msg.includes("already paid") || msg.includes("Déjà payé");
      if (alreadyPaid) {
        setTimeout(() => setLocation("/download"), 1000);
      }
    }
  };

  if (step === "processing") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <h2 className="text-xl font-bold mb-2">Redirection Paystack</h2>
          <p className="text-muted-foreground">
            Ouverture de la page de paiement sécurisée…
          </p>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Paiement confirmé !</h2>
          <p className="text-muted-foreground">Redirection vers le téléchargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 border-b bg-white">
        <div className="max-w-2xl mx-auto px-6 h-20 flex items-center gap-4">
          <Link href="/builder" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour au CV</span>
          </Link>
          <Logo height={56} />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-10 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
            <span className="font-medium">Créer</span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
            <span className="font-medium">Payer</span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">3</div>
            <span className="text-muted-foreground">Télécharger</span>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold mb-4">Récapitulatif</h2>
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-medium">CV Professionnel PDF</p>
                <p className="text-sm text-muted-foreground">Téléchargement haute qualité, retéléchargement illimité</p>
              </div>
              <span className="font-bold text-lg">{formatPriceFcfa()}</span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-xl text-primary">{formatPriceFcfa()}</span>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-[#00C3F7]/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#011B33]" />
              </div>
              <div>
                <h2 className="font-semibold">Paiement sécurisé Paystack</h2>
                <p className="text-xs text-muted-foreground">Carte, Mobile Money, Wave, Orange Money...</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail (reçu Paystack uniquement)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5"
                  data-testid="input-payment-email"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Utilisé uniquement par Paystack pour le reçu. CVPro ne crée pas de compte.
                </p>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => void handlePay()}
                disabled={createPayment.isPending || initializePaystack.isPending}
                data-testid="button-confirm-payment"
              >
                Payer {formatPriceFcfa()} avec Paystack
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3 h-3" />
                Paiement chiffré via Paystack — vous serez redirigé vers checkout.paystack.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
