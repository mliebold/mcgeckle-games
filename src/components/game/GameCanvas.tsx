import { useCallback, useEffect, useRef, useState } from "react";
import type { RunMode } from "../../lib/types";
import {
  defaultConfig,
  inZone,
  nextStep,
  randomTarget,
  type StepConfig,
  type Target,
} from "./game-logic";
import { useGameStore } from "../../state/useGameStore";

type GameCanvasProps = {
  mode?: RunMode;
};

const CANVAS_HEIGHT = 160;

export function GameCanvas({ mode = "normal" }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const posRef = useRef<number>(0);
  const streakRef = useRef<number>(0);
  const configRef = useRef<StepConfig>(defaultConfig);
  const targetRef = useRef<Target | null>(null);
  const runningRef = useRef(false);

  const [state, setState] = useState<"idle" | "running" | "ended">("idle");
  const [target, setTarget] = useState<Target>(() =>
    randomTarget(defaultConfig.targetWidth),
  );
  const [streak, setStreak] = useState(0);

  const { recordResult } = useGameStore();

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cssWidth = canvas.getBoundingClientRect().width;
    const cssHeight = CANVAS_HEIGHT;
    const targetVal = targetRef.current ?? target;
    const config = configRef.current;

    const width = cssWidth;
    const height = cssHeight;
    ctx.clearRect(0, 0, width, height);

    // Track background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    // Target zone
    ctx.fillStyle = "#10b981";
    ctx.globalAlpha = 0.35;
    ctx.fillRect(
      targetVal.start * width,
      height * 0.25,
      (targetVal.end - targetVal.start) * width,
      height * 0.5,
    );
    ctx.globalAlpha = 1;

    // Moving bar
    ctx.fillStyle = "#38bdf8";
    const barWidth = config.barWidth * width;
    const barX = posRef.current * width - barWidth / 2;
    ctx.fillRect(barX, height * 0.25, barWidth, height * 0.5);

    // Progress markers
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.5);
    ctx.lineTo(width, height * 0.5);
    ctx.stroke();
  }, [target]);

  const tick = useCallback(
    (ts: number) => {
      if (!runningRef.current) return;
      const delta = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      const speed = configRef.current.baseSpeed;
      posRef.current = (posRef.current + delta * speed) % 1;

      drawFrame();
      rafRef.current = requestAnimationFrame(tick);
    },
    [drawFrame],
  );

  const stopLoop = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const startRun = useCallback(() => {
    stopLoop();
    configRef.current = defaultConfig;
    const nextTarget = randomTarget(defaultConfig.targetWidth);
    targetRef.current = nextTarget;
    posRef.current = 0;
    streakRef.current = 0;
    setTarget(nextTarget);
    setStreak(0);
    setState("running");
    runningRef.current = true;
    lastTsRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [stopLoop, tick]);

  const handleStop = useCallback(() => {
    if (!runningRef.current) return;
    const targetVal = targetRef.current ?? target;
    const success = inZone(posRef.current, targetVal);

    if (success) {
      const nextStreak = streakRef.current + 1;
      streakRef.current = nextStreak;
      const updatedConfig = nextStep(configRef.current);
      configRef.current = updatedConfig;
      const nextTarget = randomTarget(updatedConfig.targetWidth);
      targetRef.current = nextTarget;

      setStreak(nextStreak);
      setTarget(nextTarget);
      return;
    }

    stopLoop();
    setState("ended");

    recordResult({
      score: streak,
      mode,
      runLength: streakRef.current,
      targetWidth: configRef.current.targetWidth,
      timestamp: Date.now(),
    });
  }, [mode, target, streak, recordResult, stopLoop]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const { width } = canvas.getBoundingClientRect();
    const cssHeight = CANVAS_HEIGHT;
    canvas.width = width * dpr;
    canvas.height = cssHeight * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    drawFrame();
  }, [drawFrame]);

  useEffect(() => {
    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, [resizeCanvas]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (state === "running") {
          handleStop();
        } else {
          startRun();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleStop, startRun, state]);

  useEffect(() => () => stopLoop(), [stopLoop]);

  return (
    <div className="flex flex-col gap-3 rounded-xl border p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-3">
          <span className="font-semibold uppercase tracking-wide text-slate-800 dark:text-slate-100">
            {mode} mode
          </span>
          <span>Streak: {streak}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200">
            Space / click to stop
          </span>
        </div>
      </div>

      <div
        className="relative w-full cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-900 shadow-inner dark:border-slate-800"
        onClick={() => {
          if (state === "running") handleStop();
          else startRun();
        }}
      >
        {state === "idle" ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/30">
              Click or press space to start
            </div>
          </div>
        ) : null}
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: CANVAS_HEIGHT }}
          className="block"
        />
      </div>
    </div>
  );
}

export default GameCanvas;
