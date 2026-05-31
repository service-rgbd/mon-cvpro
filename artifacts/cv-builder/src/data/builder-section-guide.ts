export type BuilderSectionGuide = {
  title: string;
  intro: string;
  tips: string[];
  example: string;
};

export const BUILDER_SECTION_GUIDES: Record<string, BuilderSectionGuide> = {
  personal: {
    title: "Informations personnelles",
    intro:
      "Commencez par vos coordonnées : c'est la première chose que le recruteur verra. Renseignez uniquement ce que vous souhaitez afficher sur le CV.",
    tips: [
      "Nom et prénom tels qu'ils figurent sur vos pièces officielles.",
      "E-mail professionnel (évitez les adresses trop fantaisistes).",
      "Téléphone avec indicatif si vous postulez à l'étranger.",
      "Ville ou région — pas besoin d'adresse complète.",
      "Photo optionnelle : portrait net, fond neutre, tenue professionnelle.",
    ],
    example:
      "Amadou Diallo · amadou.diallo@gmail.com · +221 77 123 45 67 · Dakar, Sénégal · linkedin.com/in/amadou-diallo",
  },
  summary: {
    title: "Résumé professionnel",
    intro:
      "En 3 à 5 lignes, présentez qui vous êtes, votre métier ou votre objectif, et ce que vous apportez. C'est votre accroche : simple, concrète, sans répéter mot pour mot la lettre de motivation.",
    tips: [
      "Indiquez votre métier ou votre spécialité en une phrase.",
      "Mentionnez 2 ou 3 compétences ou réalisations marquantes.",
      "Adaptez le ton au poste visé (junior, confirmé, reconversion…).",
      "Évitez « Je suis dynamique et motivé » sans preuve concrète.",
    ],
    example:
      "Comptable avec 4 ans d'expérience en PME et cabinet. Maîtrise de Sage et Excel avancé ; habitué aux clôtures mensuelles et aux déclarations fiscales. Recherche un poste en CDD ou CDI à Dakar.",
  },
  experience: {
    title: "Expériences professionnelles",
    intro:
      "Listez vos postes du plus récent au plus ancien. Pour chaque expérience, décrivez votre rôle et vos résultats en phrases courtes, de préférence avec des chiffres.",
    tips: [
      "Intitulé du poste + nom de l'entreprise + dates (mois/année).",
      "3 à 5 puces par poste : missions, outils, résultats.",
      "Commencez chaque puce par un verbe d'action (Géré, Développé, Coordonné…).",
      "Stages et alternances comptent : indiquez-les si vous débutez.",
    ],
    example:
      "Assistant commercial · Boutique Teranga · Jan 2023 – Déc 2024\n• Accueil et conseil de 40+ clients par jour\n• Mise en place d'un fichier de suivi des stocks (-15 % de ruptures)\n• Participation aux inventaires mensuels",
  },
  education: {
    title: "Formation",
    intro:
      "Indiquez vos diplômes et formations pertinentes pour le poste, de la plus récente à la plus ancienne. Mentionnez l'établissement et l'année d'obtention (ou en cours).",
    tips: [
      "Diplôme obtenu ou en cours + spécialité.",
      "Nom de l'école, université ou centre de formation.",
      "Mention ou option si elle valorise votre candidature.",
      "Formations courtes (certif, MOOC) peuvent aller ici ou en Certifications.",
    ],
    example:
      "Licence en Gestion des entreprises — Université Cheikh Anta Diop, 2022\nBaccalauréat série S2 — Lycée Blaise Diagne, 2019",
  },
  skills: {
    title: "Compétences",
    intro:
      "Regroupez vos savoir-faire techniques et transversaux. Priorisez ce qui correspond à l'offre d'emploi plutôt qu'une liste exhaustive.",
    tips: [
      "Mélangez compétences techniques (Excel, Photoshop…) et soft skills (communication, organisation).",
      "Indiquez un niveau honnête : débutant, intermédiaire, avancé.",
      "8 à 12 compétences suffisent en général.",
      "Évitez les compétences évidentes (« Internet », « Word » seul).",
    ],
    example:
      "Excel (avancé) · Comptabilité générale · Relation client · Rédaction commerciale · Pack Office · Gestion du stress",
  },
  languages: {
    title: "Langues",
    intro:
      "Précisez les langues que vous maîtrisez et votre niveau réel. Soyez honnête : un recruteur peut tester en entretien.",
    tips: [
      "Utilisez des niveaux clairs : débutant, intermédiaire, courant, langue maternelle.",
      "Mettez en avant les langues utiles au poste (anglais, arabe, etc.).",
      "Certification (TOEFL, DELF…) peut être mentionnée dans Certifications.",
    ],
    example:
      "Français — langue maternelle\nAnglais — courant (réunions et rédaction)\nWolof — courant",
  },
  certifications: {
    title: "Certifications",
    intro:
      "Ajoutez ici les attestations, licences ou certifications professionnelles qui renforcent votre profil.",
    tips: [
      "Nom complet de la certification + organisme émetteur.",
      "Date d'obtention ou de validité.",
      "Lien ou numéro de licence si pertinent (permis, SAP, etc.).",
    ],
    example:
      "Certificat Google Analytics — Google, 2024\nPermis B — valide jusqu'en 2028",
  },
  projects: {
    title: "Projets",
    intro:
      "Mettez en avant des projets personnels, associatifs ou scolaires qui démontrent vos compétences, surtout si vous avez peu d'expérience pro.",
    tips: [
      "Titre du projet + contexte (personnel, universitaire, bénévolat).",
      "Votre rôle et les technologies ou méthodes utilisées.",
      "Résultat ou impact concret si possible.",
    ],
    example:
      "Site vitrine pour association locale — 2024\n• Création du site avec WordPress, +200 visites le premier mois\n• Rédaction des contenus et gestion des réseaux sociaux",
  },
  interests: {
    title: "Centres d'intérêt",
    intro:
      "Quelques hobbies bien choisis humanisent votre CV et peuvent servir de point de discussion en entretien. Restez sincère et professionnel.",
    tips: [
      "2 à 4 centres d'intérêt suffisent.",
      "Préférez des activités qui montrent une qualité (sport d'équipe, lecture, bénévolat…).",
      "Évitez les listes trop longues ou controversées.",
    ],
    example:
      "Football en club · Lecture (actualité économique) · Bénévolat associatif",
  },
  customize: {
    title: "Style et mise en page",
    intro:
      "Personnalisez l'apparence de votre CV : modèle, couleurs, police et taille du texte. L'aperçu à droite (ou bouton Aperçu sur mobile) se met à jour en direct.",
    tips: [
      "Choisissez un modèle sobre pour les secteurs formels (finance, administration).",
      "Une couleur d'accent suffit ; gardez une bonne lisibilité.",
      "Testez l'aperçu avant de télécharger le PDF.",
      "Vous pouvez changer de modèle à tout moment sans perdre vos textes.",
    ],
    example:
      "Modèle « Moderne », accent violet #5D5CFF, police Inter, taille 14 px — adapté à un profil tech ou marketing.",
  },
};
