import { Router } from "express";
import { randomUUID } from "crypto";
import { db } from "@workspace/db";
import { cvsTable, paymentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreatePaymentBody,
  GetPaymentParams,
  ConfirmPaymentParams,
} from "@workspace/api-zod";

const router = Router();

router.post("/payments", async (req, res) => {
  const parsed = CreatePaymentBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { cvId, amount, currency, method } = parsed.data;

  const [cv] = await db.select().from(cvsTable).where(eq(cvsTable.id, cvId));
  if (!cv) {
    return res.status(404).json({ error: "CV not found" });
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

router.post("/payments/:id/confirm", async (req, res) => {
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

  const [updated] = await db
    .update(paymentsTable)
    .set({ status: "completed" })
    .where(eq(paymentsTable.id, parsed.data.id))
    .returning();

  await db
    .update(cvsTable)
    .set({ isPaid: true, updatedAt: new Date() })
    .where(eq(cvsTable.id, payment.cvId));

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

export default router;
