import { Router } from "express";
import { randomUUID } from "crypto";
import { db } from "@workspace/db";
import { cvsTable, paymentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateCvBody,
  GetCvParams,
  UpdateCvParams,
  UpdateCvBody,
  DeleteCvParams,
  UploadCvPhotoParams,
  UploadCvPhotoBody,
  GetCvDownloadTokenParams,
  GetCvDownloadTokenBody,
} from "@workspace/api-zod";

const router = Router();

router.post("/cvs", async (req, res) => {
  const parsed = CreateCvBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { personalInfo, customization } = parsed.data;
  const id = randomUUID();
  const sessionToken = randomUUID();

  const [cv] = await db
    .insert(cvsTable)
    .values({
      id,
      sessionToken,
      personalInfo: personalInfo as any,
      customization: customization as any,
      experiences: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      projects: [],
      interests: [],
      isPaid: false,
    })
    .returning();

  return res.status(201).json(formatCv(cv));
});

router.get("/cvs/:id", async (req, res) => {
  const parsed = GetCvParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid params" });
  }

  const [cv] = await db
    .select()
    .from(cvsTable)
    .where(eq(cvsTable.id, parsed.data.id));

  if (!cv) {
    return res.status(404).json({ error: "CV not found" });
  }

  return res.json(formatCv(cv));
});

router.patch("/cvs/:id", async (req, res) => {
  const paramsParsed = UpdateCvParams.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({ error: "Invalid params" });
  }

  const bodyParsed = UpdateCvBody.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ error: "Invalid body" });
  }

  const existing = await db
    .select()
    .from(cvsTable)
    .where(eq(cvsTable.id, paramsParsed.data.id));

  if (!existing[0]) {
    return res.status(404).json({ error: "CV not found" });
  }

  const updateData: Record<string, any> = {
    updatedAt: new Date(),
  };

  const body = bodyParsed.data;
  if (body.personalInfo !== undefined) updateData.personalInfo = body.personalInfo;
  if (body.experiences !== undefined) updateData.experiences = body.experiences;
  if (body.education !== undefined) updateData.education = body.education;
  if (body.skills !== undefined) updateData.skills = body.skills;
  if (body.languages !== undefined) updateData.languages = body.languages;
  if (body.certifications !== undefined) updateData.certifications = body.certifications;
  if (body.projects !== undefined) updateData.projects = body.projects;
  if (body.interests !== undefined) updateData.interests = body.interests;
  if (body.customization !== undefined) updateData.customization = body.customization;

  const [updated] = await db
    .update(cvsTable)
    .set(updateData)
    .where(eq(cvsTable.id, paramsParsed.data.id))
    .returning();

  return res.json(formatCv(updated));
});

router.delete("/cvs/:id", async (req, res) => {
  const parsed = DeleteCvParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid params" });
  }

  const existing = await db
    .select()
    .from(cvsTable)
    .where(eq(cvsTable.id, parsed.data.id));

  if (!existing[0]) {
    return res.status(404).json({ error: "CV not found" });
  }

  await db.delete(cvsTable).where(eq(cvsTable.id, parsed.data.id));
  return res.status(204).send();
});

router.post("/cvs/:id/photo", async (req, res) => {
  const paramsParsed = UploadCvPhotoParams.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({ error: "Invalid params" });
  }

  const bodyParsed = UploadCvPhotoBody.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ error: "Invalid body" });
  }

  const existing = await db
    .select()
    .from(cvsTable)
    .where(eq(cvsTable.id, paramsParsed.data.id));

  if (!existing[0]) {
    return res.status(404).json({ error: "CV not found" });
  }

  const { imageData, mimeType } = bodyParsed.data;
  const photoUrl = `data:${mimeType};base64,${imageData}`;

  const currentInfo = existing[0].personalInfo as Record<string, any>;
  const updatedInfo = { ...currentInfo, photoUrl };

  await db
    .update(cvsTable)
    .set({ personalInfo: updatedInfo, updatedAt: new Date() })
    .where(eq(cvsTable.id, paramsParsed.data.id));

  return res.json({ photoUrl });
});

router.post("/cvs/:id/download-token", async (req, res) => {
  const paramsParsed = GetCvDownloadTokenParams.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({ error: "Invalid params" });
  }

  const bodyParsed = GetCvDownloadTokenBody.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ error: "Invalid body" });
  }

  const [cv] = await db
    .select()
    .from(cvsTable)
    .where(eq(cvsTable.id, paramsParsed.data.id));

  if (!cv) {
    return res.status(404).json({ error: "CV not found" });
  }

  if (!cv.isPaid) {
    return res.status(402).json({ error: "Payment required" });
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const downloadUrl = `/api/cvs/${cv.id}/pdf?token=${token}`;

  return res.json({ token, downloadUrl, expiresAt });
});

function formatCv(cv: any) {
  return {
    id: cv.id,
    sessionToken: cv.sessionToken,
    personalInfo: cv.personalInfo,
    experiences: cv.experiences || [],
    education: cv.education || [],
    skills: cv.skills || [],
    languages: cv.languages || [],
    certifications: cv.certifications || [],
    projects: cv.projects || [],
    interests: cv.interests || [],
    customization: cv.customization,
    isPaid: cv.isPaid,
    createdAt: cv.createdAt instanceof Date ? cv.createdAt.toISOString() : cv.createdAt,
    updatedAt: cv.updatedAt instanceof Date ? cv.updatedAt.toISOString() : cv.updatedAt,
  };
}

export default router;
