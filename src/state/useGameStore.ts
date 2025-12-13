import { create } from "zustand";
import type { RunResult, UserSession } from "../lib/types";

type GameStatus = "idle" | "running" | "ended";

const BEST_KEY = "mcgeckle-best";

type GameState = {
  status: GameStatus;
  lastResult: RunResult | null;
  bestStreak: number;
  session: UserSession | null;
  pendingRestart: boolean;
  setStatus: (status: GameStatus) => void;
  setSession: (session: UserSession | null) => void;
  recordResult: (result: RunResult) => void;
  hydrateFromStorage: () => void;
  requestRestart: () => void;
  confirmRestartHandled: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  status: "idle",
  lastResult: null,
  bestStreak: 0,
  session: null,
  pendingRestart: false,
  setStatus: (status) => set({ status }),
  setSession: (session) => set({ session }),
  recordResult: (result) =>
    set((state) => {
      const best = Math.max(state.bestStreak, result.score);
      if (typeof window !== "undefined") {
        localStorage.setItem(BEST_KEY, String(best));
      }
      return { lastResult: result, bestStreak: best, status: "ended" };
    }),
  hydrateFromStorage: () => {
    if (typeof window === "undefined") return;
    const stored = Number(localStorage.getItem(BEST_KEY) ?? "0");
    set({ bestStreak: Number.isFinite(stored) ? stored : 0 });
  },
  requestRestart: () =>
    set(() => ({
      pendingRestart: true,
      status: "idle",
    })),
  confirmRestartHandled: () => set({ pendingRestart: false }),
}));
