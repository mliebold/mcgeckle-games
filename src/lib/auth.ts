import type { UserSession } from "./types";

const STORAGE_KEY = "mcgeckle-handle";

export function getLocalHandle(): string {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;
  const handle = `player-${Math.random().toString(36).slice(2, 7)}`;
  localStorage.setItem(STORAGE_KEY, handle);
  return handle;
}

export async function bootstrapSession(): Promise<UserSession> {
  const handle = getLocalHandle();
  // Placeholder: integrate BetterAuth client here
  return { id: handle, handle };
}
