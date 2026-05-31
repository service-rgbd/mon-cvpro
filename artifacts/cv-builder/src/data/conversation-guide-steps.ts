export type ConversationGuideStep = {
  id: string;
  sectionId?: string;
  title: string;
  messages: string[];
  example?: string;
  hint?: string;
};

export const CONVERSATION_GUIDE_STEPS: ConversationGuideStep[] = [
  {
    id: "welcome",
    title: "Bienvenue",
    messages: [
      "Bonjour ! Je suis votre Assistant CV MonCV Pro.",
      "Je reste disponible en bas à gauche : réduisez-moi quand vous voulez, je ne disparaîtrai pas.",
      "Suivez mes conseils étape par étape — avec des exemples concrets pour chaque section.",
    ],
  },
  {
    id: "personal",
    sectionId: "personal",
    title: "Informations",
    messages: [
      "Commençons par vos informations personnelles.",
      "Renseignez votre prénom, nom, profession, numéro de téléphone et adresse directement dans le chat ci-dessous — le formulaire se met à jour en direct.",
      "L'e-mail est optionnel mais recommandé.",
    ],
    example:
      "Marie Dupont · Développeuse Full-Stack · +33 6 12 34 56 78 · Lyon, France",
    hint: "Remplissez les champs marqués d'un astérisque (*) dans le formulaire à gauche.",
  },
  {
    id: "summary",
    sectionId: "summary",
    title: "Résumé",
    messages: [
      "Passons au résumé professionnel.",
      "Rédigez 3 à 5 phrases dans le champ ci-dessous : elles apparaissent automatiquement dans votre CV.",
    ],
    example:
      "Comptable avec 4 ans d'expérience en PME. Maîtrise de Sage et Excel avancé. Recherche un poste en CDI à Dakar.",
    hint: "Minimum 20 caractères pour valider le téléchargement.",
  },
  {
    id: "experience",
    sectionId: "experience",
    title: "Expériences",
    messages: [
      "Ajoutez vos expériences professionnelles, du plus récent au plus ancien.",
      "Pour chaque poste : intitulé, entreprise, dates et 3 à 5 puces avec verbes d'action (Géré, Développé, Coordonné…).",
      "Les stages et alternances comptent aussi si vous débutez.",
    ],
    example:
      "Assistant commercial · Boutique Teranga · 2023–2024\n• Accueil de 40+ clients/jour\n• Suivi des stocks (-15 % de ruptures)",
  },
  {
    id: "education",
    sectionId: "education",
    title: "Formation",
    messages: [
      "Indiquez vos diplômes et formations pertinentes.",
      "Précisez le diplôme, l'établissement et l'année d'obtention (ou « en cours »).",
    ],
    example: "Licence Gestion — Université Cheikh Anta Diop, 2022",
  },
  {
    id: "skills",
    sectionId: "skills",
    title: "Compétences",
    messages: [
      "Listez vos compétences techniques et transversales.",
      "Priorisez ce qui correspond au poste visé — 8 à 12 compétences suffisent en général.",
    ],
    example: "Excel (avancé) · Comptabilité · Relation client · Pack Office",
  },
  {
    id: "languages",
    sectionId: "languages",
    title: "Langues",
    messages: [
      "Précisez les langues que vous maîtrisez et votre niveau réel.",
      "Soyez honnête : un recruteur peut tester en entretien.",
    ],
    example: "Français — langue maternelle · Anglais — courant",
  },
  {
    id: "certifications",
    sectionId: "certifications",
    title: "Certifications",
    messages: [
      "Cette section est optionnelle mais valorise votre profil.",
      "Ajoutez certifications, permis ou attestations avec l'organisme et la date.",
    ],
    example: "Certificat Google Analytics — Google, 2024",
  },
  {
    id: "projects",
    sectionId: "projects",
    title: "Projets",
    messages: [
      "Mettez en avant des projets personnels, associatifs ou scolaires.",
      "Utile surtout si vous avez peu d'expérience professionnelle.",
    ],
    example: "Site vitrine association — WordPress, +200 visites le 1er mois",
  },
  {
    id: "interests",
    sectionId: "interests",
    title: "Intérêts",
    messages: [
      "2 à 4 centres d'intérêt suffisent pour humaniser votre CV.",
      "Choisissez des activités sincères et professionnelles (sport d'équipe, bénévolat, lecture…).",
    ],
    example: "Football en club · Lecture · Bénévolat associatif",
  },
  {
    id: "customize",
    sectionId: "customize",
    title: "Style",
    messages: [
      "Personnalisez l'apparence : modèle, couleur, police et taille.",
      "Consultez l'aperçu à droite (ou le bouton Aperçu sur mobile) avant de télécharger.",
    ],
    example: "Modèle Moderne, accent violet, police Inter — idéal profil tech ou marketing.",
  },
  {
    id: "finish",
    title: "Aperçu final",
    messages: [
      "Voilà ! Vous connaissez maintenant toutes les sections.",
      "Cliquez sur Aperçu pour voir votre CV tel qu'il apparaît dans l'éditeur.",
      "Ensuite, utilisez « Continuer vers Télécharger » pour accéder à l'aperçu final et au paiement.",
    ],
  },
];
