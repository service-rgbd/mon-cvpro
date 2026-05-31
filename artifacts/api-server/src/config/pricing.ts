/** Doit rester aligné avec artifacts/cv-builder/src/config/pricing.ts */
export const CV_PRICE_FCFA = 500;
export const CV_CURRENCY = "XOF";

/** Paystack : amount = FCFA × 100 (règle XOF, doc officielle) */
export function toPaystackAmount(amountFcfa: number): number {
  return Math.round(Number(amountFcfa) * 100);
}

/** Montant renvoyé par Paystack (×100) → FCFA entiers */
export function fromPaystackAmount(paystackAmount: number): number {
  return Math.round(Number(paystackAmount) / 100);
}
