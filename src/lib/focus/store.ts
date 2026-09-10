import { derived, get, writable } from "svelte/store";
import { isEditableTarget } from "../keyboard";
import { t } from "../locales/store";

export type Phase = "focus" | "shortBreak" | "longBreak";
export type Status = "idle" | "running" | "paused";
export type Task = { id: string; title: string; done: boolean; pomodoros: number };
export type Config = { focus: number; shortBreak: number; longBreak: number; rounds: number; notifications: boolean };
type Day = { focusMs: number; pomodoros: number };
type Timer = { phase: Phase; status: Status; remaining: number; endsAt: number | null; completedRounds: number };

const read = <T>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || "") as T; } catch { return fallback; }
};
const persist = <T>(key: string, store: { subscribe: (run: (value: T) => void) => () => void }) =>
  store.subscribe((value) => localStorage.setItem(key, JSON.stringify(value)));

export const config = writable<Config>({ focus: 25, shortBreak: 5, longBreak: 15, rounds: 4, notifications: true, ...read<Partial<Config>>("lofi-focus-config", {}) });
export const tasks = writable<Task[]>(read<Task[]>("lofi-focus-tasks", []));
export const stats = writable<Record<string, Day>>(read<Record<string, Day>>("lofi-focus-stats", {}));
export const currentTaskId = writable<string | null>(get(tasks).find((task) => !task.done)?.id ?? null);
export const mini = writable(false);
export const zen = writable(false);
export const activePanel = writable<"tasks" | "stats" | "settings" | null>(null);
export const timerOpen = writable(false);

const initial = (cfg: Config): Timer => ({ phase: "focus", status: "idle", remaining: cfg.focus * 60_000, endsAt: null, completedRounds: 0 });
export const timer = writable<Timer>(initial(get(config)));
export const currentTask = derived([tasks, currentTaskId], ([$tasks, $id]) => $tasks.find((task) => task.id === $id) ?? null);
export const today = derived(stats, ($stats) => $stats[dateKey()] ?? { focusMs: 0, pomodoros: 0 });
export const week = derived(stats, ($stats) => weekTotals($stats));
export const weekDays = derived(stats, ($stats) => {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = dateKey(date.getTime());
    return { date, focusMs: $stats[key]?.focusMs ?? 0 };
  });
});

persist("lofi-focus-config", config); persist("lofi-focus-tasks", tasks); persist("lofi-focus-stats", stats);

export const duration = (phase: Phase, cfg = get(config)) => cfg[phase] * 60_000;
export const formatClock = (ms: number) => {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};
const dateKey = (time = Date.now()) => new Date(time).toISOString().slice(0, 10);
const weekTotals = (all: Record<string, Day>) => {
  let focusMs = 0, pomodoros = 0;
  for (let offset = 0; offset < 7; offset++) { const date = new Date(); date.setDate(date.getDate() - offset); const day = all[dateKey(date.getTime())]; focusMs += day?.focusMs ?? 0; pomodoros += day?.pomodoros ?? 0; }
  return { focusMs, pomodoros };
};
const dispatchPhase = () => { const value = get(timer); window.dispatchEvent(new CustomEvent("lofi-focus-phase", { detail: { phase: value.phase, status: value.status } })); };

async function notify(title: string, body: string) {
  if (!get(config).notifications) return;
  if ("__TAURI_INTERNALS__" in window) {
    try { const api = await import("@tauri-apps/plugin-notification"); const ok = await api.isPermissionGranted() || (await api.requestPermission()) === "granted"; if (ok) api.sendNotification({ title, body }); return; } catch { /* browser fallback */ }
  }
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") new Notification(title, { body });
  else if (Notification.permission === "default") Notification.requestPermission().then((result) => result === "granted" && new Notification(title, { body }));
}

