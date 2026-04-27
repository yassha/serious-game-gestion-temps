import { useState } from "react";
import { useGame } from "../store";
import { Layout } from "./Layout";
import { AVATARS, defaultAvatar } from "../data/avatars";
import type { Gender } from "../types";

export function ProfileScreen() {
  const profile = useGame((s) => s.profile);
  const setProfile = useGame((s) => s.setProfile);
  const goTo = useGame((s) => s.goTo);

  const today = new Date().toISOString().slice(0, 10);

  const [name, setName] = useState(profile?.name ?? "");
  const [date, setDate] = useState(profile?.sessionDate ?? today);
  const [gender, setGender] = useState<Gender>(profile?.gender ?? "autre");
  const [avatar, setAvatar] = useState(
    profile?.avatar ?? defaultAvatar("autre")
  );

  const valid = name.trim().length >= 2 && !!date && !!avatar;

  return (
    <Layout
      title="Ton profil"
      onBack={() => goTo("home")}
      step={{ current: 1, total: 4, label: "Profil" }}
    >
      <div className="card animate-slideUp">
        <h2 className="text-xl font-bold">Crée ton profil</h2>
        <p className="text-sm text-slate-500 mt-1">
          Pour personnaliser ton expérience. Aucune donnée sensible n'est
          stockée hors de cet appareil.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="label">Nom ou pseudo</label>
            <input
              className="input"
              placeholder="Ex: Marie, Jean, Sam…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              autoFocus
            />
          </div>

          <div>
            <label className="label">Date de session</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Genre</label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: "femme", label: "Femme" },
                  { id: "homme", label: "Homme" },
                  { id: "autre", label: "Sans préciser" },
                ] as { id: Gender; label: string }[]
              ).map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setGender(g.id);
                    setAvatar(defaultAvatar(g.id));
                  }}
                  className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                    gender === g.id
                      ? "border-brand-500 bg-brand-50 text-brand-800 ring-2 ring-brand-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Choisis ton avatar</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {AVATARS[gender].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className={`aspect-square text-3xl flex items-center justify-center rounded-xl transition ${
                    avatar === a
                      ? "bg-brand-50 ring-2 ring-brand-500"
                      : "bg-slate-50 hover:bg-slate-100"
                  }`}
                  aria-label="Choisir cet avatar"
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          disabled={!valid}
          onClick={() => {
            setProfile({ name: name.trim(), sessionDate: date, gender, avatar });
            goTo("job");
          }}
          className="btn-primary w-full mt-6"
        >
          Continuer →
        </button>
      </div>
    </Layout>
  );
}
