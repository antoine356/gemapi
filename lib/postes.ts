export interface Poste {
  id: string;
  label: string;
  icon: string;
  desc: string;
  placeholder_contexte: string;
  placeholder_tache: string;
}

export const POSTES: Poste[] = [
  {
    id: 'dev-plugin',
    label: 'Dev Plugin',
    icon: '🔌',
    desc: 'Développeur WordPress plugins — tu crées et maintiens des plugins custom pour des clients grands comptes',
    placeholder_contexte: 'Ex : plugin de gestion de contenu pour BNP, plugin de syndication M6...',
    placeholder_tache: 'Ex : déboguer un plugin custom, comprendre pourquoi un hook WordPress ne se déclenche pas...',
  },
  {
    id: 'dev-front',
    label: 'Dev Front/Back',
    icon: '💻',
    desc: 'Développeur front-end et back-end — tu intègres des interfaces Gutenberg et développes des APIs',
    placeholder_contexte: 'Ex : intégration Gutenberg pour Airbus, optimisation performances...',
    placeholder_tache: 'Ex : intégrer un bloc Gutenberg depuis une maquette Figma, optimiser le LCP d\'une page...',
  },
  {
    id: 'cp-run',
    label: 'Chef de Projet Run',
    icon: '⚙️',
    desc: 'Chef de projet maintenance — tu pilotes le run et la maintenance de sites WordPress grands comptes',
    placeholder_contexte: 'Ex : suivi tickets, coordination équipes, reporting client mensuel...',
    placeholder_tache: 'Ex : rédiger le compte-rendu hebdo client et prioriser les tickets en attente...',
  },
  {
    id: 'cp-refonte',
    label: 'Chef de Projet Refonte',
    icon: '🔄',
    desc: 'Chef de projet refonte — tu gères des projets de refonte de sites web complexes',
    placeholder_contexte: 'Ex : refonte France TV, migration de contenu, ateliers UX clients...',
    placeholder_tache: 'Ex : préparer le brief technique pour une réunion de cadrage avec le client...',
  },
  {
    id: 'sales',
    label: 'Commercial',
    icon: '🤝',
    desc: 'Commercial / Business Developer — tu prospectes et qualifies des clients grands comptes pour BeAPI',
    placeholder_contexte: 'Ex : qualification leads, rédaction proposals, suivi pipeline CRM...',
    placeholder_tache: 'Ex : rédiger une proposition commerciale pour un prospect grand compte...',
  },
  {
    id: 'seo',
    label: 'SEO',
    icon: '🔍',
    desc: 'Responsable SEO — tu optimises le référencement naturel des sites clients WordPress',
    placeholder_contexte: 'Ex : audits techniques, stratégie de contenu, reporting positions...',
    placeholder_tache: 'Ex : analyser les résultats d\'un audit technique et rédiger les recommandations prioritaires...',
  },
  {
    id: 'commu',
    label: 'Communication',
    icon: '📣',
    desc: 'Chargé(e) de communication — tu gères la communication interne et externe de BeAPI',
    placeholder_contexte: 'Ex : newsletters, posts LinkedIn, rédaction case studies clients...',
    placeholder_tache: 'Ex : rédiger un post LinkedIn sur un projet client ou une actualité BeAPI...',
  },
  {
    id: 'uiux',
    label: 'UI/UX',
    icon: '🎨',
    desc: 'Designer UI/UX — tu conçois les interfaces et expériences utilisateur pour les sites clients',
    placeholder_contexte: 'Ex : maquettes Figma, design system, tests utilisateurs...',
    placeholder_tache: 'Ex : rédiger les annotations d\'une maquette Figma pour les développeurs...',
  },
  {
    id: 'da',
    label: 'Directeur Artistique',
    icon: '✏️',
    desc: 'Directeur Artistique — tu définis les directions visuelles des projets clients BeAPI',
    placeholder_contexte: 'Ex : chartes graphiques, validation maquettes, briefs créatifs...',
    placeholder_tache: 'Ex : rédiger un brief créatif pour une direction artistique à valider avec le client...',
  },
  {
    id: 'rh',
    label: 'RH',
    icon: '👥',
    desc: "Responsable RH — tu gères le recrutement, l'onboarding et la vie interne chez BeAPI",
    placeholder_contexte: "Ex : fiches de poste, entretiens, suivi onboarding, culture d'entreprise...",
    placeholder_tache: 'Ex : rédiger une fiche de poste ou préparer les questions d\'un entretien de recrutement...',
  },
  {
    id: 'ceo',
    label: 'CEO',
    icon: '🧭',
    desc: 'CEO — tu pilotes la stratégie, les partenariats et le développement de BeAPI',
    placeholder_contexte: 'Ex : pitchs partenaires, notes de cadrage stratégique, reporting board...',
    placeholder_tache: 'Ex : préparer une note de cadrage stratégique ou un pitch pour un partenaire...',
  },
];

export const TONES = [
  { id: 'expert', label: 'Expert & précis' },
  { id: 'direct', label: 'Direct & court' },
  { id: 'pedagogique', label: 'Pédagogique' },
  { id: 'senior', label: 'Ton senior' },
  { id: 'structure', label: 'Structuré' },
  { id: 'creatif', label: 'Créatif' },
];

export const LOADER_MESSAGES = (prenom: string): string[] => [
  `Analyse du poste ${prenom}...`,
  'Modélisation du contexte BeAPI...',
  'Rédaction des instructions système...',
  'Calibrage du prompt métier...',
  'Finalisation...',
];
