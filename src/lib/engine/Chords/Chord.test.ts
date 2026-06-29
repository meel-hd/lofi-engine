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
});
