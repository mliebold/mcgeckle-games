import { useEffect, useState } from "react";
import GameCanvas from "./components/game/GameCanvas";
import GameResult from "./components/game/GameResult";
import Leaderboard from "./components/leaderboard/Leaderboard";
import Layout from "./components/ui/layout";
import { ThemeProvider } from "./components/theme-provider";
import { bootstrapSession } from "./lib/auth";
import type { RunResult, UserSession } from "./lib/types";

function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [lastResult, setLastResult] = useState<RunResult | null>(null);
  const [bestStreak, setBestStreak] = useState(0);
  const [resetToken, setResetToken] = useState(false);

  useEffect(() => {
    bootstrapSession().then(setSession);
    const storedBest = localStorage.getItem("mcgeckle-best");
    if (storedBest) setBestStreak(Number(storedBest));
  }, []);

  const handleRunEnd = (result: RunResult) => {
    setLastResult(result);
    if (result.score > bestStreak) {
      localStorage.setItem("mcgeckle-best", String(bestStreak));
      setBestStreak(result.score);
    }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Layout>
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Reflex test
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Stop the bar on the target. Shrink it until you can&apos;t.
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                Each success makes the bar and target smaller. Space or click to
                stop. Submit your best and climb the board.
              </p>
            </div>

            <GameCanvas
              mode="normal"
              resetToken={resetToken}
              onResetTokenUse={setResetToken}
              onRunEnd={handleRunEnd}
            />

            {lastResult ? <GameResult result={lastResult} /> : null}
          </div>

          <div className="space-y-4">
            <Leaderboard currentUser={session} />
            <div className="rounded-xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
              <div className="mb-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Controls
              </div>
              <ul className="space-y-1">
                <li>Space / Enter — stop the bar</li>
                <li>Click canvas — stop or start</li>
                <li>Retry button after a miss</li>
              </ul>
            </div>
          </div>
        </section>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
