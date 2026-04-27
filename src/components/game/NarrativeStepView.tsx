import type { NarrativeStep } from "../../types";

export function NarrativeStepView({
  step,
  onNext,
}: {
  step: NarrativeStep;
  onNext: () => void;
}) {
  return (
    <div className="card animate-slideUp">
      <div className="text-4xl mb-3">{step.icon ?? "📖"}</div>
      <h2 className="text-xl font-bold">{step.title}</h2>
      <p className="mt-3 text-slate-700 leading-relaxed">{step.text}</p>
      <button onClick={onNext} className="btn-primary w-full mt-6">
        Continuer →
      </button>
    </div>
  );
}
