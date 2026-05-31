import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { paymentsTable } from "@workspace/db";
import { verifyPaystackSignature } from "../lib/paystack";
import { markPaymentCompleted } from "./payments";

const router = Router();

type PaystackWebhookEvent = {
  event: string;
  data: {
    status: string;
    reference: string;
    metadata?: {
      payment_id?: string;
    };
  };
};

router.post("/", async (req, res) => {
  const rawBody = Buffer.isBuffer(req.body)
    ? req.body.toString("utf8")
    : typeof req.body === "string"
      ? req.body
      : "";

  const signature = req.headers["x-paystack-signature"] as string | undefined;

  if (!verifyPaystackSignature(rawBody, signature)) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  let event: PaystackWebhookEvent;
  try {
    event = JSON.parse(rawBody) as PaystackWebhookEvent;
  } catch {
    return res.status(400).json({ error: "Invalid payload" });
  }

  if (event.event !== "charge.success" || event.data.status !== "success") {
    return res.json({ received: true });
  }

  const paymentId = event.data.metadata?.payment_id;
  if (paymentId) {
    await markPaymentCompleted(paymentId);
    return res.json({ received: true });
  }

  const ref = event.data.reference;
  if (ref.startsWith("cvpro_")) {
    const compactId = ref.slice(6);
    const allPayments = await db.select().from(paymentsTable);
    const match = allPayments.find((p) => p.id.replace(/-/g, "") === compactId);
    if (match) {
      await markPaymentCompleted(match.id);
    }
  }

  return res.json({ received: true });
});

export default router;
