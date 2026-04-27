import { useGame } from "../store";
import { Layout } from "./Layout";

export function HomeScreen() {
  const goTo = useGame((s) => s.goTo);
  const sessions = useGame((s) => s.sessions);

  return (
    <Layout
      right={
        <button
          onClick={() => goTo("trainer")}
          className="text-xs sm:text-sm font-medium text-brand-700 hover:text-brand-800 px-2.5 py-1.5 rounded-lg hover:bg-brand-50"
          title="Espace formateur"
        >
          👩‍🏫 Formateur
        </button>
      }
    >
      <div className="animate-slideUp">
        <div className="card relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-brand-100/70 blur-2xl" />
          <div className="relative">
            <div className="chip bg-brand-100 text-brand-800 mb-3">
              ⏱ 20 à 45 minutes
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Prends conscience de ta gestion du temps.
            </h1>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Une expérience interactive pour identifier tes fuites de temps et
              expérimenter des stratégies efficaces : priorisation, time
              batching, action immédiate, gestion des interruptions.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => goTo("profile")}
                className="btn-primary text-base"
              >
                🚀 Commencer le jeu
              </button>
              <button
                onClick={() => goTo("trainer")}
                className="btn-ghost text-base"
              >
                👩‍🏫 Espace formateur
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { e: "🧭", t: "Priorisation" },
            { e: "📦", t: "Time batching" },
            { e: "⚡", t: "Action immédiate" },
            { e: "🛡️", t: "Anti-distraction" },
          ].map((c) => (
            <div
              key={c.t}
              className="card !p-4 text-center hover:scale-[1.02] transition-transform"
            >
              <div className="text-2xl">{c.e}</div>
              <div className="text-sm font-medium mt-1">{c.t}</div>
            </div>
          ))}
        </div>

        {sessions.length > 0 && (
          <div className="mt-6 card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Sessions enregistrées</div>
                <div className="text-xs text-slate-500">
                  {sessions.length} participant{sessions.length > 1 ? "s" : ""}
                </div>
              </div>
              <button
                onClick={() => goTo("trainer")}
                className="text-sm text-brand-700 hover:underline"
              >
                Voir le tableau de bord →
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-xs text-slate-500 text-center">
          Aucune installation requise · Compatible smartphone, tablette,
          ordinateur · RGPD : aucune donnée sensible n'est collectée.
        </div>
      </div>
    </Layout>
  );
}
