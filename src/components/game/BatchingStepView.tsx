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
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
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

  function pickItem(itemId: string) {
    if (validated) return;
    setSelectedItemId((cur) => (cur === itemId ? null : itemId));
  }

  function dropOnGroup(groupId: string) {
    if (validated || !selectedItemId) return;
    setAssignments((a) => ({ ...a, [selectedItemId]: groupId }));
    setSelectedItemId(null);
  }

  function unassign(itemId: string) {
    if (validated) return;
    setAssignments((a) => {
      const next = { ...a };
      delete next[itemId];
      return next;
    });
  }

  function validate() {
    setValidated(true);
    setSelectedItemId(null);
  }

  function next() {
    const ratio = correctCount / step.items.length;
    const good = ratio >= 0.7;
    const scoreDelta = good ? 8 : ratio >= 0.4 ? 0 : -6;
    const timeDelta = good ? 6 : ratio >= 0.4 ? 0 : -8;
    onResolved(good, scoreDelta, timeDelta);
  }

  const pendingItems = step.items.filter((i) => !assignments[i.id]);

  return (
    <div className="card animate-slideUp">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{step.icon ?? "📦"}</div>
        <div>
          <h2 className="text-lg font-bold">{step.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{step.context}</p>
        </div>
      </div>

      {/* Help banner */}
      {!validated && (
        <div
          className={`mt-4 rounded-xl border p-3 text-sm transition ${
            selectedItemId
              ? "border-brand-500 bg-brand-50 text-brand-800 animate-pulseSoft"
              : "border-slate-200 bg-slate-50 text-slate-600"
          }`}
        >
          {selectedItemId ? (
            <span>
              <span className="font-semibold">2/2 ·</span> Choisis maintenant le{" "}
              <strong>groupe</strong> dans lequel placer cet item ↓
            </span>
          ) : (
            <span>
              <span className="font-semibold">1/2 ·</span> Sélectionne d'abord
              un <strong>item</strong> dans la liste ci-dessous, puis touche le
              groupe voulu.
            </span>
          )}
        </div>
      )}

      {/* Pending pool */}
      <div className="mt-4">
        <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
          {pendingItems.length > 0
            ? `Items à regrouper (${pendingItems.length})`
            : "Tous les items sont classés ✅"}
        </div>
        <div className="flex flex-wrap gap-2">
          {pendingItems.map((it) => {
            const isSelected = selectedItemId === it.id;
            return (
              <button
                key={it.id}
                disabled={validated}
                onClick={() => pickItem(it.id)}
                className={`text-xs sm:text-sm px-3 py-2 rounded-full border transition ${
                  isSelected
                    ? "border-brand-500 bg-brand-500 text-white ring-4 ring-brand-500/20 scale-105"
                    : "bg-white border-slate-300 hover:border-brand-400 hover:bg-brand-50"
                }`}
              >
                {it.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Group buckets */}
      <div className="mt-5 grid sm:grid-cols-3 gap-3">
        {step.groups.map((g) => {
          const items = step.items.filter((i) => assignments[i.id] === g.id);
          const isDropTarget = !!selectedItemId && !validated;
          return (
            <button
              type="button"
              key={g.id}
              disabled={validated || !selectedItemId}
              onClick={() => dropOnGroup(g.id)}
              className={`text-left rounded-xl border p-3 min-h-[120px] bg-slate-50 transition ${
                isDropTarget
                  ? "border-brand-300 ring-2 ring-brand-500/40 hover:ring-4 hover:scale-[1.02] cursor-pointer"
                  : "border-slate-200 cursor-default"
              }`}
            >
              <div className="font-semibold text-sm">{g.label}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {items.length === 0 && (
                  <span className="text-[11px] text-slate-400">
                    {isDropTarget ? "Touche pour déposer ici" : "Vide"}
                  </span>
                )}
                {items.map((it) => {
                  const correct = validated
                    ? assignments[it.id] === it.correctGroup
                    : null;
                  return (
                    <span
                      key={it.id}
                      role={!validated ? "button" : undefined}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!validated) unassign(it.id);
                      }}
                      className={`px-2 py-1 rounded-md text-[11px] border transition ${
                        validated
                          ? correct
                            ? "bg-white border-success-500 text-success-700"
                            : "bg-white border-danger-500 text-danger-700"
                          : "bg-white border-slate-200 hover:border-danger-400 cursor-pointer"
                      }`}
                      title={!validated ? "Cliquer pour retirer" : undefined}
                    >
                      {it.label}
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
