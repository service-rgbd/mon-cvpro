import { useCallback, useEffect, useState } from "react";
import { Loader2, Mail, MessageCircle, Send, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cvPdfFilename } from "@/lib/cv-pdf-export";
import type { CvData } from "@/types/cv";

function buildShareContent(cv: CvData) {
  const pi = cv.personalInfo;
  const fullName = [pi.firstName, pi.lastName].filter(Boolean).join(" ").trim() || "Mon CV";
  const profession = pi.profession?.trim();
  const contact = [pi.phone?.trim(), pi.email?.trim()].filter(Boolean).join(" · ");
  const summary = pi.summary?.trim();
  const topSkills = cv.skills
    .slice(0, 6)
    .map((s) => s.name)
    .filter(Boolean)
    .join(", ");
  const lastJob = cv.experiences[0];
  const experienceLine = lastJob
    ? `${lastJob.position}${lastJob.company ? ` — ${lastJob.company}` : ""}`
    : undefined;

  const lines = [
    "Bonjour,",
    "",
    "Veuillez trouver ci-joint mon CV professionnel (fichier PDF).",
    "",
    fullName,
    profession,
    experienceLine,
    contact || undefined,
    summary ? `Profil : ${summary}` : undefined,
    topSkills ? `Compétences : ${topSkills}` : undefined,
    "",
    "Cordialement,",
    fullName,
  ].filter(Boolean);

  return {
    title: `CV — ${fullName}`,
    text: lines.join("\n"),
    filename: cvPdfFilename(cv),
  };
}

function downloadPdfBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

interface CvShareButtonProps {
  cv: CvData;
  disabled?: boolean;
  /** Génère le PDF (après validation paiement côté parent). */
  generatePdf: () => Promise<Blob>;
}

export default function CvShareButton({ cv, disabled, generatePdf }: CvShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const { toast } = useToast();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const preparePdf = useCallback(async () => {
    setPreparing(true);
    try {
      return await generatePdf();
    } finally {
      setPreparing(false);
    }
  }, [generatePdf]);

  const shareWithPdf = useCallback(
    async (action: "whatsapp" | "telegram" | "email" | "native") => {
      const { title, text, filename } = buildShareContent(cv);

      let blob: Blob;
      try {
        blob = await preparePdf();
      } catch {
        toast({
          title: "PDF indisponible",
          description: "Impossible de générer le CV. Réessayez ou utilisez « Télécharger en PDF ».",
          variant: "destructive",
        });
        return;
      }

      const file = new File([blob], filename, { type: "application/pdf" });

      const canShareFiles =
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (action === "native" || (canShareFiles && (action === "whatsapp" || action === "telegram"))) {
        try {
          await navigator.share({
            title,
            text,
            files: [file],
          });
          close();
          return;
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") return;
        }
      }

      downloadPdfBlob(blob, filename);

      if (action === "whatsapp") {
        const message = `${text}\n\n📎 Le fichier PDF « ${filename} » vient d'être téléchargé : joignez-le à ce message.`;
        close();
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
        toast({
          title: "PDF téléchargé",
          description: "Dans WhatsApp, appuyez sur 📎 et sélectionnez le PDF pour l'envoyer.",
        });
        return;
      }

      if (action === "telegram") {
        const message = `${text}\n\n📎 Joignez le PDF « ${filename} » (téléchargé sur votre appareil).`;
        close();
        window.open(
          `https://t.me/share/url?text=${encodeURIComponent(message)}`,
          "_blank",
          "noopener,noreferrer",
        );
        toast({
          title: "PDF téléchargé",
          description: "Dans Telegram, joignez le fichier PDF depuis vos téléchargements.",
        });
        return;
      }

      if (action === "email") {
        const body = `${text}\n\n📎 Pièce jointe : ${filename} (fichier téléchargé — ajoutez-le à votre e-mail).`;
        close();
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
        toast({
          title: "PDF téléchargé",
          description: "Ajoutez le PDF en pièce jointe dans votre logiciel de messagerie.",
        });
      }
    },
    [cv, close, preparePdf, toast],
  );

  const buttonsDisabled = disabled || preparing;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        disabled={disabled}
        onClick={() => setOpen(true)}
        data-testid="button-share-cv"
      >
        <Share2 className="w-4 h-4" />
        Partager mon CV
      </Button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Fermer"
            onClick={close}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-cv-title"
            className="relative z-[101] w-full max-w-[340px] rounded-xl border bg-background shadow-lg animate-in fade-in-0 zoom-in-95 duration-200"
          >
            <div className="px-5 pt-5 pb-3 pr-12">
              <h2 id="share-cv-title" className="text-base font-semibold">
                Partager mon CV
              </h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Un PDF de votre CV et un message de présentation seront préparés pour l&apos;envoi.
              </p>
            </div>

            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>

            {preparing && (
              <div className="flex items-center justify-center gap-2 px-5 pb-3 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Génération du PDF…
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 px-5 pb-5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 h-11 justify-start"
                disabled={buttonsDisabled}
                onClick={() => shareWithPdf("whatsapp")}
                data-testid="button-share-whatsapp"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                WhatsApp
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 h-11 justify-start"
                disabled={buttonsDisabled}
                onClick={() => shareWithPdf("email")}
                data-testid="button-share-email"
              >
                <Mail className="w-4 h-4" />
                E-mail
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 h-11 justify-start"
                disabled={buttonsDisabled}
                onClick={() => shareWithPdf("telegram")}
                data-testid="button-share-telegram"
              >
                <Send className="w-4 h-4 text-[#229ED9]" />
                Telegram
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 h-11 justify-start"
                disabled={buttonsDisabled}
                onClick={() => shareWithPdf("native")}
                data-testid="button-share-contact"
              >
                <Share2 className="w-4 h-4" />
                Autre app
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
