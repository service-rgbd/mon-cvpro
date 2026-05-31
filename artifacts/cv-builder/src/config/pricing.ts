/** Prix affiché et facturé par CV (Franc CFA) */
export const CV_PRICE_FCFA = 500;

/** Code ISO 4217 — Paystack XOF (Franc CFA BCEAO) */
export const CV_CURRENCY = "XOF";

/** Libellé prix pour l'interface (ex. « 500 FCFA ») */
export function formatPriceFcfa(amount: number = CV_PRICE_FCFA): string {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

/**
 * Montant envoyé à Paystack (API).
 * Doc Paystack : même pour XOF, multiplier par 100 (pas de centimes réels).
 * @see https://paystack.com/docs/api/#supported-currency
 * Ex. 500 FCFA → amount: 50000 (affiché 500 FCFA sur checkout)
 */
export function toPaystackAmount(amountFcfa: number = CV_PRICE_FCFA): number {
  return Math.round(Number(amountFcfa) * 100);
}

/** Montant Paystack (×100) → FCFA entiers */
export function fromPaystackAmount(paystackAmount: number): number {
  return Math.round(Number(paystackAmount) / 100);
}
