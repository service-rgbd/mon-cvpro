import { useCallback, useEffect, useState } from "react";
import { Mail, MessageCircle, Send, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { CvData } from "@/types/cv";

function buildShareContent(cv: CvData) {
  const pi = cv.personalInfo;
  const fullName = [pi.firstName, pi.lastName].filter(Boolean).join(" ").trim() || "Mon CV";
  const profession = pi.profession?.trim();
  const contact = [pi.phone?.trim(), pi.email?.trim()].filter(Boolean).join(" · ");
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  const lines = [
    `Bonjour,`,
    ``,
    `Je partage mon CV professionnel créé avec CVPro.`,
    ``,
    fullName,
    profession,
    contact || undefined,
    ``,
    appUrl ? `Créez le vôtre sur CVPro : ${appUrl}` : undefined,
  ].filter(Boolean);

  return {
    title: `CV — ${fullName}`,
    text: lines.join("\n"),
    url: appUrl,
  };
}

interface CvShareButtonProps {
  cv: CvData;
  disabled?: boolean;
}

export default function CvShareButton({ cv, disabled }: CvShareButtonProps) {
  const [open, setOpen] = useState(false);
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

  const share = () => buildShareContent(cv);

  const openShare = (href: string) => {
    close();
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const handleWhatsApp = () => {
    const { text } = share();
    openShare(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  const handleTelegram = () => {
    const { text, url } = share();
    openShare(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    );
  };

  const handleEmail = () => {
    const { title, text } = share();
    close();
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`;
  };

  const handleNativeShare = async () => {
    const { title, text, url } = share();

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        close();
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      close();
      toast({
        title: "Message copié",
        description: "Collez-le dans WhatsApp, Telegram ou votre app de messagerie.",
      });
    } catch {
      toast({
        title: "Partage indisponible",
        description: "Utilisez WhatsApp, e-mail ou Telegram ci-dessus.",
        variant: "destructive",
      });
    }
  };

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
                Envoyez un message à un recruteur ou un contact via votre application préférée.
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

            <div className="grid grid-cols-2 gap-2 px-5 pb-5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 h-11 justify-start"
                disabled={disabled}
                onClick={handleWhatsApp}
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
                disabled={disabled}
                onClick={handleEmail}
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
                disabled={disabled}
                onClick={handleTelegram}
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
                disabled={disabled}
                onClick={handleNativeShare}
                data-testid="button-share-contact"
              >
                <Share2 className="w-4 h-4" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
