export type TemplateCategory =
  | "modern"
  | "creative"
  | "classic"
  | "executive"
  | "corporate"
  | "consultant"
  | "minimal"
  | "international";

export interface CvTemplateMeta {
  id: string;
  name: string;
  color: string;
  category: TemplateCategory;
  desc: string;
}

export const CV_TEMPLATES: CvTemplateMeta[] = [
  {
    id: "modern",
    name: "Modern",
    color: "#5D5CFF",
    category: "modern",
    desc: "Minimaliste et corporate. Idéal pour la tech, la finance et le conseil.",
  },
  {
    id: "corporate",
    name: "Corporate",
    color: "#0F172A",
    category: "corporate",
    desc: "Format entreprise avec en-tête institutionnel. Parfait pour les grands groupes et la fonction publique.",
  },
  {
    id: "consultant",
    name: "Consultant",
    color: "#1E3A8A",
    category: "consultant",
    desc: "Structure rigoureuse type cabinet de conseil. Impact et résultats mis en avant.",
  },
  {
    id: "executive",
    name: "Exécutif",
    color: "#B45309",
    category: "executive",
    desc: "Typographie forte pour cadres dirigeants et profils senior.",
  },
  {
    id: "classic",
    name: "Classique",
    color: "#1e293b",
    category: "classic",
    desc: "Sobre et institutionnel. Le standard des secteurs traditionnels.",
  },
  {
    id: "minimal",
    name: "Minimal",
    color: "#111827",
    category: "minimal",
    desc: "Design suisse épuré. Élégance maximale, zéro superflu.",
  },
  {
    id: "international",
    name: "International",
    color: "#0369A1",
    category: "international",
    desc: "Optimisé ATS et recruteurs internationaux. Une colonne, ultra lisible.",
  },
  {
    id: "creative",
    name: "Créatif",
    color: "#7C3AED",
    category: "creative",
    desc: "Audacieux et visuel. Marketing, design et communication.",
  },
];

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  modern: "Moderne",
  creative: "Créatif",
  classic: "Classique",
  executive: "Exécutif",
  corporate: "Entreprise",
  consultant: "Consultant",
  minimal: "Minimal",
  international: "International",
};

export function getTemplateMeta(id: string): CvTemplateMeta | undefined {
  return CV_TEMPLATES.find((t) => t.id === id);
}
