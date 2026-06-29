import { describe, it, expect } from "vitest";
import ChordProgression from "./ChordProgression";

describe("ChordProgression.generate", () => {
  it("returns null for lengths below 2", () => {
    expect(ChordProgression.generate(1)).toBeNull();
    expect(ChordProgression.generate(0)).toBeNull();
  });

  it("produces a progression of the requested length", () => {
    for (const length of [2, 4, 8, 16]) {
      const prog = ChordProgression.generate(length);
      expect(prog).toHaveLength(length);
    }
  });

  it("only contains valid scale degrees (1-7)", () => {
    const prog = ChordProgression.generate(32);
    for (const chord of prog) {
      expect(chord.degree).toBeGreaterThanOrEqual(1);
      expect(chord.degree).toBeLessThanOrEqual(7);
    }
  });

  it("only uses valid chord-to-chord transitions", () => {
    // Generation is random, so sample many progressions.
    for (let run = 0; run < 300; run++) {
      const prog = ChordProgression.generate(12);
      for (let i = 0; i < prog.length - 1; i++) {
        const current = prog[i];
        const nextDegreeIdx = prog[i + 1].degree - 1;
        // The next chord must be a permitted successor of the current one.
        expect(current.nextChordIdxs).toContain(nextDegreeIdx);
      }
    }
  });

  it("tends to resolve on a tonic (I) at the end (cadence bias)", () => {
    // GEN-6: the final transitions are steered toward V -> I when reachable,
    // so the progression should usually end on the tonic — far above the ~1/7
    // rate of a uniform random walk.
    let tonicEndings = 0;
    const runs = 400;
    for (let r = 0; r < runs; r++) {
      const prog = ChordProgression.generate(8);
      if (prog[prog.length - 1].degree === 1) tonicEndings++;
    }
    expect(tonicEndings).toBeGreaterThan(runs * 0.5);
  });
});
