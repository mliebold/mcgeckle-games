export type Target = { start: number; end: number };

export type StepConfig = {
  baseSpeed: number; // units per second across canvas
  speedScale: number; // multiplier per success
  barWidth: number; // normalized width 0..1
  targetWidth: number; // normalized width 0..1
};

export const defaultConfig: StepConfig = {
  baseSpeed: 0.55,
  speedScale: 1.035,
  barWidth: 0.01,
  targetWidth: 0.24,
};

export function nextStep(prev: StepConfig): StepConfig {
  return {
    baseSpeed: prev.baseSpeed * prev.speedScale,
    speedScale: prev.speedScale,
    barWidth: prev.barWidth,
    targetWidth: Math.max(0.08, prev.targetWidth * 0.9),
  };
}

export function randomTarget(width: number): Target {
  const start = Math.random() * (1 - width);
  return { start, end: start + width };
}

export function inZone(pos: number, target: Target) {
  return pos >= target.start && pos <= target.end;
}
