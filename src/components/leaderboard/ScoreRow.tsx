import type { LeaderboardEntry } from "../../lib/types";

type ScoreRowProps = {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
};

export function ScoreRow({ entry, isCurrentUser }: ScoreRowProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${isCurrentUser ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500/70 dark:bg-emerald-900/20" : "border-slate-100 bg-white/70 dark:border-slate-800 dark:bg-slate-900/70"}`}
    >
      <div className="flex items-center gap-3">
        <span className="w-8 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          #{entry.rank}
        </span>
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{entry.handle}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {entry.mode} · {new Date(entry.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="text-lg font-semibold text-slate-900 dark:text-white">{entry.score}</div>
    </div>
  );
}

export default ScoreRow;
