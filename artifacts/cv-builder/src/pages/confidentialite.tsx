import LegalPageLayout, { ConfidentialiteContent } from "@/components/legal-content";

export default function ConfidentialitePage() {
  return (
    <LegalPageLayout
      title="Politique de confidentialité & cookies"
      subtitle="Comment CVPro traite vos données — sans compte utilisateur."
    >
      <ConfidentialiteContent />
    </LegalPageLayout>
  );
}
