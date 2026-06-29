import { describe, it, expect } from "vitest";
import {
  VALID_TOKENS,
  STEP_COUNTS,
  SUBDIVISIONS,
  KICK_PATTERNS,
  SNARE_PATTERNS,
  HAT_PATTERNS,
  PATTERN_SETS,
  PATTERN_SET_COUNT,
  FILLS,
  selectPatternSet,
  pickFill,
} from "./patterns";

const tokens = new Set<string>(VALID_TOKENS);
const isValid = (pattern: string[]) =>
  pattern.every((token) => tokens.has(token));

// The patterns PlayButton hard-codes today. Every one of these must still be
// reachable so the new library is a strict superset of the old behaviour.
const CURRENT = {
  kick: ["C4", "", "", "", "", "", "", "C4", "C4", "", ".", "", "", "", "", ""],
  snare: ["", "C4"],
  hat: ["C4", "C4", "C4", "C4", "C4", "C4", "C4", "C4"],
};

describe("drum pattern arrays", () => {
  it("kick patterns are the right length and only use valid tokens", () => {
    for (const pattern of KICK_PATTERNS) {
      expect(pattern).toHaveLength(STEP_COUNTS.kick);
      expect(isValid(pattern)).toBe(true);
    }
  });

  it("snare patterns are the right length and only use valid tokens", () => {
    for (const pattern of SNARE_PATTERNS) {
      expect(pattern).toHaveLength(STEP_COUNTS.snare);
      expect(isValid(pattern)).toBe(true);
    }
  });

  it("hat patterns are the right length and only use valid tokens", () => {
    for (const pattern of HAT_PATTERNS) {
      expect(pattern).toHaveLength(STEP_COUNTS.hat);
      expect(isValid(pattern)).toBe(true);
    }
  });

  it("keeps the grid (subdivisions) PlayButton expects", () => {
    expect(SUBDIVISIONS).toEqual({ kick: "8n", snare: "2n", hat: "4n" });
  });

  it("includes the current PlayButton pattern for each instrument", () => {
    expect(KICK_PATTERNS).toContainEqual(CURRENT.kick);
    expect(SNARE_PATTERNS).toContainEqual(CURRENT.snare);
    expect(HAT_PATTERNS).toContainEqual(CURRENT.hat);
  });

  it("offers more than one variation per instrument", () => {
    expect(KICK_PATTERNS.length).toBeGreaterThan(1);
    expect(SNARE_PATTERNS.length).toBeGreaterThan(1);
    expect(HAT_PATTERNS.length).toBeGreaterThan(1);
  });
});

describe("PATTERN_SETS", () => {
  it("reports a count that matches the array", () => {
    expect(PATTERN_SET_COUNT).toBe(PATTERN_SETS.length);
    expect(PATTERN_SET_COUNT).toBeGreaterThan(0);
  });

  it("set 0 reproduces the current groove exactly", () => {
    expect(PATTERN_SETS[0]).toEqual(CURRENT);
  });

  it("every set is internally drop-in valid", () => {
    for (const set of PATTERN_SETS) {
      expect(set.kick).toHaveLength(STEP_COUNTS.kick);
      expect(set.snare).toHaveLength(STEP_COUNTS.snare);
      expect(set.hat).toHaveLength(STEP_COUNTS.hat);
      expect(isValid(set.kick)).toBe(true);
      expect(isValid(set.snare)).toBe(true);
      expect(isValid(set.hat)).toBe(true);
    }
  });
});

describe("selectPatternSet", () => {
  it("defaults to the current groove when called with no index", () => {
    expect(selectPatternSet()).toEqual(CURRENT);
  });

  it("is deterministic for a given index", () => {
    expect(selectPatternSet(2)).toEqual(selectPatternSet(2));
  });

  it("returns valid drop-in arrays for any index, wrapping out of range", () => {
    // Cover in-range, far out of range, and negative indices.
    for (let i = -50; i <= 50; i++) {
      const set = selectPatternSet(i);
      expect(set.kick).toHaveLength(STEP_COUNTS.kick);
      expect(set.snare).toHaveLength(STEP_COUNTS.snare);
      expect(set.hat).toHaveLength(STEP_COUNTS.hat);
      expect(isValid(set.kick)).toBe(true);
      expect(isValid(set.snare)).toBe(true);
      expect(isValid(set.hat)).toBe(true);
    }
  });

  it("wraps modulo the set count", () => {
    expect(selectPatternSet(PATTERN_SET_COUNT)).toEqual(selectPatternSet(0));
    expect(selectPatternSet(-1)).toEqual(
      selectPatternSet(PATTERN_SET_COUNT - 1),
    );
  });

  it("returns fresh arrays that do not mutate the module patterns", () => {
    const set = selectPatternSet(0);
    set.kick[0] = "mutated";
    expect(PATTERN_SETS[0].kick[0]).toBe("C4");
    expect(selectPatternSet(0).kick[0]).toBe("C4");
  });
});

describe("pickFill", () => {
  it("every fill is a valid drop-in hat-grid pattern", () => {
    for (const fill of FILLS) {
      expect(fill).toHaveLength(STEP_COUNTS.hat);
      expect(isValid(fill)).toBe(true);
    }
  });

  it("always returns a valid hat-grid fill", () => {
    for (let i = 0; i < 100; i++) {
      const fill = pickFill();
      expect(fill).toHaveLength(STEP_COUNTS.hat);
      expect(isValid(fill)).toBe(true);
    }
  });
});
