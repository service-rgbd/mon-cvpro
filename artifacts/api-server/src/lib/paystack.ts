import crypto from "node:crypto";
import {
  toPaystackAmount as toPaystackAmountFromConfig,
  fromPaystackAmount as fromPaystackAmountFromConfig,
} from "../config/pricing";
import { getPaystackPublicKey, getPaystackSecretKey } from "./env";
import { logger } from "./logger";

const PAYSTACK_BASE = "https://api.paystack.co";

export class PaystackError extends Error {
  constructor(
    message: string,
    readonly statusCode = 502,
  ) {
    super(message);
    this.name = "PaystackError";
  }
}

type PaystackResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

async function paystackFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const secret = getPaystackSecretKey();
  if (!secret) {
    throw new PaystackError("Paystack secret key not configured", 503);
  }

  const response = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json()) as PaystackResponse<T> & { message?: string };

  if (!response.ok || !payload.status) {
    throw new PaystackError(payload.message ?? "Paystack request failed", response.status || 502);
  }

  return payload.data;
}

export type PaystackInitializeData = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export type PaystackVerifyData = {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  metadata?: {
    cv_id?: string;
    payment_id?: string;
  };
};

export async function initializePaystackTransaction(input: {
  email: string;
  /** Montant en FCFA entiers (ex. 500) — converti en sous-unité Paystack (×100) */
  amountFcfa: number;
  currency: string;
  reference: string;
  cvId: string;
  paymentId: string;
  callbackUrl: string;
}) {
  const currency = input.currency.toUpperCase();
  const paystackAmount = toPaystackAmountFromConfig(input.amountFcfa);

  logger.info(
    { amountFcfa: input.amountFcfa, paystackAmount, currency },
    "Paystack initialize — montant XOF (doc : FCFA × 100)",
  );

  return paystackFetch<PaystackInitializeData>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: paystackAmount,
      currency,
      reference: input.reference,
      callback_url: input.callbackUrl,
      channels: ["card", "mobile_money", "bank", "ussd", "qr", "bank_transfer"],
      metadata: {
        cv_id: input.cvId,
        payment_id: input.paymentId,
        custom_fields: [
          { display_name: "CV ID", variable_name: "cv_id", value: input.cvId },
        ],
      },
    }),
  });
}

export async function verifyPaystackTransaction(reference: string) {
  return paystackFetch<PaystackVerifyData>(`/transaction/verify/${encodeURIComponent(reference)}`);
}

const PAYSTACK_PENDING_STATUSES = new Set([
  "pending",
  "ongoing",
  "processing",
  "queued",
  "open",
]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Paystack peut renvoyer « pending » juste après la redirection — on réessaie avant d'échouer. */
export async function verifyPaystackTransactionWithRetry(
  reference: string,
  options?: { maxAttempts?: number; delayMs?: number },
) {
  const maxAttempts = options?.maxAttempts ?? 8;
  const delayMs = options?.delayMs ?? 2000;

  let last: PaystackVerifyData | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    last = await verifyPaystackTransaction(reference);
    logger.info(
      { reference, attempt, status: last.status, amount: last.amount, currency: last.currency },
      "Paystack verify attempt",
    );

    if (last.status === "success") {
      return last;
    }

    if (!PAYSTACK_PENDING_STATUSES.has(last.status)) {
      break;
    }

    if (attempt < maxAttempts) {
      await sleep(delayMs);
    }
  }

  return last!;
}

export function getPublicKeyForClient() {
  const publicKey = getPaystackPublicKey();
  if (!publicKey) {
    throw new PaystackError("Paystack public key not configured", 503);
  }
  return publicKey;
}

/** @deprecated Utiliser config/pricing — conservé pour imports existants */
export function toPaystackAmount(amount: number, currency: string): number {
  void currency;
  return toPaystackAmountFromConfig(amount);
}

export function fromPaystackAmount(paystackAmount: number, currency: string): number {
  void currency;
  return fromPaystackAmountFromConfig(paystackAmount);
}

export function verifyPaystackSignature(rawBody: string, signature: string | undefined): boolean {
  const secret = getPaystackSecretKey();
  if (!secret || !signature) return false;

  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  return hash === signature;
}
