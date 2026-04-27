import { useGame } from "../store";
import { getScenario } from "../data/scenarios";
import { Layout } from "./Layout";
import { PROFILE_LABELS, SCORE_BRACKETS } from "../game/scoring";

export function ResultScreen() {
  const result = useGame((s) => s.result);
  const profile = useGame((s) => s.profile);
  const jobId = useGame((s) => s.jobId);
  const log = useGame((s) => s.log);
  const resetGame = useGame((s) => s.resetGame);
  const goTo = useGame((s) => s.goTo);

  if (!result || !profile || !jobId) {
    return (
      <Layout title="Résultats">
        <div className="card">Aucun résultat disponible.</div>
      </Layout>
    );
  }

  const scenario = getScenario(jobId);
  const meta = PROFILE_LABELS[result.profile];
  const bracket = SCORE_BRACKETS.find(
    (b) => result.score >= b.min && result.score < (b.max === 100 ? 101 : b.max)
  );

  return (
    <Layout
      title="Débrief de la simulation"
      step={{ current: 4, total: 4, label: "Débrief" }}
    >
      <div className="card animate-pop relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-brand-100 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{profile.avatar}</div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500">
                {profile.name} · {scenario?.title}
              </div>
              <h2 className="text-xl font-extrabold">
                {meta.emoji} Profil : {meta.title}
              </h2>
              <p className="text-sm text-slate-600">{meta.tagline}</p>
            </div>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <div>
              <div className="text-5xl sm:text-6xl font-black text-brand-700 leading-none">
                {result.score}
                <span className="text-2xl text-slate-400">/100</span>
              </div>
              <div className="text-sm font-medium text-slate-500 mt-1">
                {bracket?.label}
              </div>
            </div>
            <ScoreBar value={result.score} />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <KPI label="Temps perdu" value={`${result.timeUsedMin} min`} tone="danger" />
            <KPI
              label="Distraction"
              value={`${Math.round(result.distractionRate * 100)} %`}
              tone="warn"
            />
            <KPI
              label="Priorisation"
              value={`${Math.round(result.prioritizationRate * 100)} %`}
              tone="success"
            />
          </div>
        </div>
      </div>

      {result.badges.length > 0 && (
        <div className="card mt-4 animate-slideUp">
          <div className="text-sm font-semibold mb-2">🏅 Badges débloqués</div>
          <div className="flex flex-wrap gap-2">
            {result.badges.map((b) => (
              <span
                key={b}
                className="chip bg-amber-100 text-amber-800 ring-1 ring-amber-300"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card mt-4 animate-slideUp">
        <div className="text-sm font-semibold mb-2">💡 Conseils personnalisés</div>
        <ul className="space-y-2">
          {result.advice.map((a, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm text-slate-700 bg-slate-50 rounded-lg p-3 border border-slate-200"
            >
              <span>→</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card mt-4 animate-slideUp">
        <div className="text-sm font-semibold mb-3">🪞 Tes choix, étape par étape</div>
        <div className="space-y-2">
          {log.map((entry, i) => (
            <div
              key={i}
              className={`rounded-lg border p-3 text-sm ${
                entry.good
                  ? "border-success-500/30 bg-success-500/5"
                  : entry.good === false
                  ? "border-danger-500/30 bg-danger-500/5"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="font-medium">
                {entry.good ? "✅" : entry.good === false ? "⚠️" : "•"}{" "}
                {entry.stepTitle}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {entry.choiceLabel}
              </div>
              <div className="mt-1 flex gap-2 text-[11px]">
                <span
                  className={`chip ${
                    entry.timeDelta >= 0
                      ? "bg-success-500/10 text-success-600"
                      : "bg-danger-500/10 text-danger-600"
                  }`}
                >
                  ⏱ {entry.timeDelta >= 0 ? "+" : ""}
                  {entry.timeDelta} min
                </span>
                <span
                  className={`chip ${
                    entry.scoreDelta >= 0
                      ? "bg-success-500/10 text-success-600"
                      : "bg-danger-500/10 text-danger-600"
                  }`}
                >
                  🏅 {entry.scoreDelta >= 0 ? "+" : ""}
                  {entry.scoreDelta} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <button onClick={() => resetGame()} className="btn-primary flex-1">
          🔁 Recommencer (autre métier)
        </button>
        <button onClick={() => goTo("trainer")} className="btn-ghost flex-1">
          👩‍🏫 Voir l'espace formateur
        </button>
      </div>
    </Layout>
  );
}

function KPI({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warn" | "danger";
}) {
  const cls =
    tone === "success"
      ? "bg-success-500/10 text-success-600"
      : tone === "warn"
      ? "bg-amber-100 text-amber-700"
      : "bg-danger-500/10 text-danger-600";
  return (
    <div className={`rounded-xl p-3 ${cls}`}>
      <div className="text-[11px] uppercase tracking-wide font-semibold opacity-80">
        {label}
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-rose-400 via-amber-400 to-success-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
