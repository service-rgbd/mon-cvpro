import type { CvData } from "@/types/cv";

export const SUMMARY_MIN_LENGTH = 20;

export type CvRequiredField = {
  key: string;
  label: string;
  sectionId: "personal" | "summary";
};

export function getCvMissingRequiredFields(cv: CvData): CvRequiredField[] {
  const pi = cv.personalInfo;
  const missing: CvRequiredField[] = [];

  if (!pi.firstName?.trim()) {
    missing.push({ key: "firstName", label: "Prénom", sectionId: "personal" });
  }
  if (!pi.lastName?.trim()) {
    missing.push({ key: "lastName", label: "Nom", sectionId: "personal" });
  }
  if (!pi.profession?.trim()) {
    missing.push({ key: "profession", label: "Profession", sectionId: "personal" });
  }
  if (!pi.phone?.trim()) {
    missing.push({ key: "phone", label: "Téléphone", sectionId: "personal" });
  }
  if (!pi.address?.trim()) {
    missing.push({ key: "address", label: "Adresse", sectionId: "personal" });
  }
  if (!pi.summary?.trim() || pi.summary.trim().length < SUMMARY_MIN_LENGTH) {
    missing.push({
      key: "summary",
      label: `Résumé professionnel (min. ${SUMMARY_MIN_LENGTH} caractères)`,
      sectionId: "summary",
    });
  }

  return missing;
}

export function isCvReadyForDownload(cv: CvData): boolean {
  return getCvMissingRequiredFields(cv).length === 0;
}
