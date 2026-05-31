/** Efface la session CV locale (après redémarrage API / base mémoire) */
export function clearCvSession() {
  localStorage.removeItem("cv_id");
  localStorage.removeItem("cv_photo");
}

export function isNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("status" in error)) return false;
  return (error as { status: number }).status === 404;
}

export function getApiErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  if ("data" in error) {
    const data = (error as { data?: { error?: string } }).data;
    if (data?.error) return data.error;
  }
  if ("message" in error && typeof (error as Error).message === "string") {
    return (error as Error).message;
  }
  return undefined;
}
