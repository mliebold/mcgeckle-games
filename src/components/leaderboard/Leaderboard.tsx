import { useEffect, useState } from "react";
// import { getLeaderboard } from "../../lib/api";
import type { LeaderboardEntry, RunMode, UserSession } from "../../lib/types";
import ScoreRow from "./ScoreRow";

const modes: (RunMode | "all")[] = ["normal", "daily", "practice", "all"];

type LeaderboardProps = {
  currentUser?: UserSession | null;
};

export function Leaderboard({ currentUser }: LeaderboardProps) {
  const [activeMode, setActiveMode] = useState<RunMode | "all">("normal");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    // getLeaderboard(activeMode)
    // .then((data) => {
    //   if (mounted) setEntries(data);
    // })
    // .finally(() => {
    //   if (mounted) setLoading(false);
    // });
    return () => {
      mounted = false;
    };
  }, [activeMode]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Leaderboard
          </div>
          <div className="text-xl font-semibold text-slate-900 dark:text-white">
            Top scores
          </div>
        </div>
        <div className="flex gap-2">
          {modes.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setActiveMode(mode)}
              className={`rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                activeMode === mode
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Loading...
          </div>
        ) : entries.length === 0 ? (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            No scores yet. Be the first to land a run.
          </div>
        ) : (
          entries.map((entry) => (
            <ScoreRow
              key={entry.id}
              entry={entry}
              isCurrentUser={currentUser?.handle === entry.handle}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
