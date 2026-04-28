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
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
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

  function pickTask(taskId: string) {
    if (validated) return;
    setSelectedTaskId((cur) => (cur === taskId ? null : taskId));
  }

  function dropOnQuadrant(q: PriorisationQuadrant) {
    if (validated || !selectedTaskId) return;
    setAssignments((a) => ({ ...a, [selectedTaskId]: q }));
    setSelectedTaskId(null);
  }

  function unassign(taskId: string) {
    if (validated) return;
    setAssignments((a) => {
      const next = { ...a };
      delete next[taskId];
      return next;
    });
  }

  function validate() {
    setValidated(true);
    setSelectedTaskId(null);
  }

  function next() {
    const ratio = correctCount / step.tasks.length;
    const good = ratio >= 0.7;
    const scoreDelta = good ? 8 : ratio >= 0.4 ? 0 : -6;
    const timeDelta = good ? 5 : ratio >= 0.4 ? 0 : -8;
    onResolved(good, scoreDelta, timeDelta);
  }

  const pendingTasks = step.tasks.filter((t) => !assignments[t.id]);

  return (
    <div className="card animate-slideUp">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{step.icon ?? "🧭"}</div>
        <div>
          <h2 className="text-lg font-bold">{step.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{step.context}</p>
        </div>
      </div>

      {/* Help banner */}
      {!validated && (
        <div
          className={`mt-4 rounded-xl border p-3 text-sm transition ${
            selectedTaskId
              ? "border-brand-500 bg-brand-50 text-brand-800 animate-pulseSoft"
              : "border-slate-200 bg-slate-50 text-slate-600"
          }`}
        >
          {selectedTaskId ? (
            <span>
              <span className="font-semibold">2/2 ·</span> Choisis maintenant la{" "}
              <strong>case</strong> où tu veux placer cette tâche ↓
            </span>
          ) : (
            <span>
              <span className="font-semibold">1/2 ·</span> Sélectionne d'abord
              une <strong>tâche</strong> dans la liste ci-dessous, puis touche
              la case voulue.
            </span>
          )}
        </div>
      )}

      {/* Pending pool */}
      <div className="mt-4">
        <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
          {pendingTasks.length > 0
            ? `Tâches à classer (${pendingTasks.length})`
            : "Toutes les tâches sont classées ✅"}
        </div>
        <div className="flex flex-wrap gap-2">
          {pendingTasks.map((t) => {
            const isSelected = selectedTaskId === t.id;
            return (
              <button
                key={t.id}
                disabled={validated}
                onClick={() => pickTask(t.id)}
                className={`text-xs sm:text-sm px-3 py-2 rounded-full border transition ${
                  isSelected
                    ? "border-brand-500 bg-brand-500 text-white ring-4 ring-brand-500/20 scale-105"
                    : "bg-white border-slate-300 hover:border-brand-400 hover:bg-brand-50"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Eisenhower 2x2 grid */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {QUADRANTS.map((q) => {
          const meta = QUADRANT_META[q];
          const items = step.tasks.filter((t) => assignments[t.id] === q);
          const isDropTarget = !!selectedTaskId && !validated;
          return (
            <button
              type="button"
              key={q}
              disabled={validated || !selectedTaskId}
              onClick={() => dropOnQuadrant(q)}
              className={`text-left rounded-xl border p-3 min-h-[130px] transition ${meta.color} ${
                isDropTarget
                  ? "ring-2 ring-brand-500/40 hover:ring-4 hover:scale-[1.02] cursor-pointer"
                  : "cursor-default"
              }`}
            >
              <div className="font-semibold text-xs sm:text-sm flex items-center gap-1">
                <span>{meta.emoji}</span>
                <span>{meta.label}</span>
              </div>
              <div className="text-[11px] opacity-80 mb-2">{meta.help}</div>
              <div className="flex flex-wrap gap-1.5">
                {items.length === 0 && (
                  <span className="text-[11px] opacity-50">
                    {isDropTarget ? "Touche pour déposer ici" : "Vide"}
                  </span>
                )}
                {items.map((t) => {
                  const correct = validated ? assignments[t.id] === t.correct : null;
                  return (
                    <span
                      key={t.id}
                      role={!validated ? "button" : undefined}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!validated) unassign(t.id);
                      }}
                      className={`px-2 py-1 rounded-md text-[11px] border transition ${
                        validated
                          ? correct
                            ? "bg-white border-success-500 text-success-700"
                            : "bg-white border-danger-500 text-danger-700"
                          : "bg-white/80 border-current/20 hover:bg-white hover:border-danger-400 cursor-pointer"
                      }`}
                      title={!validated ? "Cliquer pour retirer" : undefined}
                    >
                      {t.label}
                      {!validated && (
                        <span className="ml-1 opacity-60">×</span>
                      )}
                    </span>
                  );
                })}
              </div>
            </button>
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
