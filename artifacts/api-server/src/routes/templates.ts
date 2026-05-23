import { Router } from "express";

const router = Router();

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean two-column layout with a bold colored sidebar. Perfect for tech and creative roles.",
    category: "modern",
    previewColor: "#2563eb",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Dynamic header with accent colors and icon-enhanced sections. Stand out from the crowd.",
    category: "creative",
    previewColor: "#7c3aed",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Clean single-column layout with a formal header. Trusted by executives and academics.",
    category: "classic",
    previewColor: "#1e293b",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Bold typographic header with strong visual hierarchy. Commands attention at the top.",
    category: "executive",
    previewColor: "#b45309",
  },
];

router.get("/templates", (req, res) => {
  res.json(TEMPLATES);
});

export default router;
