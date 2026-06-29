// Single source of truth for environmental effect on/off state (BUG-5).
// Both the manual buttons/shortcuts, the context menu, and the Auto-DJ write
// here; the effect components subscribe and play/pause to match. This replaces
// the old stateless "lofi-toggle-*" CustomEvents, so the Auto-DJ can SET state
// (not blindly flip) and reset what it enabled on mode change.
import { writable } from 'svelte/store';

export type EffectKey = 'rain' | 'thunder' | 'jungle' | 'campfire';
export type EffectState = Record<EffectKey, boolean>;

const DEFAULTS: EffectState = {
  rain: false,
  thunder: false,
  jungle: false,
  campfire: false,
};

// Not persisted: effects start off on each load (matches prior behavior).
export const effects = writable<EffectState>({ ...DEFAULTS });

export function setEffect(key: EffectKey, on: boolean) {
  effects.update((s) => ({ ...s, [key]: on }));
}

export function toggleEffect(key: EffectKey) {
  effects.update((s) => ({ ...s, [key]: !s[key] }));
}

export function resetEffects() {
  effects.set({ ...DEFAULTS });
}
