import { useEffect, useState } from "react";
import { useGame } from "../store";
import { getScenario } from "../data/scenarios";
import { Layout } from "./Layout";
import { NarrativeStepView } from "./game/NarrativeStepView";
import { ChoiceStepView } from "./game/ChoiceStepView";
import { PriorisationStepView } from "./game/PriorisationStepView";
import { BatchingStepView } from "./game/BatchingStepView";
import type { ChoiceLog } from "../types";

export function GameScreen() {
  const jobId = useGame((s) => s.jobId);
  const stepIndex = useGame((s) => s.stepIndex);
  const startedAt = useGame((s) => s.startedAt);
  const log = useGame((s) => s.log);
  const pushLog = useGame((s) => s.pushLog);
  const nextStep = useGame((s) => s.nextStep);
  const goTo = useGame((s) => s.goTo);

  const scenario = jobId ? getScenario(jobId) : null;
  const step = scenario?.steps[stepIndex];

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!scenario || !step || !startedAt) {
    return (
      <Layout title="Chargement…">
        <div className="card">Aucune session active.</div>
      </Layout>
    );
  }

  const elapsedSec = Math.floor((now - startedAt) / 1000);
  const minLost = log.reduce(
    (a, b) => a + (b.timeDelta < 0 ? -b.timeDelta : 0),
    0
  );
  const minSaved = log.reduce(
    (a, b) => a + (b.timeDelta > 0 ? b.timeDelta : 0),
    0
  );
  const scoreSoFar = log.reduce((a, b) => a + b.scoreDelta, 0);

  function commitLog(entry: Omit<ChoiceLog, "stepTitle"> & { stepTitle?: string }) {
    pushLog({
      ...entry,
      stepTitle: entry.stepTitle ?? step!.title,
    } as ChoiceLog);
    setTimeout(() => nextStep(), 50);
  }

  return (
    <Layout
      title={`${scenario.emoji} ${scenario.title}`}
      onBack={() => {
        if (confirm("Quitter la simulation ? Ta progression sera perdue.")) {
          goTo("home");
        }
      }}
      step={{
        current: stepIndex + 1,
        total: scenario.steps.length,
        label: "Étape",
      }}
      right={
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="chip bg-brand-100 text-brand-800">
            ⏱ {fmtTime(elapsedSec)}
          </span>
          <span className="chip bg-success-500/10 text-success-600">
            +{minSaved} min
          </span>
          <span className="chip bg-danger-500/10 text-danger-600">
            −{minLost} min
          </span>
        </div>
      }
    >
      <div className="sm:hidden mb-3 flex flex-wrap gap-2 text-[11px]">
        <span className="chip bg-brand-100 text-brand-800">
          ⏱ {fmtTime(elapsedSec)}
        </span>
        <span className="chip bg-success-500/10 text-success-600">
          +{minSaved} min · 🏅 {scoreSoFar >= 0 ? "+" : ""}
          {scoreSoFar}
        </span>
        <span className="chip bg-danger-500/10 text-danger-600">
          −{minLost} min
        </span>
      </div>

      {step.kind === "narrative" && (
        <NarrativeStepView step={step} onNext={nextStep} />
      )}

      {step.kind === "choice" && (
        <ChoiceStepView
          key={step.id}
          step={step}
          onResolved={(c) => {
            commitLog({
              stepId: step.id,
              choiceId: c.id,
              choiceLabel: c.label,
              timeDelta: c.timeDelta,
              scoreDelta: c.scoreDelta,
              tags: c.tags,
              good: !!c.good,
            });
          }}
        />
      )}

      {step.kind === "priorisation" && (
        <PriorisationStepView
          key={step.id}
          step={step}
          onResolved={(good, scoreDelta, timeDelta) =>
            commitLog({
              stepId: step.id,
              choiceLabel: good ? "Priorisation correcte" : "Priorisation imparfaite",
              timeDelta,
              scoreDelta,
              tags: ["priorisation"],
              good,
            })
          }
        />
      )}

      {step.kind === "batching" && (
        <BatchingStepView
          key={step.id}
          step={step}
          onResolved={(good, scoreDelta, timeDelta) =>
            commitLog({
              stepId: step.id,
              choiceLabel: good ? "Time-batching réussi" : "Regroupement perfectible",
              timeDelta,
              scoreDelta,
              tags: ["time_batching"],
              good,
            })
          }
        />
      )}
    </Layout>
  );
}

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