function recordFocus(milliseconds: number, completed: boolean) {
  if (!milliseconds) return;
  const key = dateKey();
  stats.update((all) => { const day = all[key] ?? { focusMs: 0, pomodoros: 0 }; return { ...all, [key]: { focusMs: day.focusMs + milliseconds, pomodoros: day.pomodoros + (completed ? 1 : 0) } }; });
  if (completed && get(currentTaskId)) tasks.update((all) => all.map((task) => task.id === get(currentTaskId) ? { ...task, pomodoros: task.pomodoros + 1 } : task));
}

export const timerActions = {
  toggle() {
    const value = get(timer);
    if (value.status === "running") { timer.set({ ...value, status: "paused", endsAt: null, remaining: Math.max(0, (value.endsAt ?? Date.now()) - Date.now()) }); return; }
    const remaining = value.status === "idle" ? duration(value.phase) : value.remaining;
    timer.set({ ...value, status: "running", remaining, endsAt: Date.now() + remaining }); dispatchPhase();
  },
  tick() { const value = get(timer); if (value.status !== "running" || value.endsAt === null) return; const remaining = Math.max(0, value.endsAt - Date.now()); timer.set({ ...value, remaining }); if (!remaining) this.finish(true); },
  finish(completed: boolean) {
    const value = get(timer), cfg = get(config), elapsed = Math.max(0, duration(value.phase, cfg) - value.remaining);
    if (value.phase === "focus") recordFocus(elapsed, completed);
    const rounds = value.completedRounds + (value.phase === "focus" && completed ? 1 : 0);
    const phase: Phase = value.phase === "focus" ? (rounds && rounds % cfg.rounds === 0 ? "longBreak" : "shortBreak") : "focus";
    timer.set({ phase, status: "idle", remaining: duration(phase, cfg), endsAt: null, completedRounds: rounds }); dispatchPhase();
    if (completed) {
      const copy = get(t).focus;
      void notify(
        `Lofi Engine · ${phase === "focus" ? copy.focus_time : copy.break_time}`,
        phase === "focus" ? copy.break_over : copy.take_break,
      );
    }
  },
  skip() { if (get(timer).status !== "idle") this.finish(false); },
  end() { const value = get(timer); if (value.status !== "idle" && value.phase === "focus") recordFocus(duration(value.phase) - value.remaining, false); timer.set(initial(get(config))); dispatchPhase(); },
};

export const taskActions = {
  add(title: string) { const clean = title.trim(); if (!clean) return; const task = { id: crypto.randomUUID(), title: clean, done: false, pomodoros: 0 }; tasks.update((all) => [...all, task]); if (!get(currentTaskId)) currentTaskId.set(task.id); },
  toggle(id: string) { tasks.update((all) => all.map((task) => task.id === id ? { ...task, done: !task.done } : task)); },
  remove(id: string) { tasks.update((all) => all.filter((task) => task.id !== id)); if (get(currentTaskId) === id) currentTaskId.set(get(tasks).find((task) => !task.done)?.id ?? null); },
};

export function startFocusSystem() {
  const interval = setInterval(() => timerActions.tick(), 250);
  const keydown = (event: KeyboardEvent) => {
    if (isEditableTarget(event.target)) return;

    if (event.key.toLowerCase() === "p") {
      timerOpen.set(true);
      timerActions.toggle();
    }

    if (event.key.toLowerCase() === "n") timerActions.skip();
    if (event.key === "Escape") {
      activePanel.set(null);
      timerOpen.set(false);
    }
  };

  window.addEventListener("keydown", keydown);
  let unlisten: (() => void) | undefined;
  if ("__TAURI_INTERNALS__" in window) import("@tauri-apps/api/event").then(({ listen }) => listen<{ action: string }>("tray://action", ({ payload }) => { if (payload.action === "playpause") window.dispatchEvent(new CustomEvent("lofi-toggle-play")); if (payload.action === "skip") timerActions.skip(); }).then((stop) => unlisten = stop));
  return () => {
    clearInterval(interval);
    window.removeEventListener("keydown", keydown);
    unlisten?.();
  };
}
