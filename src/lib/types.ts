export type RunMode = "normal" | "daily" | "practice";

export type RunResult = {
  score: number;
  mode: RunMode;
  runLength: number;
  targetWidth: number;
  timestamp: number;
  meta?: Record<string, unknown>;
};

export type LeaderboardEntry = {
  id: string;
  rank: number;
  handle: string;
  score: number;
  mode: RunMode | string;
  createdAt: string;
};

export type UserSession = {
  id: string;
  handle: string;
  token?: string;
};

export type ScorePayload = {
  score: number;
  mode: RunMode;
  run_meta?: Record<string, unknown>;
};
