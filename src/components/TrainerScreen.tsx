import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useGame } from "../store";
import { Layout } from "./Layout";
import { PROFILE_LABELS } from "../game/scoring";
import type { SessionRecord } from "../types";

export function TrainerScreen() {
  const sessions = useGame((s) => s.sessions);
  const goTo = useGame((s) => s.goTo);
  const clearSessions = useGame((s) => s.clearSessions);
  const [filter, setFilter] = useState<"all" | string>("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? sessions
        : sessions.filter((s) => s.profile.sessionDate === filter),
    [sessions, filter]
  );

  const dates = useMemo(
    () => Array.from(new Set(sessions.map((s) => s.profile.sessionDate))).sort(),
    [sessions]
  );

  const avg =
    filtered.length > 0
      ? Math.round(
          filtered.reduce((a, b) => a + b.result.score, 0) / filtered.length
        )
      : 0;

  const ranking = [...filtered].sort(
    (a, b) => b.result.score - a.result.score
  );

  return (
    <Layout
      title="Espace formateur"
      onBack={() => goTo("home")}
      right={
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCSV(filtered)}
            disabled={filtered.length === 0}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-brand-600 text-white disabled:opacity-50"
          >
            CSV
          </button>
          <button
            onClick={() => exportJSON(filtered)}
            disabled={filtered.length === 0}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 text-white disabled:opacity-50"
          >
            JSON
          </button>
        </div>
      }
    >
      <div className="card animate-slideUp">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Vue d'ensemble
            </div>
            <h2 className="text-lg font-bold">Résultats du groupe</h2>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="input !py-2 !px-3 text-sm w-auto"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Toutes les sessions</option>
              {dates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Participants" value={filtered.length} />
          <Stat label="Score moyen" value={`${avg}/100`} />
          <Stat
            label="Profil dominant"
            value={dominantProfile(filtered) ?? "—"}
            small
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {(["stratege_organise", "reactif_deborde", "multitache_disperse"] as const).map(
            (p) => {
              const count = filtered.filter(
                (s) => s.result.profile === p
              ).length;
              const pct = filtered.length
                ? Math.round((count / filtered.length) * 100)
                : 0;
              return (
                <div
                  key={p}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"
                >
                  <div className="text-2xl">{PROFILE_LABELS[p].emoji}</div>
                  <div className="text-xs font-semibold mt-1">
                    {PROFILE_LABELS[p].title}
                  </div>
                  <div className="text-sm text-slate-600">
                    {count} ({pct}%)
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      <div className="card mt-4 animate-slideUp">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">🏆 Classement</div>
          {sessions.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Effacer toutes les sessions enregistrées ?")) {
                  clearSessions();
                }
              }}
              className="text-xs text-danger-600 hover:underline"
            >
              Tout effacer
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-sm text-slate-500 mt-3">
            Aucune session enregistrée. Les résultats des participants
            apparaîtront ici automatiquement.
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-500">
                  <th className="px-2 py-2">#</th>
                  <th className="px-2 py-2">Participant</th>
                  <th className="px-2 py-2">Métier</th>
                  <th className="px-2 py-2">Score</th>
                  <th className="px-2 py-2">Profil</th>
                  <th className="px-2 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((s, i) => (
                  <tr
                    key={s.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-2 py-2 font-semibold">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                    </td>
                    <td className="px-2 py-2">
                      <span className="mr-1">{s.profile.avatar}</span>
                      {s.profile.name}
                    </td>
                    <td className="px-2 py-2">{s.jobTitle}</td>
                    <td className="px-2 py-2 font-bold">
                      {s.result.score}
                    </td>
                    <td className="px-2 py-2 text-xs">
                      {PROFILE_LABELS[s.result.profile].emoji}{" "}
                      {PROFILE_LABELS[s.result.profile].title}
                    </td>
                    <td className="px-2 py-2 text-xs text-slate-500">
                      {s.profile.sessionDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card mt-4 animate-slideUp">
        <div className="text-sm font-semibold">🔗 Partage du jeu</div>
        <p className="text-xs text-slate-500 mt-1">
          Les stagiaires peuvent rejoindre la session via le QR code ou le lien
          direct ci-dessous.
        </p>
        <div className="mt-3 flex flex-col sm:flex-row items-start gap-4">
          <div className="bg-white p-3 rounded-xl ring-1 ring-slate-200">
            <QRCodeSVG value={shareUrl()} size={140} level="M" />
          </div>
          <div className="flex-1 w-full">
            <div className="text-xs text-slate-500 mb-1">Lien direct</div>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={shareUrl()}
                className="input text-xs flex-1"
              />
              <button
                onClick={() => navigator.clipboard?.writeText(shareUrl())}
                className="btn-ghost text-xs"
              >
                Copier
              </button>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Astuce : ajoute <code>?name=Marie&amp;job=voirie</code> à la fin du
              lien pour pré-remplir le profil d'un stagiaire.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Stat({
  label,
  value,
  small,
}: {
  label: string;
  value: string | number;
  small?: boolean;
}) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
      <div className="text-[11px] uppercase font-semibold text-slate-500 tracking-wide">
        {label}
      </div>
      <div className={small ? "text-sm font-semibold" : "text-xl font-bold"}>
        {value}
      </div>
    </div>
  );
}

/**
 * URL canonique à partager (origin + pathname, sans index.html ni params).
 * Évite que le QR code pointe vers la racine du domaine quand l'app est
 * hébergée dans un sous-dossier (ex. GitHub Pages : /serious-game-gestion-temps/).
 */
function shareUrl() {
  if (typeof window === "undefined") return "";
  const { origin, pathname } = window.location;
  const cleaned = pathname.replace(/index\.html$/i, "");
  const trailing = cleaned.endsWith("/") ? cleaned : cleaned + "/";
  return origin + trailing;
}

function dominantProfile(sessions: SessionRecord[]) {
  if (sessions.length === 0) return null;
  const counts: Record<string, number> = {};
  for (const s of sessions) {
    counts[s.result.profile] = (counts[s.result.profile] ?? 0) + 1;
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (!top) return null;
  const meta = PROFILE_LABELS[top[0] as keyof typeof PROFILE_LABELS];
  return `${meta.emoji} ${meta.title}`;
}

function exportCSV(sessions: SessionRecord[]) {
  const header = [
    "Date",
    "Participant",
    "Genre",
    "Métier",
    "Score",
    "Profil",
    "Temps perdu (min)",
    "Distraction (%)",
    "Priorisation (%)",
    "Badges",
  ];
  const rows = sessions.map((s) => [
    s.profile.sessionDate,
    s.profile.name,
    s.profile.gender,
    s.jobTitle,
    s.result.score,
    PROFILE_LABELS[s.result.profile].title,
    s.result.timeUsedMin,
    Math.round(s.result.distractionRate * 100),
    Math.round(s.result.prioritizationRate * 100),
    s.result.badges.join(" | "),
  ]);
  const csv = [header, ...rows]
    .map((r) =>
      r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");
  download(csv, "serious-game-resultats.csv", "text/csv");
}

function exportJSON(sessions: SessionRecord[]) {
  download(
    JSON.stringify(sessions, null, 2),
    "serious-game-resultats.json",
    "application/json"
  );
}

function download(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
