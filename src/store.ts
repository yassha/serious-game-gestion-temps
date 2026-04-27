import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ChoiceLog,
  JobId,
  Profile,
  Result,
  SessionRecord,
} from "./types";
import { computeResult } from "./game/scoring";
import { getScenario } from "./data/scenarios";

export type Screen =
  | "home"
  | "profile"
  | "job"
  | "intro"
  | "game"
  | "result"
  | "trainer";

interface GameState {
  screen: Screen;
  profile: Profile | null;
  jobId: JobId | null;
  stepIndex: number;
  startedAt: number | null;
  log: ChoiceLog[];
  result: Result | null;
  sessions: SessionRecord[];

  // actions
  goTo: (screen: Screen) => void;
  setProfile: (p: Profile) => void;
  setJob: (j: JobId) => void;
  startGame: () => void;
  pushLog: (entry: ChoiceLog) => void;
  nextStep: () => void;
  finishGame: () => void;
  resetGame: () => void;
  clearSessions: () => void;
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      screen: "home",
      profile: null,
      jobId: null,
      stepIndex: 0,
      startedAt: null,
      log: [],
      result: null,
      sessions: [],

      goTo: (screen) => set({ screen }),
      setProfile: (profile) => set({ profile }),
      setJob: (jobId) => set({ jobId }),
      startGame: () =>
        set({
          screen: "game",
          stepIndex: 0,
          startedAt: Date.now(),
          log: [],
          result: null,
        }),

      pushLog: (entry) => set({ log: [...get().log, entry] }),

      nextStep: () => {
        const { jobId, stepIndex } = get();
        if (!jobId) return;
        const sc = getScenario(jobId);
        if (!sc) return;
        if (stepIndex + 1 >= sc.steps.length) {
          get().finishGame();
        } else {
          set({ stepIndex: stepIndex + 1 });
        }
      },

      finishGame: () => {
        const { jobId, log, profile } = get();
        if (!jobId || !profile) return;
        const scenario = getScenario(jobId);
        if (!scenario) return;
        const result = computeResult(scenario, log);
        const record: SessionRecord = {
          id: cryptoId(),
          createdAt: new Date().toISOString(),
          profile,
          jobId,
          jobTitle: scenario.title,
          result,
          log,
        };
        set({
          result,
          screen: "result",
          sessions: [record, ...get().sessions].slice(0, 200),
        });
      },

      resetGame: () =>
        set({
          screen: "home",
          jobId: null,
          stepIndex: 0,
          startedAt: null,
          log: [],
          result: null,
        }),

      clearSessions: () => set({ sessions: [] }),
    }),
    {
      name: "serious-game-time-v1",
      partialize: (state) => ({
        sessions: state.sessions,
      }),
    }
  )
);

function cryptoId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
