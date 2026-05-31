import { CONVERSATION_GUIDE_STEPS } from "@/data/conversation-guide-steps";

export const ASSISTANT_AVATAR_SRC = `${import.meta.env.BASE_URL}assistant-cv.png`;
export const ASSISTANT_NAME = "Assistant CV";

export function getStepIndexForSection(sectionId: string): number {
  const idx = CONVERSATION_GUIDE_STEPS.findIndex((s) => s.sectionId === sectionId);
  return idx >= 0 ? idx : 0;
}
