import { writable } from "svelte/store";

const STORAGE_KEY = "rain-speed";
const saved = Number(localStorage.getItem(STORAGE_KEY) ?? 1);
const initial = Number.isFinite(saved) ? Math.min(2, Math.max(0.25, saved)) : 1;

export const rainSpeed = writable(initial);
rainSpeed.subscribe((speed) => localStorage.setItem(STORAGE_KEY, String(speed)));
