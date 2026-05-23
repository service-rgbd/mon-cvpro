import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CreditCard, Shield, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreatePayment, useConfirmPayment, PaymentInputMethod } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const AMOUNT = 2990;
const CURRENCY = "XOF";

const PAYMENT_METHODS = [
  { id: "wave", label: "Wave", icon: "W", description: "Paiement mobile rapide", color: "#1B74E4" },
  { id: "mobile_money", label: "Mobile Money", icon: "M", description: "Orange Money, MTN, Moov", color: "#FF6B00" },
  { id: "card", label: "Carte bancaire", icon: <CreditCard className="w-4 h-4" />, description: "Visa, Mastercard", color: "#4F46E5" },
  { id: "paypal", label: "PayPal", icon: "P", description: "Paiement sécurisé", color: "#003087" },
];

export default function Payment() {
  const [method, setMethod] = useState<string>("wave");
  const [step, setStep] = useState<"select" | "details" | "processing" | "success">("select");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const createPayment = useCreatePayment();
  const confirmPayment = useConfirmPayment();

  const cvId = localStorage.getItem("cv_id") || "";

  const handleProceedToDetails = () => setStep("details");

  const handlePay = async () => {
    if (!cvId) {
      toast({ title: "Erreur", description: "Aucun CV trouvé. Veuillez créer votre CV d'abord.", variant: "destructive" });
      return;
    }

    setStep("processing");

    createPayment.mutate(
      { data: { cvId, amount: AMOUNT, currency: CURRENCY, method: method as PaymentInputMethod } },
      {
        onSuccess: (payment) => {
          setTimeout(() => {
            confirmPayment.mutate(
              { id: payment.id },
              {
                onSuccess: () => {
                  localStorage.setItem("payment_id", payment.id);
                  localStorage.setItem("cv_paid", "true");
                  setStep("success");
                  setTimeout(() => setLocation("/download"), 1500);
                },
                onError: () => {
                  setStep("details");
                  toast({ title: "Erreur de paiement", description: "Le paiement a échoué. Veuillez réessayer.", variant: "destructive" });
                },
              }
            );
          }, 2000);
        },
        onError: () => {
          setStep("details");
          toast({ title: "Erreur", description: "Impossible de créer la transaction.", variant: "destructive" });
        },
      }
    );
  };

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === method);

  if (step === "processing") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <h2 className="text-xl font-bold mb-2">Traitement en cours</h2>
          <p className="text-muted-foreground">Votre paiement est en cours de traitement...</p>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
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
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/builder" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour au CV</span>
          </Link>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">C</span>
            </div>
            <span className="font-bold">CVPro</span>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Steps indicator */}
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
          {/* Summary */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold mb-4">Récapitulatif</h2>
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-medium">CV Professionnel PDF</p>
                <p className="text-sm text-muted-foreground">Téléchargement haute qualité, usage illimité</p>
              </div>
              <span className="font-bold text-lg">{AMOUNT.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-xl text-primary">{AMOUNT.toLocaleString()} FCFA</span>
            </div>
          </div>

          {step === "select" && (
            <div className="rounded-xl border bg-card p-6">
              <h2 className="font-semibold mb-4">Mode de paiement</h2>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-sm ${method === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                    data-testid={`button-payment-method-${m.id}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: m.color }}>
                        {typeof m.icon === "string" ? m.icon : m.icon}
                      </div>
                      <span className="font-medium text-sm">{m.label}</span>
                      {method === m.id && <CheckCircle className="w-4 h-4 text-primary ml-auto" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{m.description}</p>
                  </button>
                ))}
              </div>
              <Button className="w-full mt-5" size="lg" onClick={handleProceedToDetails} data-testid="button-proceed-payment">
                Continuer avec {selectedMethod?.label}
              </Button>
            </div>
          )}

          {step === "details" && (
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <button onClick={() => setStep("select")} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: selectedMethod?.color }}>
                    {typeof selectedMethod?.icon === "string" ? selectedMethod.icon : selectedMethod?.icon}
                  </div>
                  <h2 className="font-semibold">{selectedMethod?.label}</h2>
                </div>
              </div>

              {(method === "wave" || method === "mobile_money") && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+221 77 000 00 00"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mt-1.5"
                      data-testid="input-phone"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Vous recevrez une notification sur votre téléphone pour valider le paiement de <strong>{AMOUNT.toLocaleString()} FCFA</strong>.</p>
                </div>
              )}

              {method === "card" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card-number">Numéro de carte</Label>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="mt-1.5" data-testid="input-card-number" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="expiry">Expiration</Label>
                      <Input id="expiry" placeholder="MM/AA" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="mt-1.5" data-testid="input-expiry" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} className="mt-1.5" data-testid="input-cvv" />
                    </div>
                  </div>
                </div>
              )}

              {method === "paypal" && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">Vous serez redirigé vers PayPal pour finaliser votre paiement sécurisé.</p>
                </div>
              )}

              <Button className="w-full mt-5" size="lg" onClick={handlePay} data-testid="button-confirm-payment">
                Payer {AMOUNT.toLocaleString()} FCFA
              </Button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                <Shield className="w-3 h-3" />
                Paiement sécurisé et chiffré
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
