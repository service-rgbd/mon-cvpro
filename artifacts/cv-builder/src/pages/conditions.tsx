import LegalPageLayout, { ConditionsContent } from "@/components/legal-content";

export default function ConditionsPage() {
  return (
    <LegalPageLayout
      title="Conditions d'utilisation"
      subtitle="Règles d'accès et d'utilisation du service CVPro."
    >
      <ConditionsContent />
    </LegalPageLayout>
  );
}
