import type { CvData } from "@/types/cv";

/** Payload PATCH API (photo locale via localStorage, pas en base). */
export function buildCvUpdatePayload(cv: CvData) {
  return {
    personalInfo: { ...cv.personalInfo, photoUrl: undefined },
    experiences: cv.experiences,
    education: cv.education,
    skills: cv.skills,
    languages: cv.languages,
    certifications: cv.certifications,
    projects: cv.projects,
    interests: cv.interests,
    customization: cv.customization,
  };
}
