import { useMemo, useState } from "react";
import type {
  PriorisationQuadrant,
  PriorisationStep,
} from "../../types";

const QUADRANT_META: Record<
  PriorisationQuadrant,
  { label: string; color: string; emoji: string; help: string }
> = {
  urgent_important: {
    label: "Urgent & Important",
    color: "bg-rose-50 border-rose-300 text-rose-800",
    emoji: "🔥",
    help: "À faire maintenant",
  },
  important_non_urgent: {
    label: "Important · Non urgent",
    color: "bg-emerald-50 border-emerald-300 text-emerald-800",
    emoji: "📅",
    help: "À planifier",
  },
  urgent_non_important: {
    label: "Urgent · Non important",
    color: "bg-amber-50 border-amber-300 text-amber-800",
    emoji: "🤝",
    help: "À déléguer",
  },
  inutile: {
    label: "Inutile",
    color: "bg-slate-100 border-slate-300 text-slate-700",
    emoji: "🗑️",
    help: "À éliminer",
  },
};

const QUADRANTS: PriorisationQuadrant[] = [
  "urgent_important",
  "important_non_urgent",
  "urgent_non_important",
  "inutile",
];

export function PriorisationStepView({
  step,
  onResolved,
}: {
  step: PriorisationStep;
  onResolved: (good: boolean, scoreDelta: number, timeDelta: number) => void;
}) {
  const [assignments, setAssignments] = useState<
    Record<string, PriorisationQuadrant | undefined>
  >({});
  const [validated, setValidated] = useState(false);

  const allAssigned = useMemo(
    () => step.tasks.every((t) => !!assignments[t.id]),
    [assignments, step.tasks]
  );

  const correctCount = useMemo(
    () =>
      step.tasks.filter((t) => assignments[t.id] === t.correct).length,
    [assignments, step.tasks]
  );

  function setAssignment(taskId: string, q: PriorisationQuadrant) {
    if (validated) return;
    setAssignments((a) => ({ ...a, [taskId]: q }));
  }

  function validate() {
    setValidated(true);
  }

  function next() {
    const ratio = correctCount / step.tasks.length;
    const good = ratio >= 0.7;
    const scoreDelta = good ? 8 : ratio >= 0.4 ? 0 : -6;
    const timeDelta = good ? 5 : ratio >= 0.4 ? 0 : -8;
    onResolved(good, scoreDelta, timeDelta);
  }

  return (
    <div className="card animate-slideUp">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{step.icon ?? "🧭"}</div>
        <div>
          <h2 className="text-lg font-bold">{step.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{step.context}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
          Tâches à classer
        </div>
        <div className="flex flex-wrap gap-2">
          {step.tasks.map((t) => {
            const q = assignments[t.id];
            const correct = validated ? q === t.correct : null;
            return (
              <button
                key={t.id}
                disabled={validated}
                onClick={() => {
                  if (validated) return;
                  // cycle through quadrants on tap (mobile-friendly)
                  const next = nextQuadrant(q);
                  setAssignment(t.id, next);
                }}
                className={`text-xs sm:text-sm px-3 py-2 rounded-full border transition ${
                  validated
                    ? correct
                      ? "border-success-500 bg-success-500/10 text-success-700"
                      : "border-danger-500 bg-danger-500/10 text-danger-700"
                    : q
                    ? `${QUADRANT_META[q].color} border`
                    : "bg-white border-slate-200 hover:border-brand-400"
                }`}
              >
                {q ? QUADRANT_META[q].emoji + " " : ""}
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Touche une tâche pour la déplacer entre les 4 quadrants ↓
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {QUADRANTS.map((q) => {
          const meta = QUADRANT_META[q];
          const items = step.tasks.filter((t) => assignments[t.id] === q);
          return (
            <div
              key={q}
              className={`rounded-xl border p-3 min-h-[120px] ${meta.color}`}
            >
              <div className="font-semibold text-xs sm:text-sm flex items-center gap-1">
                <span>{meta.emoji}</span>
                <span>{meta.label}</span>
              </div>
              <div className="text-[11px] opacity-80 mb-2">{meta.help}</div>
              <div className="flex flex-wrap gap-1.5">
                {items.length === 0 && (
                  <span className="text-[11px] opacity-50">Vide</span>
                )}
                {items.map((t) => (
                  <span
                    key={t.id}
                    className="px-2 py-1 bg-white/70 rounded-md text-[11px] border border-current/20"
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {validated && (
        <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm">
          ✅ {correctCount} bonne{correctCount > 1 ? "s" : ""} sur{" "}
          {step.tasks.length}.
          {correctCount / step.tasks.length >= 0.7
            ? " Excellente priorisation, tu progresses sereinement."
            : " Une mauvaise priorisation entraîne surcharge et perte de temps."}
        </div>
      )}

      {!validated ? (
        <button
          disabled={!allAssigned}
          onClick={validate}
          className="btn-primary w-full mt-5"
        >
          Valider la priorisation
        </button>
      ) : (
        <button onClick={next} className="btn-primary w-full mt-5">
          Continuer →
        </button>
      )}
    </div>
  );
}

function nextQuadrant(
  current?: PriorisationQuadrant
): PriorisationQuadrant {
  const order: PriorisationQuadrant[] = [
    "urgent_important",
    "important_non_urgent",
    "urgent_non_important",
    "inutile",
  ];
  if (!current) return order[0];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
}
