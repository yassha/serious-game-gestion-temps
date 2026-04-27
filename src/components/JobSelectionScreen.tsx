import { useGame } from "../store";
import { SCENARIOS } from "../data/scenarios";
import { Layout } from "./Layout";

export function JobSelectionScreen() {
  const profile = useGame((s) => s.profile);
  const setJob = useGame((s) => s.setJob);
  const goTo = useGame((s) => s.goTo);
  const jobId = useGame((s) => s.jobId);

  const techniques = SCENARIOS.filter((s) => s.category === "technique");
  const admin = SCENARIOS.filter((s) => s.category === "administratif");

  return (
    <Layout
      title="Choix du métier"
      onBack={() => goTo("profile")}
      step={{ current: 2, total: 4, label: "Métier" }}
    >
      <div className="animate-slideUp">
        <div className="card flex items-center gap-4">
          <div className="text-4xl" aria-hidden>
            {profile?.avatar ?? "🧑"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-slate-500">Bienvenue</div>
            <div className="font-semibold truncate">
              {profile?.name ?? "Stagiaire"}
            </div>
          </div>
        </div>

        <h2 className="mt-6 text-lg font-bold">Choisis ton rôle</h2>
        <p className="text-sm text-slate-500">
          Chaque métier a son environnement, ses missions et ses contraintes.
        </p>

        <Section title="🛠️ Métiers techniques" jobs={techniques} active={jobId} onPick={setJob} />
        <Section title="📚 Métiers administratifs" jobs={admin} active={jobId} onPick={setJob} />

        <button
          disabled={!jobId}
          onClick={() => goTo("intro")}
          className="btn-primary w-full mt-6"
        >
          Continuer →
        </button>
      </div>
    </Layout>
  );
}

function Section({
  title,
  jobs,
  active,
  onPick,
}: {
  title: string;
  jobs: typeof SCENARIOS;
  active: string | null;
  onPick: (id: typeof SCENARIOS[number]["id"]) => void;
}) {
  return (
    <>
      <h3 className="mt-5 mb-2 text-sm font-semibold text-slate-700">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {jobs.map((j) => (
          <button
            key={j.id}
            onClick={() => onPick(j.id)}
            className={`text-left rounded-2xl border p-4 transition relative overflow-hidden ${
              active === j.id
                ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="text-3xl">{j.emoji}</div>
            <div className="mt-2 font-semibold">{j.title}</div>
            <div className="text-xs text-slate-500 mt-0.5">{j.blurb}</div>
          </button>
        ))}
      </div>
    </>
  );
}
