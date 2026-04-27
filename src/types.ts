export type Gender = "femme" | "homme" | "autre";

export type JobId =
  | "voirie"
  | "paysagiste"
  | "charge_mission"
  | "assistant_admin";

export interface Profile {
  name: string;
  sessionDate: string;
  gender: Gender;
  avatar: string;
}

export type ChoiceTag =
  | "interruption"
  | "notification"
  | "action_immediate"
  | "time_batching"
  | "priorisation"
  | "dire_non"
  | "concentration"
  | "multitache";

export interface Choice {
  id: string;
  label: string;
  /** Time delta in minutes (negative = lost time, positive = saved time) */
  timeDelta: number;
  /** Score delta -10..+10 */
  scoreDelta: number;
  tags: ChoiceTag[];
  /** Feedback shown after the choice */
  feedback: string;
  /** Whether this is the virtuous choice */
  good?: boolean;
}

export type StepKind =
  | "narrative"
  | "choice"
  | "priorisation"
  | "batching"
  | "notification";

export interface NarrativeStep {
  kind: "narrative";
  id: string;
  title: string;
  text: string;
  icon?: string;
}

export interface ChoiceStep {
  kind: "choice";
  id: string;
  title: string;
  context: string;
  icon?: string;
  choices: Choice[];
}

export interface PriorisationStep {
  kind: "priorisation";
  id: string;
  title: string;
  context: string;
  icon?: string;
  /** Tasks to be sorted into one of 4 quadrants */
  tasks: PriorisationTask[];
}

export interface PriorisationTask {
  id: string;
  label: string;
  correct: PriorisationQuadrant;
}

export type PriorisationQuadrant =
  | "urgent_important"
  | "important_non_urgent"
  | "urgent_non_important"
  | "inutile";

export interface BatchingStep {
  kind: "batching";
  id: string;
  title: string;
  context: string;
  icon?: string;
  /** Items to batch into groups */
  items: BatchingItem[];
  groups: { id: string; label: string }[];
}

export interface BatchingItem {
  id: string;
  label: string;
  correctGroup: string;
}

export type Step =
  | NarrativeStep
  | ChoiceStep
  | PriorisationStep
  | BatchingStep;

export interface Scenario {
  id: JobId;
  title: string;
  emoji: string;
  category: "technique" | "administratif";
  blurb: string;
  context: string;
  /** Total time budget in minutes for the simulated workday */
  timeBudgetMin: number;
  steps: Step[];
}

export interface ChoiceLog {
  stepId: string;
  stepTitle: string;
  choiceId?: string;
  choiceLabel?: string;
  timeDelta: number;
  scoreDelta: number;
  tags: ChoiceTag[];
  good?: boolean;
}

export type FinalProfile =
  | "stratege_organise"
  | "reactif_deborde"
  | "multitache_disperse";

export interface Result {
  /** 0..100 */
  score: number;
  profile: FinalProfile;
  timeUsedMin: number;
  distractionRate: number; // 0..1
  prioritizationRate: number; // 0..1
  globalEfficiency: number; // 0..1
  badges: string[];
  advice: string[];
}

export interface SessionRecord {
  id: string;
  createdAt: string;
  profile: Profile;
  jobId: JobId;
  jobTitle: string;
  result: Result;
  log: ChoiceLog[];
}
