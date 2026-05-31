import { Router } from "express";
import { randomUUID } from "crypto";
import { db } from "@workspace/db";
import { cvsTable, paymentsTable } from "@workspace/db";
import { and, desc, eq } from "drizzle-orm";
import {
  CreatePaymentBody,
  GetPaymentParams,
  ConfirmPaymentParams,
  GetCvPaymentParams,
  InitializePaystackPaymentParams,
  InitializePaystackPaymentBody,
  VerifyPaystackPaymentParams,
  VerifyPaystackPaymentBody,
} from "@workspace/api-zod";
import {
  PaystackError,
  getPublicKeyForClient,
  initializePaystackTransaction,
  toPaystackAmount,
  verifyPaystackTransactionWithRetry,
} from "../lib/paystack";
import { paystackAmountMatchesFcfa } from "../config/pricing";
import { logger } from "../lib/logger";
import { isPaystackConfigured, getAppUrl } from "../lib/env";
import { CV_CURRENCY, CV_PRICE_FCFA } from "../config/pricing";

const router = Router();

async function markPaymentCompleted(paymentId: string) {
  const [payment] = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.id, paymentId));

  if (!payment) return null;
  if (payment.status === "completed") return payment;

  const [updated] = await db
    .update(paymentsTable)
    .set({ status: "completed" })
    .where(eq(paymentsTable.id, paymentId))
    .returning();

  await db
    .update(cvsTable)
    .set({ isPaid: true, updatedAt: new Date() })
    .where(eq(cvsTable.id, payment.cvId));

  return updated;
}

router.post("/payments", async (req, res) => {
  const parsed = CreatePaymentBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { cvId, amount, currency, method } = parsed.data;

  if (Math.round(amount) !== CV_PRICE_FCFA || currency.toUpperCase() !== CV_CURRENCY) {
    return res.status(400).json({
      error: `Montant invalide. Prix fixe : ${CV_PRICE_FCFA} ${CV_CURRENCY}.`,
    });
  }

  const [cv] = await db.select().from(cvsTable).where(eq(cvsTable.id, cvId));
  if (!cv) {
    return res.status(404).json({ error: "CV not found" });
  }

  if (cv.isPaid) {
    return res.status(409).json({ error: "CV already paid" });
  }

  const id = randomUUID();
  const [payment] = await db
    .insert(paymentsTable)
    .values({
      id,
      cvId,
      amount: Math.round(amount),
      currency,
      method,
      status: "pending",
      createdAt: new Date(),
    })
    .returning();

  return res.status(201).json(formatPayment(payment));
});

router.get("/payments/:id", async (req, res) => {
  const parsed = GetPaymentParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid params" });
  }

  const [payment] = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.id, parsed.data.id));

  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }

  return res.json(formatPayment(payment));
});

router.post("/payments/:id/paystack/initialize", async (req, res) => {
  const paramsParsed = InitializePaystackPaymentParams.safeParse(req.params);
  const bodyParsed = InitializePaystackPaymentBody.safeParse(req.body);

  if (!paramsParsed.success || !bodyParsed.success) {
    return res.status(400).json({ error: "Invalid request" });
  }

  if (!isPaystackConfigured()) {
    return res.status(503).json({
      error: "Paystack n'est pas configuré. Ajoutez PAYSTACK_LIVE_KEY et PAYSTACK_PUBLIC_KEY dans env.local à la racine, puis redémarrez l'API.",
    });
  }

  const [payment] = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.id, paramsParsed.data.id));

  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }

  if (payment.status === "completed") {
    return res.status(409).json({ error: "Payment already completed" });
  }

  try {
    const reference = `cvpro_${payment.id.replace(/-/g, "")}`;

    const data = await initializePaystackTransaction({
      email: bodyParsed.data.email,
      amountFcfa: payment.amount,
      currency: payment.currency,
      reference,
      cvId: payment.cvId,
      paymentId: payment.id,
      callbackUrl: `${getAppUrl()}/payment/callback?payment_id=${payment.id}`,
    });

    return res.json({
      authorizationUrl: data.authorization_url,
      accessCode: data.access_code,
      publicKey: getPublicKeyForClient(),
      reference: data.reference,
      amount: payment.amount,
      currency: payment.currency,
      paystackAmount: toPaystackAmount(payment.amount, payment.currency),
    });
  } catch (err) {
    if (err instanceof PaystackError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    throw err;
  }
});

