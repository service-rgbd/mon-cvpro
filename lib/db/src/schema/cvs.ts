import { pgTable, text, boolean, timestamp, jsonb, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cvsTable = pgTable("cvs", {
  id: text("id").primaryKey(),
  sessionToken: text("session_token").notNull(),
  personalInfo: jsonb("personal_info").notNull(),
  experiences: jsonb("experiences").notNull().default([]),
  education: jsonb("education").notNull().default([]),
  skills: jsonb("skills").notNull().default([]),
  languages: jsonb("languages").notNull().default([]),
  certifications: jsonb("certifications").notNull().default([]),
  projects: jsonb("projects").notNull().default([]),
  interests: jsonb("interests").notNull().default([]),
  customization: jsonb("customization").notNull(),
  isPaid: boolean("is_paid").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const paymentsTable = pgTable("payments", {
  id: text("id").primaryKey(),
  cvId: text("cv_id").notNull().references(() => cvsTable.id),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  method: text("method").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCvSchema = createInsertSchema(cvsTable);
export const insertPaymentSchema = createInsertSchema(paymentsTable);

export type InsertCv = z.infer<typeof insertCvSchema>;
export type Cv = typeof cvsTable.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof paymentsTable.$inferSelect;
