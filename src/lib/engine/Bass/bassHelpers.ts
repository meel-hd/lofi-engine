/**
 * Pure, Tone-free helpers for the bass line (GEN-2).
 *
 * The engine asks for the bass hits of a SINGLE bar as semitone offsets from
 * the chord ROOT. PlayButton owns the actual pitch: it takes a low root (e.g.
 * `Tone.Frequency(key + "2").transpose(chord.semitoneDist)`), transposes it by
 * each `interval`, and schedules `synth.triggerAttackRelease(note, duration, time)`
 * at the hit's bar-relative `time`.
 *
 * Intervals are restricted to consonant, chord-safe choices so the line stays
 * musical under ANY chord without needing to know the chord quality:
 *   0  = root, 7 = perfect fifth, 12 = octave.
 */

export interface BassHit {
	/** Semitones above the chord root. One of {@link ALLOWED_BASS_INTERVALS}. */
	interval: number;
	/** Bar-relative Tone time, "bars:beats:sixteenths" (e.g. "0:0", "0:2"). */
	time: string;
	/** Tone duration string (e.g. "2n"). */
	duration: string;
}

// The only intervals a bar pattern may use — consonant under any chord.
export const ALLOWED_BASS_INTERVALS = [0, 7, 12] as const;

// A small bank of one-bar patterns. Every pattern lands the root on beat 1 so
// the harmony is always anchored, then adds a gentle move on beat 3.
const BAR_PATTERNS: ReadonlyArray<ReadonlyArray<BassHit>> = [
	// Root → fifth: the classic lofi half-note walk.
	[
		{ interval: 0, time: "0:0", duration: "2n" },
		{ interval: 7, time: "0:2", duration: "2n" },
	],
	// Root → octave lift for a touch of lift in the second half.
	[
		{ interval: 0, time: "0:0", duration: "2n" },
		{ interval: 12, time: "0:2", duration: "2n" },
	],
	// Steady root pulse — sits back and holds the low end down.
	[
		{ interval: 0, time: "0:0", duration: "2n" },
		{ interval: 0, time: "0:2", duration: "2n" },
	],
];

/**
 * Return the bass hits for one bar as offsets from the chord root.
 *
 * Deterministic: the same `index` always yields the same pattern, so it is
 * trivially unit-testable. `index` selects a pattern (wrapping around the bank)
 * which lets the caller vary the line per bar/section while staying musical.
 * Returns fresh hit objects so callers can't mutate the shared pattern bank.
 */
export function bassHitsForBar(index = 0): BassHit[] {
	if (BAR_PATTERNS.length === 0)
		return [];
	const i = ((Math.floor(index) % BAR_PATTERNS.length) + BAR_PATTERNS.length) % BAR_PATTERNS.length;
	return BAR_PATTERNS[i].map((hit) => ({ ...hit }));
}
