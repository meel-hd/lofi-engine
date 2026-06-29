// Single source of truth for ambient/main volumes (replaces the old
// localStorage-polling approach — PERF-3). Auto-persists to the same
// "Volumes" localStorage key for backward compatibility.
import { writable } from 'svelte/store';

export type VolumeKey = 'rain' | 'thunder' | 'campfire' | 'jungle' | 'main_track';
export type Volumes = Record<VolumeKey, number>;

const STORAGE_KEY = 'Volumes';
const DEFAULTS: Volumes = {
  rain: 1,
  thunder: 1,
  campfire: 1,
  jungle: 1,
  main_track: 1,
};

function load(): Volumes {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export const volumes = writable<Volumes>(load());

// Persist on every change.
volumes.subscribe((v) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  } catch {
    /* storage unavailable — ignore */
  }
});

export function setVolume(key: VolumeKey, value: number) {
  volumes.update((v) => ({ ...v, [key]: value }));
}
