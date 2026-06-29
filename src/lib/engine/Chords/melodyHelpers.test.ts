import { describe, it, expect } from "vitest";
import {
  chordTonePitchClasses,
  nearestChordToneScalePos,
  pickWeightedIndex,
} from "./melodyHelpers";
import Chords from "./Chords";

describe("pickWeightedIndex (locks in BUG-1)", () => {
  it("returns -1 for an empty weight array instead of looping forever", () => {
    // An empty scale produced empty weights -> the old while(!found) loop hung.
    expect(pickWeightedIndex([], 0.5)).toBe(-1);
  });

  it("always returns an in-bounds index for normal weight arrays", () => {
    const weights = [0.1, 0.3, 0.2, 0.15, 0.15, 0.025, 0.025, 0.05];
    for (let i = 0; i <= 100; i++) {
      const r = i / 100; // covers 0..1 inclusive
      const idx = pickWeightedIndex(weights, r);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(weights.length);
    }
  });

  it("uses the final bucket as a fallback for r >= last cumulative weight", () => {
    const weights = [0.5, 0.5];
    expect(pickWeightedIndex(weights, 1)).toBe(weights.length - 1);
    // Even an impossible value above 1 stays in-bounds (never overflows).
    expect(pickWeightedIndex(weights, 2)).toBe(weights.length - 1);
  });

  it("stays in-bounds for all-zero weights (NaN-safe)", () => {
    const idx = pickWeightedIndex([0, 0, 0], 0.5);
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(idx).toBeLessThan(3);
  });

  it("selects the first bucket for the smallest random value", () => {
    expect(pickWeightedIndex([0.5, 0.5], 0)).toBe(0);
  });
});

describe("chordTonePitchClasses", () => {
  it("includes the chord's root pitch class", () => {
    const V = Chords[4];
    // V's root sits 7 semitones above the tonic.
    expect(chordTonePitchClasses(V).has(7)).toBe(true);
  });
});

describe("nearestChordToneScalePos", () => {
  it("keeps a position that is already a chord tone", () => {
    const I = Chords[0];
    // fiveToFive index 3 == offset 0 == tonic, a chord tone of I.
    expect(nearestChordToneScalePos(3, I)).toBe(3);
  });

  it("returns -1 when no chord is given", () => {
    expect(nearestChordToneScalePos(3, null)).toBe(-1);
  });

  it("never returns an out-of-scale index", () => {
    const V = Chords[4];
    for (let pos = 0; pos < 15; pos++) {
      const snapped = nearestChordToneScalePos(pos, V);
      if (snapped !== -1) {
        expect(snapped).toBeGreaterThanOrEqual(0);
        expect(snapped).toBeLessThan(15);
      }
    }
  });
});
