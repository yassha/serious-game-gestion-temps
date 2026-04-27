import type {
  ChoiceLog,
  FinalProfile,
  Result,
  Scenario,
} from "../types";

/**
 * Convert raw choice log + scenario into a Result with score, profile,
 * badges and personalised advice. Score range = 0..100.
 */
export function computeResult(scenario: Scenario, log: ChoiceLog[]): Result {
  // 1. Possible "good" choice steps (used to scale the score)
  const goodChoiceSteps = scenario.steps.filter(
    (s) => s.kind === "choice"
  ).length;
  const prioSteps = scenario.steps.filter(
    (s) => s.kind === "priorisation"
  ).length;
  const batchingSteps = scenario.steps.filter(
    (s) => s.kind === "batching"
  ).length;

  // 2. Aggregate metrics from log
  let scoreSum = 0;
  let timeUsed = 0;
  let goodChoices = 0;
  let badChoices = 0;
  let distractions = 0;
  let prioCount = 0;
  let prioGood = 0;
  let batchCount = 0;
  let batchGood = 0;

  for (const entry of log) {
    scoreSum += entry.scoreDelta;
    timeUsed += -Math.min(entry.timeDelta, 0); // only lost time

    if (entry.tags.includes("priorisation")) {
      prioCount += 1;
      if (entry.good) prioGood += 1;
    }

    if (entry.tags.includes("time_batching")) {
      batchCount += 1;
      if (entry.good) batchGood += 1;
    }

    if (entry.choiceId) {
      if (entry.good) goodChoices += 1;
      else if (entry.good === false) badChoices += 1;
    }

    if (
      (entry.tags.includes("notification") ||
        entry.tags.includes("interruption") ||
        entry.tags.includes("multitache")) &&
      entry.good === false
    ) {
      distractions += 1;
    }
  }

  // 3. Normalise to a 0..100 score
  // Maximum theoretical positive = ~ 6 per step. Use a soft mapping.
  const maxPositive =
    goodChoiceSteps * 6 + prioSteps * 10 + batchingSteps * 10;
  const minNegative =
    -(goodChoiceSteps * 6 + prioSteps * 10 + batchingSteps * 10);
  const normalised =
    ((scoreSum - minNegative) / (maxPositive - minNegative)) * 100;

  // Make 100 hard to reach: cap at 96 unless absolutely flawless.
  let score = Math.round(Math.max(0, Math.min(100, normalised)));
  if (score >= 97 && (badChoices > 0 || distractions > 0)) score = 92;

  // 4. Derived rates
  const totalChoices = goodChoices + badChoices || 1;
  const distractionRate = Math.min(1, distractions / Math.max(1, totalChoices));
  const prioritizationRate =
    prioCount > 0 ? prioGood / prioCount : 0.5;
  const globalEfficiency = score / 100;

  // 5. Profile
  const profile: FinalProfile = computeProfile({
    score,
    distractionRate,
    badChoices,
    prioritizationRate,
  });

  // 6. Badges
  const badges: string[] = [];
  if (prioCount > 0 && prioGood / prioCount >= 0.8)
    badges.push("🥇 Expert en priorisation");
  if (distractions === 0) badges.push("🛡️ Anti-distraction");
  if (
    batchCount > 0 &&
    log.some(
      (e) => e.tags.includes("action_immediate") && e.good
    )
  )
    badges.push("⚡ Action immédiate");
  if (
    batchCount > 0 &&
    batchGood / batchCount >= 0.8
  )
    badges.push("📦 Maître du batching");
  if (
    goodChoices >= goodChoiceSteps - 1 &&
    badChoices === 0
  )
    badges.push("🧠 Stratège du temps");

  // 7. Advice (personnalisé)
  const advice: string[] = [];
  if (distractions >= 2)
    advice.push(
      "Tu réponds trop aux interruptions et notifications. Active le mode focus / silencieux pendant tes blocs de travail."
    );
  if (badChoices >= 2)
    advice.push(
      "Tu acceptes trop souvent les sollicitations parasites. Entraîne-toi à dire « non, mais plus tard à 11h » plutôt qu'un oui réflexe."
    );
  if (prioCount > 0 && prioGood / prioCount < 0.7)
    advice.push(
      "Travaille la matrice Urgent / Important : commence chaque matin par identifier la tâche la plus à fort enjeu."
    );
  if (batchCount > 0 && batchGood / batchCount < 0.7)
    advice.push(
      "Le time-batching te fera gagner beaucoup : regroupe les tâches de même nature ou même outillage."
    );
  if (timeUsed > scenario.timeBudgetMin * 0.25)
    advice.push(
      "Tu as accumulé beaucoup de temps « volé ». Bloque dans ton agenda 2 créneaux de concentration profonde par jour."
    );
  if (advice.length === 0)
    advice.push(
      "Excellente gestion globale ! Continue à protéger tes blocs de concentration et à pratiquer la règle des 2 minutes."
    );

  return {
    score,
    profile,
    timeUsedMin: Math.round(timeUsed),
    distractionRate,
    prioritizationRate,
    globalEfficiency,
    badges,
    advice,
  };
}

function computeProfile(input: {
  score: number;
  distractionRate: number;
  badChoices: number;
  prioritizationRate: number;
}): FinalProfile {
  const { score, distractionRate, prioritizationRate } = input;
  if (score >= 70 && prioritizationRate >= 0.6 && distractionRate <= 0.3)
    return "stratege_organise";
  if (distractionRate >= 0.5) return "multitache_disperse";
  return "reactif_deborde";
}

export const PROFILE_LABELS: Record<
  FinalProfile,
  { emoji: string; title: string; tagline: string }
> = {
  stratege_organise: {
    emoji: "🎯",
    title: "Stratège organisé",
    tagline: "Bonne priorisation, bonne gestion des distractions.",
  },
  reactif_deborde: {
    emoji: "🌀",
    title: "Réactif débordé",
    tagline: "Trop d'interruptions et manque de planification.",
  },
  multitache_disperse: {
    emoji: "🎲",
    title: "Multitâche dispersé",
    tagline: "Concentration trop souvent cassée par les sollicitations.",
  },
};

export const SCORE_BRACKETS: { min: number; max: number; label: string }[] = [
  { min: 0, max: 25, label: "Zone d'éveil" },
  { min: 25, max: 50, label: "En progression" },
  { min: 50, max: 75, label: "Bien engagé" },
  { min: 75, max: 100, label: "Performance solide" },
];
