/**
 * Drum-pattern library for the procedural lofi engine (GEN-5).
 *
 * PlayButton drives kick/snare/hat as `Tone.Sequence`s whose event arrays are
 * string tokens. Today those arrays are hard-coded and never change between
 * sections; this module provides a small set of musically-safe VARIATIONS plus
 * a pure selector so sections can vary their groove while staying drop-in
 * compatible with the existing sequences.
 *
 * Token convention (identical for all three instruments):
 *   "C4" — a hit (the sampler is keyed on C4)
 *   "."  — a ghost / optional hit: the consuming callback triggers it at a low
 *          probability and maps it to "C4" (this is exactly what PlayButton's
 *          kick callback already does for "."). Snare/hat callbacks that pass
 *          the raw token to `triggerAttack` must map "." -> "C4" the same way
 *          when these patterns are wired in.
 *   ""   — a rest (no trigger).
 *
 * Grid (must match PlayButton so patterns are drop-in compatible):
 *   kick  — 16 steps at "8n" (two bars of 4/4)
 *   snare —  2 steps at "2n" (one bar; the backbeat lands on step 1 = beat 3)
 *   hat   —  8 steps at "4n" (two bars; one hit per quarter)
 */

/** The only tokens any pattern may contain. */
export const VALID_TOKENS = ["C4", ".", ""] as const;
export type DrumToken = (typeof VALID_TOKENS)[number];

/** Step count per instrument — kept identical to PlayButton's sequences. */
export const STEP_COUNTS = { kick: 16, snare: 2, hat: 8 } as const;

/** Tone.Sequence subdivision per instrument — kept identical to PlayButton. */
export const SUBDIVISIONS = { kick: "8n", snare: "2n", hat: "4n" } as const;

/** A coherent groove: one kick, one snare and one hat pattern that fit together. */
export interface DrumPatternSet {
    kick: string[];
    snare: string[];
    hat: string[];
}

/**
 * Kick variations (16 steps @ "8n"). Index 0 is the CURRENT PlayButton kick,
 * so the new behaviour is a strict superset of the old one.
 */
export const KICK_PATTERNS: string[][] = [
    // 0: classic boom-bap (CURRENT) — 1, the "&" of 4, the downbeat of bar 2,
    //    plus a ghost pickup.
    ["C4", "", "", "", "", "", "", "C4", "C4", "", ".", "", "", "", "", ""],
    // 1: steady downbeats — kick on beats 1 and 3 of each bar.
    ["C4", "", "", "", "C4", "", "", "", "C4", "", "", "", "C4", "", "", ""],
    // 2: syncopated push — 1 and the "& of 2" in each bar, with a ghost lead-in.
    ["C4", "", "", "C4", "", "", "", ".", "C4", "", "", "C4", "", "", "", ""],
    // 3: sparse / late-night — just the downbeats, framed by ghost pickups.
    ["C4", "", "", "", "", "", "", ".", "C4", "", "", "", "", "", ".", ""],
];

/**
 * Snare variations (2 steps @ "2n"). The two-step grid keeps the backbeat on
 * step 1 (beat 3); variation lives in the optional ghost on step 0. Index 0 is
 * the CURRENT PlayButton snare.
 */
export const SNARE_PATTERNS: string[][] = [
    // 0: classic backbeat (CURRENT).
    ["", "C4"],
    // 1: ghost pickup into the backbeat.
    [".", "C4"],
    // 2: soft / optional backbeat — for breakdown or ambient sections.
    ["", "."],
];

/**
 * Hat variations (8 steps @ "4n"). Index 0 is the CURRENT PlayButton hat
 * (steady quarters).
 */
export const HAT_PATTERNS: string[][] = [
    // 0: steady quarter-note hats (CURRENT).
    ["C4", "C4", "C4", "C4", "C4", "C4", "C4", "C4"],
    // 1: offbeats — hats on beats 2 and 4 of each bar.
    ["", "C4", "", "C4", "", "C4", "", "C4"],
    // 2: swung feel — solid on 1 & 3, ghosted on 2 & 4.
    ["C4", ".", "C4", ".", "C4", ".", "C4", "."],
    // 3: half-time — hats only on beats 1 and 3 of each bar.
    ["C4", "", "C4", "", "C4", "", "C4", ""],
];

/**
 * Curated, coherent grooves. Each set pairs a kick/snare/hat that sit well
 * together. Set 0 reproduces the CURRENT PlayButton groove exactly, so it is a
 * safe default and the behaviour stays a superset of today's.
 */
export const PATTERN_SETS: DrumPatternSet[] = [
    // 0: CURRENT — exactly what PlayButton plays today.
    { kick: KICK_PATTERNS[0], snare: SNARE_PATTERNS[0], hat: HAT_PATTERNS[0] },
    // 1: steady groove — four-feel kick, backbeat, offbeat hats.
    { kick: KICK_PATTERNS[1], snare: SNARE_PATTERNS[0], hat: HAT_PATTERNS[1] },
    // 2: swung lofi — syncopated kick, ghost-pickup snare, swung hats.
    { kick: KICK_PATTERNS[2], snare: SNARE_PATTERNS[1], hat: HAT_PATTERNS[2] },
    // 3: late-night — sparse kick, soft backbeat, half-time hats.
    { kick: KICK_PATTERNS[3], snare: SNARE_PATTERNS[2], hat: HAT_PATTERNS[3] },
    // 4: bounce — current kick reworked with a ghost snare and swung hats.
    { kick: KICK_PATTERNS[0], snare: SNARE_PATTERNS[1], hat: HAT_PATTERNS[2] },
];

/** Number of coherent grooves available to `selectPatternSet`. */
export const PATTERN_SET_COUNT = PATTERN_SETS.length;

/**
 * Short, drop-in fills on the hat grid (8 steps @ "4n") for use at a section
 * boundary. Each is a valid hat pattern, so it can swap into the hat sequence
 * for the final bar of a section. Exported for deterministic testing.
 */
export const FILLS: string[][] = [
    // gap-then-roll: leaves space, then drives into the new section.
    ["C4", "", "C4", "C4", "C4", "C4", "C4", "C4"],
    // building roll using ghosts that firm up toward the downbeat.
    ["C4", ".", "C4", ".", "C4", "C4", "C4", "C4"],
    // steady run — busy but safe.
    ["C4", "C4", "C4", "C4", "C4", "C4", "C4", "C4"],
];

/**
 * Return one coherent groove. PURE and deterministic given `index`:
 *   - no argument        -> the default (CURRENT) groove, set 0
 *   - any integer index  -> wraps into range (negatives included), so callers
 *                           can pass a section counter without bounds-checking
 * Returns fresh arrays so callers cannot mutate the module-level patterns.
 */
export function selectPatternSet(index?: number): DrumPatternSet {
    const set =
        index === undefined
            ? PATTERN_SETS[0]
            : PATTERN_SETS[
                  ((Math.trunc(index) % PATTERN_SET_COUNT) + PATTERN_SET_COUNT) %
                      PATTERN_SET_COUNT
              ];
    return {
        kick: [...set.kick],
        snare: [...set.snare],
        hat: [...set.hat],
    };
}

/**
 * Convenience wrapper: pick a random fill for a section boundary. This is the
 * ONLY non-pure export — it calls `Math.random`. Use `FILLS` directly (or
 * `selectPatternSet`) anywhere determinism is required. Returns a fresh array.
 */
export function pickFill(): string[] {
    return [...FILLS[Math.floor(Math.random() * FILLS.length)]];
}
