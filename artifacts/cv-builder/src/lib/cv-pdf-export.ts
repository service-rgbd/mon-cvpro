import type { CvData } from "@/types/cv";

export function cvPdfFilename(cv: CvData): string {
  const name = [cv.personalInfo.firstName, cv.personalInfo.lastName]
    .filter(Boolean)
    .join("-")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-àâäéèêëïîôùûüçÀÂÄÉÈÊËÏÎÔÙÛÜÇ]/gi, "");
  return name ? `CV-${name}.pdf` : "Mon-CV.pdf";
}

/** Génère un PDF A4 à partir de #cv-print-area (portal d'impression). */
export async function exportCvToPdfBlob(): Promise<Blob> {
  const element = document.getElementById("cv-print-area");
  if (!element) {
    throw new Error("Aperçu d'impression indisponible. Rechargez la page de téléchargement.");
  }

  document.body.classList.add("cv-pdf-capture");

  try {
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    const html2pdf = (await import("html2pdf.js")).default;

    const blob = await html2pdf()
      .set({
        margin: [0, 0, 0, 0],
        filename: "cv.pdf",
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          width: element.scrollWidth,
          height: element.scrollHeight,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .outputPdf("blob");

    if (!(blob instanceof Blob)) {
      throw new Error("Échec de la génération du PDF.");
    }

    return blob;
  } finally {
    document.body.classList.remove("cv-pdf-capture");
  }
}