router.post("/payments/:id/paystack/verify", async (req, res) => {
  const paramsParsed = VerifyPaystackPaymentParams.safeParse(req.params);
  const bodyParsed = VerifyPaystackPaymentBody.safeParse(req.body ?? {});

  if (!paramsParsed.success) {
    return res.status(400).json({ error: "Invalid params" });
  }

  const [payment] = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.id, paramsParsed.data.id));

  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }

  if (payment.status === "completed") {
    return res.json(formatPayment(payment));
  }

  const reference =
    bodyParsed.success && bodyParsed.data.reference
      ? bodyParsed.data.reference
      : `cvpro_${payment.id.replace(/-/g, "")}`;

  try {
    const verified = await verifyPaystackTransactionWithRetry(reference);

    if (verified.status !== "success") {
      const definitiveFailure = ["failed", "abandoned", "reversed", "cancelled"].includes(
        verified.status,
      );
      if (definitiveFailure) {
        await db
          .update(paymentsTable)
          .set({ status: "failed" })
          .where(eq(paymentsTable.id, payment.id));
      }

      const stillProcessing = ["pending", "ongoing", "processing", "queued", "open"].includes(
        verified.status,
      );
      const message = stillProcessing
        ? "Paiement encore en cours chez Paystack. Réessayez dans quelques secondes."
        : `Paiement non confirmé (statut Paystack : ${verified.status}).`;

      return res.status(402).json({ error: message, paystackStatus: verified.status });
    }

    if (verified.currency.toUpperCase() !== CV_CURRENCY) {
      return res.status(402).json({ error: "Devise Paystack incorrecte" });
    }

    if (!paystackAmountMatchesFcfa(verified.amount, payment.amount)) {
      logger.warn(
        {
          paymentId: payment.id,
          expectedFcfa: payment.amount,
          paystackAmount: verified.amount,
          currency: verified.currency,
        },
        "Paystack amount mismatch — completing anyway if user was charged",
      );
      // Ne pas bloquer si Paystack a confirmé success (débit effectué) — évite faux échecs XOF
    }

    const updated = await markPaymentCompleted(payment.id);
    return res.json(formatPayment(updated));
  } catch (err) {
    if (err instanceof PaystackError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    throw err;
  }
});

router.get("/cvs/:id/payment", async (req, res) => {
  const parsed = GetCvPaymentParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid params" });
  }

  const [cv] = await db.select().from(cvsTable).where(eq(cvsTable.id, parsed.data.id));
  if (!cv) {
    return res.status(404).json({ error: "CV not found" });
  }

  const [payment] = await db
    .select()
    .from(paymentsTable)
    .where(and(eq(paymentsTable.cvId, parsed.data.id), eq(paymentsTable.status, "completed")))
    .orderBy(desc(paymentsTable.createdAt))
    .limit(1);

  if (!payment) {
    return res.status(404).json({ error: "No completed payment for this CV" });
  }

  return res.json(formatPayment(payment));
});

/** Dev / fallback — désactivé si Paystack configuré en production */
router.post("/payments/:id/confirm", async (req, res) => {
  if (isPaystackConfigured() && process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "Manual confirmation disabled" });
  }

  const parsed = ConfirmPaymentParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid params" });
  }

  const [payment] = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.id, parsed.data.id));

  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }

  const updated = await markPaymentCompleted(parsed.data.id);
  return res.json(formatPayment(updated));
});

function formatPayment(payment: any) {
  return {
    id: payment.id,
    cvId: payment.cvId,
    amount: payment.amount,
    currency: payment.currency,
    method: payment.method,
    status: payment.status,
    createdAt: payment.createdAt instanceof Date ? payment.createdAt.toISOString() : payment.createdAt,
  };
}

export { markPaymentCompleted };
export default router;
