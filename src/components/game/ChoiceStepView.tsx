import { useState } from "react";
import type { Choice, ChoiceStep } from "../../types";

export function ChoiceStepView({
  step,
  onResolved,
}: {
  step: ChoiceStep;
  onResolved: (chosen: Choice) => void;
}) {
  const [picked, setPicked] = useState<Choice | null>(null);

  return (
    <div className="card animate-slideUp">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{step.icon ?? "🎯"}</div>
        <div>
          <h2 className="text-lg font-bold">{step.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{step.context}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {step.choices.map((c) => {
          const isPicked = picked?.id === c.id;
          const showFeedback = !!picked && isPicked;
          return (
            <button
              key={c.id}
              disabled={!!picked && !isPicked}
              onClick={() => !picked && setPicked(c)}
              className={`w-full text-left rounded-xl border p-4 transition ${
                isPicked
                  ? c.good
                    ? "border-success-500 bg-success-500/5 ring-2 ring-success-500/30"
                    : "border-danger-500 bg-danger-500/5 ring-2 ring-danger-500/30"
                  : picked
                  ? "border-slate-200 opacity-60"
                  : "border-slate-200 hover:border-brand-400 hover:bg-brand-50"
              }`}
            >
              <div className="font-medium">{c.label}</div>
              {showFeedback && (
                <div className="mt-2 text-sm">
                  <div
                    className={`font-semibold ${
                      c.good ? "text-success-600" : "text-danger-600"
                    }`}
                  >
                    {c.good ? "✅ Bonne stratégie" : "⚠️ Piège évitable"}
                  </div>
                  <p className="mt-1 text-slate-700">{c.feedback}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span
                      className={`chip ${
                        c.timeDelta >= 0
                          ? "bg-success-500/10 text-success-600"
                          : "bg-danger-500/10 text-danger-600"
                      }`}
                    >
                      ⏱ {c.timeDelta >= 0 ? "+" : ""}
                      {c.timeDelta} min
                    </span>
                    <span
                      className={`chip ${
                        c.scoreDelta >= 0
                          ? "bg-success-500/10 text-success-600"
                          : "bg-danger-500/10 text-danger-600"
                      }`}
                    >
                      🏅 {c.scoreDelta >= 0 ? "+" : ""}
                      {c.scoreDelta} pts
                    </span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {picked && (
        <button
          onClick={() => onResolved(picked)}
          className="btn-primary w-full mt-5"
        >
          Continuer →
        </button>
      )}
    </div>
  );
}
