import type { RunResult } from "../../lib/types";

type GameResultProps = {
  result: RunResult;
};

export function GameResult({ result }: GameResultProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Last run
          </div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-white">
            {result.score}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            {new Date(result.timestamp).toLocaleTimeString()}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-300 dark:border-slate-700 dark:text-slate-100 dark:hover:border-slate-600"
          >
            Retry
          </button>
          <button
            type="button"
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
          >
            Submit score
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameResult;
