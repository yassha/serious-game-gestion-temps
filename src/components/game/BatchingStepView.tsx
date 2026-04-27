import { useMemo, useState } from "react";
import type { BatchingStep } from "../../types";

export function BatchingStepView({
  step,
  onResolved,
}: {
  step: BatchingStep;
  onResolved: (good: boolean, scoreDelta: number, timeDelta: number) => void;
}) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [validated, setValidated] = useState(false);

  const allAssigned = useMemo(
    () => step.items.every((i) => !!assignments[i.id]),
    [assignments, step.items]
  );

  const correctCount = useMemo(
    () =>
      step.items.filter((i) => assignments[i.id] === i.correctGroup).length,
    [assignments, step.items]
  );

  function setAssign(itemId: string) {
    if (validated) return;
    setAssignments((a) => {
      const cur = a[itemId];
      const ids = step.groups.map((g) => g.id);
      const idx = cur ? ids.indexOf(cur) : -1;
      const next = ids[(idx + 1) % ids.length];
      return { ...a, [itemId]: next };
    });
  }

  function validate() {
    setValidated(true);
  }

  function next() {
    const ratio = correctCount / step.items.length;
    const good = ratio >= 0.7;
    const scoreDelta = good ? 8 : ratio >= 0.4 ? 0 : -6;
    const timeDelta = good ? 6 : ratio >= 0.4 ? 0 : -8;
    onResolved(good, scoreDelta, timeDelta);
  }

  return (
    <div className="card animate-slideUp">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{step.icon ?? "📦"}</div>
        <div>
          <h2 className="text-lg font-bold">{step.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{step.context}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
          Items à regrouper
        </div>
        <div className="flex flex-wrap gap-2">
          {step.items.map((it) => {
            const g = assignments[it.id];
            const correct = validated ? g === it.correctGroup : null;
            const groupLabel = g
              ? step.groups.find((x) => x.id === g)?.label
              : "À ranger";
            return (
              <button
                key={it.id}
                disabled={validated}
                onClick={() => setAssign(it.id)}
                className={`text-xs sm:text-sm px-3 py-2 rounded-xl border transition ${
                  validated
                    ? correct
                      ? "border-success-500 bg-success-500/10 text-success-700"
                      : "border-danger-500 bg-danger-500/10 text-danger-700"
                    : g
                    ? "border-brand-300 bg-brand-50 text-brand-800"
                    : "bg-white border-slate-200 hover:border-brand-400"
                }`}
              >
                <div className="font-medium">{it.label}</div>
                <div className="text-[11px] opacity-70 mt-0.5">{groupLabel}</div>
              </button>
            );
          })}
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Touche un item pour le faire passer d'un groupe à l'autre.
        </div>
      </div>

      <div className="mt-5 grid sm:grid-cols-3 gap-3">
        {step.groups.map((g) => {
          const items = step.items.filter((i) => assignments[i.id] === g.id);
          return (
            <div
              key={g.id}
              className="rounded-xl border border-slate-200 p-3 bg-slate-50 min-h-[100px]"
            >
              <div className="font-semibold text-sm">{g.label}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {items.length === 0 && (
                  <span className="text-[11px] text-slate-400">Vide</span>
                )}
                {items.map((it) => (
                  <span
                    key={it.id}
                    className="px-2 py-1 bg-white rounded-md text-[11px] border border-slate-200"
                  >
                    {it.label}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {validated && (
        <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm">
          ✅ {correctCount} regroupement{correctCount > 1 ? "s" : ""} corrects
          sur {step.items.length}.
          {correctCount / step.items.length >= 0.7
            ? " Time-batching maîtrisé !"
            : " Regrouper les tâches similaires aurait évité des aller-retours coûteux."}
        </div>
      )}

      {!validated ? (
        <button
          disabled={!allAssigned}
          onClick={validate}
          className="btn-primary w-full mt-5"
        >
          Valider le regroupement
        </button>
      ) : (
        <button onClick={next} className="btn-primary w-full mt-5">
          Continuer →
        </button>
      )}
    </div>
  );
}
