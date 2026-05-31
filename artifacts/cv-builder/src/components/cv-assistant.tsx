import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Eye, HelpCircle, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONVERSATION_GUIDE_STEPS } from "@/data/conversation-guide-steps";
import { ASSISTANT_AVATAR_SRC, ASSISTANT_NAME, getStepIndexForSection } from "@/config/assistant";
import { getCvMissingRequiredFields, isCvReadyForDownload } from "@/lib/cv-validation";
import AssistantFillForm from "@/components/assistant-fill-form";
import type { CvData } from "@/types/cv";

interface CvAssistantProps {
  cv: CvData;
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  onPersonalInfoChange: (field: string, value: string) => void;
  onCvUpdate: (updater: (prev: CvData) => CvData) => void;
  onGoToPreview: () => void;
  initialExpanded?: boolean;
}

function AssistantAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-14 h-14" : "w-9 h-9";
  return (
    <img
      src={ASSISTANT_AVATAR_SRC}
      alt={ASSISTANT_NAME}
      className={`${dims} rounded-full object-cover object-top shrink-0 ring-2 ring-white`}
    />
  );
}

export default function CvAssistant({
  cv,
  activeSection,
  onSectionChange,
  onPersonalInfoChange,
  onCvUpdate,
  onGoToPreview,
  initialExpanded = false,
}: CvAssistantProps) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [stepIndex, setStepIndex] = useState(() => getStepIndexForSection(activeSection));
  const [visibleMessages, setVisibleMessages] = useState(0);
  const navSourceRef = useRef<"tab" | "assistant">("tab");

  const step = CONVERSATION_GUIDE_STEPS[stepIndex];
  const totalSteps = CONVERSATION_GUIDE_STEPS.length;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;
  const missingRequired = getCvMissingRequiredFields(cv);
  const readyForDownload = isCvReadyForDownload(cv);

  useEffect(() => {
    if (navSourceRef.current === "assistant") {
      navSourceRef.current = "tab";
      return;
    }
    const idx = getStepIndexForSection(activeSection);
    if (idx !== stepIndex) {
      setStepIndex(idx);
    }
  }, [activeSection, stepIndex]);

  useEffect(() => {
    setVisibleMessages(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    step.messages.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleMessages(i + 1);
        }, 160 + i * 380)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [stepIndex, step.messages]);

  const goToStep = useCallback(
    (nextIndex: number) => {
      navSourceRef.current = "assistant";
      setStepIndex(nextIndex);
      const section = CONVERSATION_GUIDE_STEPS[nextIndex]?.sectionId;
      if (section) onSectionChange(section);
    },
    [onSectionChange]
  );

  function minimize() {
    setExpanded(false);
  }

  function goNext() {
    if (isLast) {
      onGoToPreview();
      return;
    }
    goToStep(Math.min(stepIndex + 1, totalSteps - 1));
  }

  function goPrev() {
    goToStep(Math.max(stepIndex - 1, 0));
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="fixed bottom-4 right-4 z-[120] group shadow-lg rounded-full"
        aria-label={`Ouvrir ${ASSISTANT_NAME}`}
        data-testid="assistant-fab"
      >
        <div className="relative">
          <AssistantAvatar size="lg" />
          {!readyForDownload && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
          )}
        </div>
        <span className="sr-only">{ASSISTANT_NAME}</span>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-[120] w-[min(calc(100vw-2rem),380px)] flex flex-col rounded-xl border border-border bg-white shadow-2xl overflow-hidden"
      data-testid="builder-conversation-guide"
      role="dialog"
      aria-labelledby="guide-title"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5 px-4 py-3 border-b bg-primary/[0.04]">
        <AssistantAvatar size="md" />
        <div className="flex-1 min-w-0">
          <p id="guide-title" className="text-sm font-semibold text-foreground leading-tight">
            {ASSISTANT_NAME}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Étape {stepIndex + 1} / {totalSteps} — {step.title}
          </p>
        </div>
        <button
          type="button"
          onClick={minimize}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Réduire l'assistant"
          data-testid="button-minimize-guide"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      <div className="px-2 py-1.5 border-b bg-muted/30">
        <div className="flex gap-1 px-2">
          {CONVERSATION_GUIDE_STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= stepIndex ? "bg-primary" : "bg-muted-foreground/20"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 max-h-[min(52vh,400px)] overflow-y-auto px-3 py-3 space-y-2.5">
        {step.messages.slice(0, visibleMessages).map((message, i) => (
          <div
            key={`${step.id}-${i}`}
            className="flex gap-2 items-start animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <AssistantAvatar size="sm" />
            <div className="rounded-2xl rounded-tl-md bg-muted/60 border border-border/50 px-3 py-2 text-sm text-foreground leading-relaxed">
              {message}
            </div>
          </div>
        ))}

        {visibleMessages < step.messages.length && (
          <div className="flex gap-2 items-center pl-9">
            <span className="inline-flex gap-1 px-3 py-2 rounded-2xl bg-muted/40">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
            </span>
          </div>
        )}

        {step.example && visibleMessages >= step.messages.length && (
          <div className="ml-9 rounded-lg border border-primary/15 bg-primary/[0.03] px-3 py-2 animate-in fade-in duration-300">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">
              Exemple concret
            </p>
            <p className="text-xs text-foreground/90 whitespace-pre-line leading-relaxed font-mono">
              {step.example}
            </p>
          </div>
        )}

        {step.hint && visibleMessages >= step.messages.length && (
          <p className="ml-9 text-xs text-muted-foreground italic animate-in fade-in duration-300">
            {step.hint}
          </p>
        )}

        {step.sectionId && visibleMessages >= step.messages.length && (
          <AssistantFillForm
            sectionId={step.sectionId}
            cv={cv}
            onPersonalInfoChange={onPersonalInfoChange}
            onCvUpdate={onCvUpdate}
          />
        )}

        {(step.id === "personal" || step.id === "summary" || step.id === "finish") &&
          visibleMessages >= step.messages.length && (
            <div
              className={`ml-9 rounded-lg border px-3 py-2 text-xs animate-in fade-in duration-300 ${
                readyForDownload
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-amber-200 bg-amber-50 text-amber-900"
              }`}
            >
              {readyForDownload ? (
                <p>Parfait — vous pouvez télécharger votre CV.</p>
              ) : (
                <p>
                  Il manque encore :{" "}
                  <strong>{missingRequired.map((f) => f.label).join(", ")}</strong>
                </p>
              )}
            </div>
          )}
      </div>

      <div className="border-t px-3 py-3 space-y-2 bg-white">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 gap-1"
            onClick={goPrev}
            disabled={isFirst}
            data-testid="button-guide-prev"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </Button>
          <Button
            type="button"
            size="sm"
            className="flex-1 gap-1"
            onClick={goNext}
            disabled={isLast && !readyForDownload}
            data-testid="button-guide-next"
          >
            {isLast ? (
              <>
                Aperçu
                <Eye className="w-4 h-4" />
              </>
            ) : (
              <>
                Suivant
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
        <div className="flex items-center justify-end">
          <Link href="/aide">
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs px-2">
              <HelpCircle className="w-3.5 h-3.5" />
              Centre d'aide
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
