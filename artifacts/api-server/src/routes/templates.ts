import { Router } from "express";

const router = Router();

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean two-column layout with a bold colored sidebar. Perfect for tech and finance roles.",
    category: "modern",
    previewColor: "#4F46E5",
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Enterprise header with structured two-column body. Ideal for large companies and public sector.",
    category: "corporate",
    previewColor: "#0F172A",
  },
  {
    id: "consultant",
    name: "Consultant",
    description: "Numbered sections and rigorous hierarchy. Built for consulting and advisory profiles.",
    category: "consultant",
    previewColor: "#1E3A8A",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Bold typographic header with strong visual hierarchy. Commands attention at the top.",
    category: "executive",
    previewColor: "#B45309",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Clean single-column layout with a formal header. Trusted by executives and academics.",
    category: "classic",
    previewColor: "#1e293b",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Swiss-inspired minimalist design with maximum clarity and whitespace.",
    category: "minimal",
    previewColor: "#111827",
  },
  {
    id: "international",
    name: "International",
    description: "ATS-friendly single-column format optimized for global recruiters.",
    category: "international",
    previewColor: "#0369A1",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Dynamic header with accent colors and icon-enhanced sections. Stand out from the crowd.",
    category: "creative",
    previewColor: "#7C3AED",
  },
];

router.get("/templates", (req, res) => {
  res.json(TEMPLATES);
});

export default router;
