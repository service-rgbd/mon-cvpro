import { Link } from "wouter";
import { HelpCircle } from "lucide-react";
import { BUILDER_SECTION_GUIDES } from "@/data/builder-section-guide";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  sectionId?: string;
}

export default function SectionHeader({ title, subtitle, sectionId }: SectionHeaderProps) {
  const guide = sectionId ? BUILDER_SECTION_GUIDES[sectionId] : null;
  const helpHref = sectionId ? `/aide#section-${sectionId}` : "/aide";

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold leading-tight min-w-0">{title}</h1>
        {guide && sectionId && (
          <Link
            href={helpHref}
            className="shrink-0 w-9 h-9 rounded-full border border-primary/25 bg-primary/[0.06] flex items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/40 transition-colors"
            title={`Centre d'aide : ${guide.title}`}
            aria-label={`Centre d'aide — ${title}`}
            data-testid={`help-${sectionId}`}
          >
            <HelpCircle className="w-4 h-4" />
          </Link>
        )}
      </div>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}
