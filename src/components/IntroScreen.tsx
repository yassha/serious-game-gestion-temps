import { useGame } from "../store";
import { getScenario } from "../data/scenarios";
import { Layout } from "./Layout";

export function IntroScreen() {
  const jobId = useGame((s) => s.jobId);
  const startGame = useGame((s) => s.startGame);
  const goTo = useGame((s) => s.goTo);
  const profile = useGame((s) => s.profile);

  const scenario = jobId ? getScenario(jobId) : null;
  if (!scenario) {
    return (
      <Layout title="Erreur">
        <div className="card">
          <p>Aucun métier sélectionné.</p>
          <button onClick={() => goTo("job")} className="btn-primary mt-3">
            Choisir un métier
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Mission"
      onBack={() => goTo("job")}
      step={{ current: 3, total: 4, label: "Briefing" }}
    >
      <div className="card animate-slideUp">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{scenario.emoji}</div>
          <div>
            <div className="text-xs uppercase tracking-wider text-brand-700 font-semibold">
              Mission
            </div>
            <div className="text-xl font-bold">{scenario.title}</div>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm leading-relaxed">
          {scenario.context}
        </div>

        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex gap-2">
            <span>🎯</span>Termine la mission principale
          </li>
          <li className="flex gap-2">
            <span>⏱</span>Gère ton temps efficacement
          </li>
          <li className="flex gap-2">
            <span>🚫</span>Minimise les pertes de temps
          </li>
          <li className="flex gap-2">
            <span>🧠</span>Mesure l'impact de tes choix
          </li>
        </ul>

        <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 p-3 text-xs">
          ℹ️ Au cours du jeu, des interruptions, notifications et urgences vont
          apparaître. À toi de jouer, {profile?.name ?? "stagiaire"} !
        </div>

        <button onClick={startGame} className="btn-primary w-full mt-6">
          ▶︎ Démarrer la simulation
        </button>
      </div>
    </Layout>
  );
}
