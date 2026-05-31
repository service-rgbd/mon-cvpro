import { useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { useVerifyPaystackPayment } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function PaymentCallbackPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const verifyPaystack = useVerifyPaystackPayment();

  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const paymentId = params.get("payment_id") || "";
  const reference = params.get("reference") || params.get("trxref") || "";

  useEffect(() => {
    if (!paymentId) {
      toast({
        title: "Paiement invalide",
        description: "Identifiant de transaction manquant.",
        variant: "destructive",
      });
      const t = setTimeout(() => setLocation("/payment"), 1500);
      return () => clearTimeout(t);
    }

    verifyPaystack.mutate(
      { id: paymentId, data: reference ? { reference } : {} },
      {
        onSuccess: () => {
          setTimeout(() => setLocation("/download"), 1200);
        },
        onError: () => {
          toast({
            title: "Vérification échouée",
            description: "Le paiement n'a pas pu être confirmé. Réessayez ou contactez le support.",
            variant: "destructive",
          });
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- une seule vérification au retour Paystack
  }, [paymentId]);

  const failed = verifyPaystack.isError;
  const done = verifyPaystack.isSuccess;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <Logo height={52} href="/" />
        <div className="mt-8">
          {failed ? (
            <>
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-xl font-bold mb-2">Paiement non confirmé</h1>
              <p className="text-muted-foreground text-sm mb-6">
                La transaction Paystack n&apos;a pas pu être validée.
              </p>
              <Link href="/payment">
                <Button>Réessayer le paiement</Button>
              </Link>
            </>
          ) : done ? (
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
              <p className="text-muted-foreground text-sm">Confirmation de votre paiement en cours...</p>
            </>
          )}
        </div>
        <Link href="/builder" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-8">
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;éditeur
        </Link>
      </div>
    </div>
  );
}
