import type { Scenario } from "../types";

/**
 * Scénarios construits à partir du cahier des charges
 * (Voirie, Paysagiste, Chargé de mission, Assistant administratif).
 * Chaque scénario suit la même structure : narratif → interruptions →
 * priorisation → time-batching → action immédiate → distraction → fin.
 */

export const SCENARIOS: Scenario[] = [
  // -------------------------------------------------------------------------
  // 1. OUVRIER DE VOIRIE
  // -------------------------------------------------------------------------
  {
    id: "voirie",
    title: "Ouvrier de voirie",
    emoji: "🚧",
    category: "technique",
    blurb: "Tournée matinale · 3 nids-de-poule à sécuriser avant 12h",
    context:
      "Il est 8h30. Tu es agent de voirie dans une commune. Objectif : sécuriser et réparer 3 nids-de-poule avant 12h.",
    timeBudgetMin: 210,
    steps: [
      {
        kind: "narrative",
        id: "v_intro",
        title: "8h30 – Ta tournée commence",
        icon: "🌅",
        text: "Tu dois intervenir rapidement sur une chaussée dégradée. Zones d'intervention : A (2 km), B (5 km, proche de A), C (10 km, isolée), D (25 km).",
      },
      {
        kind: "choice",
        id: "v_call_chef",
        title: "📞 Le chef t'appelle",
        context:
          "Ton supérieur t'appelle. Il veut te transmettre des infos non prioritaires.",
        icon: "📞",
        choices: [
          {
            id: "answer",
            label: "Répondre tout de suite",
            timeDelta: -2,
            scoreDelta: -3,
            tags: ["interruption"],
            feedback:
              "Tu perds 2 min et l'échange t'éloigne de ton objectif principal.",
          },
          {
            id: "defer",
            label: "Différer (rappeler après ma 1ère intervention)",
            timeDelta: 0,
            scoreDelta: 6,
            tags: ["interruption", "concentration"],
            good: true,
            feedback: "Tu restes focus sur la mission. Bonne gestion !",
          },
        ],
      },
      {
        kind: "choice",
        id: "v_call_collegue",
        title: "📞 Un collègue te rappelle (2e fois)",
        context: "Échange informel, pas urgent.",
        icon: "📞",
        choices: [
          {
            id: "answer",
            label: "Répondre",
            timeDelta: -5,
            scoreDelta: -4,
            tags: ["interruption"],
            feedback: "5 min perdues sur un sujet non prioritaire.",
          },
          {
            id: "ignore",
            label: "Ignorer · le rappeler à la pause",
            timeDelta: 0,
            scoreDelta: 5,
            tags: ["interruption", "concentration"],
            good: true,
            feedback: "Tu protèges ta concentration.",
          },
        ],
      },
      {
        kind: "priorisation",
        id: "v_priorisation",
        title: "🧭 Organise ta matinée",
        icon: "🧭",
        context:
          "Classe les tâches du matin dans la matrice Urgence / Importance.",
        tasks: [
          {
            id: "t1",
            label: "Réparer 2 nids-de-poule",
            correct: "urgent_important",
          },
          {
            id: "t2",
            label: "Vérifier panneaux de signalisation",
            correct: "important_non_urgent",
          },
          {
            id: "t3",
            label: "Déposer panneaux de chantier",
            correct: "urgent_non_important",
          },
          {
            id: "t4",
            label: "Nettoyer la zone après intervention",
            correct: "important_non_urgent",
          },
          {
            id: "t5",
            label: "Discussion café avec un usager curieux",
            correct: "inutile",
          },
        ],
      },
      {
        kind: "choice",
        id: "v_micro",
        title: "⚡ Micro-tâches (< 5 min)",
        context: "Déplacer cônes et préparer outils. Que fais-tu ?",
        icon: "⚡",
        choices: [
          {
            id: "now",
            label: "Faire immédiatement",
            timeDelta: 3,
            scoreDelta: 6,
            tags: ["action_immediate"],
            good: true,
            feedback: "Action immédiate = chantier fluide.",
          },
          {
            id: "later",
            label: "Reporter à plus tard",
            timeDelta: -6,
            scoreDelta: -4,
            tags: ["action_immediate"],
            feedback:
              "L'accumulation va ralentir la réparation principale.",
          },
        ],
      },
      {
        kind: "batching",
        id: "v_batching",
        title: "📍 Time batching · regroupement géographique",
        icon: "📍",
        context:
          "Plusieurs interventions sont proches. Regroupe-les intelligemment pour éviter les déplacements inutiles.",
        groups: [
          { id: "matin", label: "🚐 Tournée Zone A + B (proches)" },
          { id: "aprem", label: "🚐 Tournée Zone C + D (isolées)" },
        ],
        items: [
          { id: "i1", label: "Nid-de-poule Zone A", correctGroup: "matin" },
          {
            id: "i2",
            label: "Marquage au sol Zone B",
            correctGroup: "matin",
          },
          { id: "i3", label: "Panneaux Zone B", correctGroup: "matin" },
          { id: "i4", label: "Nid-de-poule Zone C", correctGroup: "aprem" },
          {
            id: "i5",
            label: "Vérification chaussée Zone D",
            correctGroup: "aprem",
          },
        ],
      },
      {
        kind: "choice",
        id: "v_notif",
        title: "📱 Notification racoleuse",
        context:
          "« Incroyable : le casse du siècle au plus grand musée d'Europe »",
        icon: "📱",
        choices: [
          {
            id: "consult",
            label: "Consulter l'article",
            timeDelta: -3,
            scoreDelta: -5,
            tags: ["notification", "multitache"],
            feedback: "3 min perdues + concentration cassée.",
          },
          {
            id: "ignore",
            label: "Ignorer",
            timeDelta: 0,
            scoreDelta: 6,
            tags: ["notification", "concentration"],
            good: true,
            feedback: "Tu restes en mode focus.",
          },
        ],
      },
      {
        kind: "choice",
        id: "v_no",
        title: "🙅 Savoir dire non",
        context:
          "Un usager te demande de regarder un caniveau bouché chez lui (hors mission).",
        icon: "🙅",
        choices: [
          {
            id: "yes",
            label: "Accepter pour faire plaisir",
            timeDelta: -10,
            scoreDelta: -5,
            tags: ["dire_non", "interruption"],
            feedback: "10 min perdues, tu mets ton planning en danger.",
          },
          {
            id: "no",
            label: "Refuser poliment et signaler au service",
            timeDelta: 0,
            scoreDelta: 5,
            tags: ["dire_non"],
            good: true,
            feedback: "Tu restes pro tout en orientant l'usager.",
          },
        ],
      },
      {
        kind: "narrative",
        id: "v_end",
        title: "🏁 Fin de tournée",
        icon: "🏁",
        text: "Il est presque midi. Voyons comment s'est passée ta matinée…",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 2. PAYSAGISTE
  // -------------------------------------------------------------------------
  {
    id: "paysagiste",
    title: "Paysagiste",
    emoji: "🌳",
    category: "technique",
    blurb: "Entretien des espaces verts · 4 sites à traiter dans la journée",
    context:
      "Il est 8h00. Tu es paysagiste pour la collectivité. Objectif : entretenir 4 sites avant 16h en optimisant trajets et matériel.",
    timeBudgetMin: 480,
    steps: [
      {
        kind: "narrative",
        id: "p_intro",
        title: "8h00 – Briefing rapide",
        icon: "🌅",
        text: "4 sites à entretenir : tonte parc central, taille des haies école, plantation parking, désherbage square. Chaque site demande des outils différents.",
      },
      {
        kind: "choice",
        id: "p_call",
        title: "📞 Appel d'un riverain",
        context:
          "Un riverain appelle pour signaler un arbre qu'il trouve « pas joli » (pas dangereux).",
        icon: "📞",
        choices: [
          {
            id: "long",
            label: "Discuter longuement pour le rassurer",
            timeDelta: -8,
            scoreDelta: -4,
            tags: ["interruption"],
            feedback:
              "8 min perdues. Le sujet n'était pas urgent ni prioritaire.",
          },
          {
            id: "redirect",
            label: "Noter et orienter vers le service",
            timeDelta: -1,
            scoreDelta: 5,
            tags: ["interruption", "dire_non"],
            good: true,
            feedback: "Tu réponds sans te laisser embarquer.",
          },
        ],
      },
      {
        kind: "priorisation",
        id: "p_prio",
        title: "🧭 Priorise les sites",
        icon: "🧭",
        context: "Classe ces tâches dans la matrice Urgence / Importance.",
        tasks: [
          {
            id: "t1",
            label: "Tronçonner branche basse dangereuse école",
            correct: "urgent_important",
          },
          {
            id: "t2",
            label: "Tonte hebdo parc central",
            correct: "important_non_urgent",
          },
          {
            id: "t3",
            label: "Plantation décorative parking",
            correct: "urgent_non_important",
          },
          {
            id: "t4",
            label: "Trier sa boîte mail perso",
            correct: "inutile",
          },
          {
            id: "t5",
            label: "Désherbage square",
            correct: "important_non_urgent",
          },
        ],
      },
      {
        kind: "batching",
        id: "p_batch",
        title: "🧰 Time batching · même outillage",
        icon: "🧰",
        context: "Regroupe les tâches par outil pour éviter les A/R au dépôt.",
        groups: [
          { id: "tonte", label: "🚜 Tracteur-tondeuse" },
          { id: "taille", label: "✂️ Taille-haie / sécateur" },
          { id: "manuel", label: "🪴 Plantation / désherbage" },
        ],
        items: [
          { id: "i1", label: "Tonte parc central", correctGroup: "tonte" },
          {
            id: "i2",
            label: "Tonte parking principal",
            correctGroup: "tonte",
          },
          {
            id: "i3",
            label: "Taille haies école",
            correctGroup: "taille",
          },
          {
            id: "i4",
            label: "Taille buissons square",
            correctGroup: "taille",
          },
          {
            id: "i5",
            label: "Plantation parking",
            correctGroup: "manuel",
          },
          {
            id: "i6",
            label: "Désherbage square",
            correctGroup: "manuel",
          },
        ],
      },
      {
        kind: "choice",
        id: "p_micro",
        title: "⚡ Action immédiate",
        context:
          "Tu remarques un détritus sur le chemin (3 secondes pour le ramasser).",
        icon: "⚡",
        choices: [
          {
            id: "now",
            label: "Le ramasser tout de suite",
            timeDelta: 1,
            scoreDelta: 4,
            tags: ["action_immediate"],
            good: true,
            feedback: "Règle des 2 minutes appliquée.",
          },
          {
            id: "later",
            label: "Le laisser pour plus tard",
            timeDelta: -3,
            scoreDelta: -3,
            tags: ["action_immediate"],
            feedback:
              "Plus tard tu auras oublié, et un usager se plaindra.",
          },
        ],
      },
      {
        kind: "choice",
        id: "p_notif",
        title: "📱 Notification téléphone",
        context: "« Promo flash : -70 % sur les barbecues, aujourd'hui ! »",
        icon: "📱",
        choices: [
          {
            id: "consult",
            label: "Aller voir la promo",
            timeDelta: -4,
            scoreDelta: -4,
            tags: ["notification", "multitache"],
            feedback: "Tu sors de ton flow de travail.",
          },
          {
            id: "ignore",
            label: "Ignorer",
            timeDelta: 0,
            scoreDelta: 5,
            tags: ["notification", "concentration"],
            good: true,
            feedback: "Concentration préservée.",
          },
        ],
      },
      {
        kind: "narrative",
        id: "p_end",
        title: "🏁 Fin de journée",
        icon: "🏁",
        text: "16h. Voyons le bilan de ta journée d'entretien…",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 3. CHARGÉ DE MISSION
  // -------------------------------------------------------------------------
  {
    id: "charge_mission",
    title: "Chargé de mission",
    emoji: "📊",
    category: "administratif",
    blurb: "Préparer une réunion à 14h00 · 15 emails non lus",
    context:
      "Il est 9h00. Tu arrives au bureau. Tu dois préparer une présentation pour la réunion de 14h. 15 emails t'attendent.",
    timeBudgetMin: 300,
    steps: [
      {
        kind: "narrative",
        id: "c_intro",
        title: "9h00 – Tu arrives au bureau",
        icon: "🏢",
        text: "Boîte mail saturée, sollicitations internes, et une réunion clé à 14h. Tu as tendance à dire OUI à tout.",
      },
      {
        kind: "choice",
        id: "c_mails",
        title: "📧 15 emails non lus",
        context: "Comment tu attaques ?",
        icon: "📧",
        choices: [
          {
            id: "all",
            label: "Tout lire dans l'ordre",
            timeDelta: -25,
            scoreDelta: -6,
            tags: ["priorisation", "multitache"],
            feedback:
              "25 min absorbées et tu n'as toujours pas avancé sur la réunion.",
          },
          {
            id: "scan",
            label: "Scanner / prioriser, traiter ce qui est urgent",
            timeDelta: -8,
            scoreDelta: 7,
            tags: ["priorisation", "time_batching"],
            good: true,
            feedback: "Tu protèges ton temps de prépa.",
          },
        ],
      },
      {
        kind: "priorisation",
        id: "c_prio",
        title: "🧭 Priorise tes tâches",
        icon: "🧭",
        context:
          "Classe ces tâches du matin dans la matrice Urgence / Importance.",
        tasks: [
          {
            id: "t1",
            label: "Préparer présentation 14h",
            correct: "urgent_important",
          },
          {
            id: "t2",
            label: "Répondre mails clients",
            correct: "urgent_non_important",
          },
          {
            id: "t3",
            label: "Veille info / actualités secteur",
            correct: "important_non_urgent",
          },
          {
            id: "t4",
            label: "Discussion machine à café",
            correct: "inutile",
          },
          {
            id: "t5",
            label: "Appel collègue support technique",
            correct: "important_non_urgent",
          },
        ],
      },
      {
        kind: "choice",
        id: "c_collegue",
        title: "🗣️ Un collègue débarque",
        context: "« Tu as 5 minutes ? J'aurais besoin d'un coup de main… »",
        icon: "🗣️",
        choices: [
          {
            id: "yes",
            label: "Accepter tout de suite",
            timeDelta: -20,
            scoreDelta: -7,
            tags: ["dire_non", "interruption"],
            feedback:
              "Les « 5 min » deviennent 20 min. Ta prépa réunion est en danger.",
          },
          {
            id: "later",
            label: "Reporter à 13h30 après ma prépa",
            timeDelta: 0,
            scoreDelta: 6,
            tags: ["dire_non", "priorisation"],
            good: true,
            feedback: "Tu protèges ton créneau de concentration.",
          },
        ],
      },
      {
        kind: "choice",
        id: "c_notif",
        title: "📱 Notification d'actu",
        context: "« Breaking news : événement majeur en Europe »",
        icon: "📱",
        choices: [
          {
            id: "consult",
            label: "Aller voir",
            timeDelta: -7,
            scoreDelta: -5,
            tags: ["notification", "multitache"],
            feedback: "Concentration cassée pendant 7 minutes.",
          },
          {
            id: "ignore",
            label: "Ignorer · je verrai à la pause",
            timeDelta: 0,
            scoreDelta: 5,
            tags: ["notification", "concentration"],
            good: true,
            feedback: "Tu restes en mode focus.",
          },
        ],
      },
      {
        kind: "batching",
        id: "c_batch",
        title: "📨 Time batching · emails",
        icon: "📨",
        context: "Regroupe les emails par nature de traitement.",
        groups: [
          { id: "delete", label: "🗑️ Supprimer / Archiver" },
          { id: "quick", label: "⚡ Réponse < 2 min (faire maintenant)" },
          { id: "block", label: "📅 Bloc de réponse 11h00" },
        ],
        items: [
          { id: "i1", label: "Newsletter marketing", correctGroup: "delete" },
          { id: "i2", label: "Spam promo", correctGroup: "delete" },
          {
            id: "i3",
            label: "« Validation rapide du livrable ? »",
            correctGroup: "quick",
          },
          {
            id: "i4",
            label: "« Confirmation de présence réunion »",
            correctGroup: "quick",
          },
          {
            id: "i5",
            label: "Brief détaillé d'un partenaire",
            correctGroup: "block",
          },
          {
            id: "i6",
            label: "Demande d'analyse client important",
            correctGroup: "block",
          },
        ],
      },
      {
        kind: "choice",
        id: "c_action",
        title: "⚡ Action immédiate",
        context:
          "Une signature électronique de 30 secondes apparaît dans ta corbeille.",
        icon: "⚡",
        choices: [
          {
            id: "now",
            label: "Signer immédiatement",
            timeDelta: 1,
            scoreDelta: 5,
            tags: ["action_immediate"],
            good: true,
            feedback: "Règle des 2 minutes : appliquée.",
          },
          {
            id: "later",
            label: "Reporter à demain",
            timeDelta: -5,
            scoreDelta: -3,
            tags: ["action_immediate"],
            feedback:
              "Tu vas devoir te reconnecter au dossier demain → perte de contexte.",
          },
        ],
      },
      {
        kind: "narrative",
        id: "c_end",
        title: "🏁 13h45 – Réunion dans 15 min",
        icon: "🏁",
        text: "Le compte à rebours est lancé. Voyons si tu es prêt(e)…",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 4. ASSISTANT ADMINISTRATIF
  // -------------------------------------------------------------------------
  {
    id: "assistant_admin",
    title: "Assistant administratif",
    emoji: "🗂️",
    category: "administratif",
    blurb: "Accueil + dossiers · jongler entre public et back-office",
    context:
      "Il est 9h00. Tu gères l'accueil du service ET le traitement administratif. Téléphone, public, mails et dossiers en parallèle.",
    timeBudgetMin: 420,
    steps: [
      {
        kind: "narrative",
        id: "a_intro",
        title: "9h00 – Front + Back office",
        icon: "🏢",
        text: "Tu dois assurer l'accueil du public et traiter les dossiers urgents de la semaine. Le téléphone sonne déjà.",
      },
      {
        kind: "choice",
        id: "a_double",
        title: "🔔 Téléphone + personne au guichet",
        context:
          "Une personne se présente à l'accueil ET le téléphone sonne en même temps.",
        icon: "🔔",
        choices: [
          {
            id: "phone",
            label: "Décrocher le téléphone d'abord",
            timeDelta: -5,
            scoreDelta: -4,
            tags: ["priorisation", "multitache"],
            feedback:
              "La personne en face attend, mauvaise expérience usager.",
          },
          {
            id: "physical",
            label: "Saluer la personne, mettre le tel sur répondeur",
            timeDelta: 0,
            scoreDelta: 6,
            tags: ["priorisation"],
            good: true,
            feedback: "Tu priorises le contact direct, professionnel.",
          },
        ],
      },
      {
        kind: "priorisation",
        id: "a_prio",
        title: "🧭 Priorisation des dossiers",
        icon: "🧭",
        context:
          "Classe ces tâches dans la matrice Urgence / Importance.",
        tasks: [
          {
            id: "t1",
            label: "Dossier urgent à transmettre avant 11h",
            correct: "urgent_important",
          },
          {
            id: "t2",
            label: "Classement des archives 2023",
            correct: "important_non_urgent",
          },
          {
            id: "t3",
            label: "Réponse à un mail interne « pour info »",
            correct: "urgent_non_important",
          },
          {
            id: "t4",
            label: "Discussion sur la météo avec un collègue",
            correct: "inutile",
          },
          {
            id: "t5",
            label: "Préparer la salle de réunion 14h",
            correct: "important_non_urgent",
          },
        ],
      },
      {
        kind: "batching",
        id: "a_batch",
        title: "🗂️ Time batching · dossiers similaires",
        icon: "🗂️",
        context: "Regroupe les dossiers par typologie pour gagner en cadence.",
        groups: [
          { id: "scan", label: "🖨️ Numérisation" },
          { id: "saisie", label: "⌨️ Saisie informatique" },
          { id: "envoi", label: "✉️ Envoi / courrier" },
        ],
        items: [
          { id: "i1", label: "Scan facture A", correctGroup: "scan" },
          { id: "i2", label: "Scan facture B", correctGroup: "scan" },
          {
            id: "i3",
            label: "Saisie demande congés",
            correctGroup: "saisie",
          },
          {
            id: "i4",
            label: "Saisie note de frais",
            correctGroup: "saisie",
          },
          {
            id: "i5",
            label: "Envoi recommandé client",
            correctGroup: "envoi",
          },
          {
            id: "i6",
            label: "Envoi colis fournisseur",
            correctGroup: "envoi",
          },
        ],
      },
      {
        kind: "choice",
        id: "a_micro",
        title: "⚡ Signature rapide",
        context: "Un parapheur passe sur ton bureau (1 min de signature).",
        icon: "⚡",
        choices: [
          {
            id: "now",
            label: "Signer tout de suite",
            timeDelta: 1,
            scoreDelta: 5,
            tags: ["action_immediate"],
            good: true,
            feedback: "Action immédiate, dossier débloqué.",
          },
          {
            id: "later",
            label: "Repasser dessus demain",
            timeDelta: -8,
            scoreDelta: -4,
            tags: ["action_immediate"],
            feedback: "Dossier urgent bloqué, mauvais signal.",
          },
        ],
      },
      {
        kind: "choice",
        id: "a_notif",
        title: "📱 Notification",
        context: "« Promo exceptionnelle aujourd'hui seulement ! »",
        icon: "📱",
        choices: [
          {
            id: "consult",
            label: "Aller voir",
            timeDelta: -4,
            scoreDelta: -4,
            tags: ["notification", "multitache"],
            feedback: "Sortie de focus, retour difficile sur les dossiers.",
          },
          {
            id: "ignore",
            label: "Ignorer",
            timeDelta: 0,
            scoreDelta: 5,
            tags: ["notification", "concentration"],
            good: true,
            feedback: "Tu protèges ta cadence.",
          },
        ],
      },
      {
        kind: "choice",
        id: "a_no",
        title: "🙅 Savoir dire non",
        context:
          "Un collègue te demande de l'aider à imprimer 200 pages, là, maintenant.",
        icon: "🙅",
        choices: [
          {
            id: "yes",
            label: "Accepter pour faire plaisir",
            timeDelta: -15,
            scoreDelta: -5,
            tags: ["dire_non", "interruption"],
            feedback:
              "Tu mets ton dossier urgent en danger. 15 min perdues.",
          },
          {
            id: "later",
            label: "Proposer après mon dossier urgent",
            timeDelta: 0,
            scoreDelta: 5,
            tags: ["dire_non", "priorisation"],
            good: true,
            feedback: "Tu restes serviable sans sacrifier la priorité.",
          },
        ],
      },
      {
        kind: "narrative",
        id: "a_end",
        title: "🏁 16h – Fin de journée",
        icon: "🏁",
        text: "Bilan de ta journée d'accueil et de back-office…",
      },
    ],
  },
];

export function getScenario(id: string) {
  return SCENARIOS.find((s) => s.id === id);
}
