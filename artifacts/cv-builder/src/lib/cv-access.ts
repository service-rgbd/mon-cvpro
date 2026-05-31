import type { CvData } from "@/types/cv";

type PaymentLike = {
  status?: string;
  cvId?: string;
};

/** Statut serveur du CV */
export function isCvPaid(cv: CvData): boolean {
  return cv.isPaid === true;
}

/** CV débloqué — paiement confirmé retrouvé côté serveur par cvId (sans stockage client) */
export function isCvUnlocked(cv: CvData, payment?: PaymentLike | null): boolean {
  return isCvPaid(cv) && payment?.status === "completed";
}

/** @deprecated Utiliser isCvUnlocked — conservé pour compatibilité */
export function hasVerifiedPayment(
  cvId: string,
  cv: CvData,
  _paymentId: string,
  payment?: PaymentLike | null,
): boolean {
  return isCvUnlocked(cv, payment) && payment?.cvId === cvId;
}
