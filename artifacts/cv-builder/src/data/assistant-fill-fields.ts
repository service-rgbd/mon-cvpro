export type AssistantPersonalField = {
  key: "firstName" | "lastName" | "profession" | "phone" | "address" | "email";
  label: string;
  placeholder: string;
  required?: boolean;
};

export const ASSISTANT_PERSONAL_FIELDS: AssistantPersonalField[] = [
  { key: "firstName", label: "Prénom", placeholder: "Marie", required: true },
  { key: "lastName", label: "Nom", placeholder: "Dupont", required: true },
  { key: "profession", label: "Profession", placeholder: "Développeuse Full-Stack", required: true },
  { key: "phone", label: "Téléphone", placeholder: "+221 77 123 45 67", required: true },
  { key: "address", label: "Adresse", placeholder: "Dakar, Sénégal", required: true },
  { key: "email", label: "E-mail (optionnel)", placeholder: "marie@exemple.com" },
];

export const ASSISTANT_SECTIONS_WITH_FILL = new Set([
  "personal",
  "summary",
  "experience",
  "education",
  "skills",
  "languages",
  "certifications",
  "projects",
  "interests",
]);
