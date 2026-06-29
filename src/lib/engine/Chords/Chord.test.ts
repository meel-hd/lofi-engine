import { describe, it, expect } from "vitest";
import Chords from "./Chords";

describe("Chord.generateVoicing", () => {
  it("produces a voicing of the requested size starting at the root", () => {
    for (const chord of Chords) {
      const voicing = chord.generateVoicing(4);
      expect(voicing).toHaveLength(4);
      expect(voicing[0]).toBe(0);
    }
  });

  it("ascends (non-decreasing) and contains no NaN", () => {
    // Shuffle is random, so sample many voicings per chord.
    for (let run = 0; run < 200; run++) {
      for (const chord of Chords) {
        const voicing = chord.generateVoicing(4);
        for (let i = 0; i < voicing.length; i++) {
          expect(Number.isNaN(voicing[i])).toBe(false);
          if (i > 0) {
            expect(voicing[i]).toBeGreaterThanOrEqual(voicing[i - 1]);
          }
        }
      }
    }
  });

  it("returns a sane minimal voicing for size < 3", () => {
    for (const chord of Chords) {
      const voicing = chord.generateVoicing(2);
      expect(voicing[0]).toBe(0);
      expect(voicing.length).toBeGreaterThanOrEqual(1);
      voicing.forEach((n) => expect(Number.isNaN(n)).toBe(false));
    }
  });

  it("inverts so a non-root chord tone is the lowest note", () => {
    for (let run = 0; run < 200; run++) {
      for (const chord of Chords) {
        const chordTones = new Set(chord.intervals.map((n) => n % 12));
        const voicing = chord.generateVoicing(4, { invert: true });
        // Bass is a chord tone, but not the root.
        expect(voicing[0] % 12).not.toBe(0);
        for (let i = 0; i < voicing.length; i++) {
          expect(Number.isNaN(voicing[i])).toBe(false);
          // Every note is diatonic to the chord (a real chord tone).
          expect(chordTones.has(voicing[i] % 12)).toBe(true);
          if (i > 0) {
            expect(voicing[i]).toBeGreaterThanOrEqual(voicing[i - 1]);
          }
        }
      }
    }
  });

  it("extends with a higher diatonic tone, staying valid and ascending", () => {
    let sawExtension = false;
    for (let run = 0; run < 200; run++) {
      for (const chord of Chords) {
        const chordTones = new Set(chord.intervals.map((n) => n % 12));
        // Base tones occupy the first 4 intervals; extensions live beyond and
        // are distinct mod 12, so an extension shows up as a non-base pitch.
        const baseTones = new Set(chord.intervals.slice(0, 4).map((n) => n % 12));
        const voicing = chord.generateVoicing(4, { extend: true });
        for (let i = 0; i < voicing.length; i++) {
          expect(Number.isNaN(voicing[i])).toBe(false);
          expect(chordTones.has(voicing[i] % 12)).toBe(true);
          if (i > 0) {
            expect(voicing[i]).toBeGreaterThanOrEqual(voicing[i - 1]);
          }
          if (!baseTones.has(voicing[i] % 12)) sawExtension = true;
        }
      }
    }
    // Over many runs the extension must actually show up.
    expect(sawExtension).toBe(true);
  });

  it("picks velocities within the tasteful 0.6-0.9 range", () => {
    for (const chord of Chords) {
      for (let i = 0; i < 1000; i++) {
        const v = chord.pickVelocity();
        expect(Number.isNaN(v)).toBe(false);
        expect(v).toBeGreaterThanOrEqual(0.6);
        expect(v).toBeLessThanOrEqual(0.9);
      }
    }
  });
});
