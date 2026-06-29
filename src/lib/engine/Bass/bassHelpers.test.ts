import { describe, it, expect } from "vitest";
import { bassHitsForBar, ALLOWED_BASS_INTERVALS } from "./bassHelpers";

// Convert a Tone "bars:beats:sixteenths" string into an absolute beat position
// so we can compare ordering and check a hit falls inside a single 4-beat bar.
function toBeats(time: string): number {
	const [bars = "0", beats = "0", sixteenths = "0"] = time.split(":");
	return Number(bars) * 4 + Number(beats) + Number(sixteenths) / 4;
}

// Sample a spread of indices, including negatives and out-of-range values that
// the wrap-around must still handle.
const INDICES = [-5, -1, 0, 1, 2, 3, 4, 7, 100];

describe("bassHitsForBar", () => {
	it("returns at least one hit for every index", () => {
		for (const idx of INDICES) {
			expect(bassHitsForBar(idx).length).toBeGreaterThan(0);
		}
	});

	it("every hit has a valid shape", () => {
		for (const idx of INDICES) {
			for (const hit of bassHitsForBar(idx)) {
				expect(typeof hit.interval).toBe("number");
				expect(typeof hit.time).toBe("string");
				expect(typeof hit.duration).toBe("string");
				expect(hit.time).toMatch(/^\d+:\d+(:\d+)?$/);
			}
		}
	});

	it("only uses allowed consonant intervals (0, 7, 12)", () => {
		for (const idx of INDICES) {
			for (const hit of bassHitsForBar(idx)) {
				expect(ALLOWED_BASS_INTERVALS).toContain(hit.interval);
			}
		}
	});

	it("anchors the bar with a root note on beat 1", () => {
		for (const idx of INDICES) {
			const first = bassHitsForBar(idx)[0];
			expect(first.interval).toBe(0);
			expect(toBeats(first.time)).toBe(0);
		}
	});

	it("keeps hit times non-decreasing and within one bar", () => {
		for (const idx of INDICES) {
			const hits = bassHitsForBar(idx);
			let prev = -1;
			for (const hit of hits) {
				const beat = toBeats(hit.time);
				expect(beat).toBeGreaterThanOrEqual(0);
				expect(beat).toBeLessThan(4); // one 4/4 bar
				expect(beat).toBeGreaterThanOrEqual(prev); // non-decreasing
				prev = beat;
			}
		}
	});

	it("is deterministic and wraps the pattern bank", () => {
		expect(bassHitsForBar(0)).toEqual(bassHitsForBar(0));
		// The bank has 3 patterns, so index 3 wraps back to index 0.
		expect(bassHitsForBar(3)).toEqual(bassHitsForBar(0));
		// Negative indices wrap too: -1 maps to the last pattern (index 2).
		expect(bassHitsForBar(-1)).toEqual(bassHitsForBar(2));
	});

	it("returns independent copies that callers can't use to mutate the bank", () => {
		const a = bassHitsForBar(0);
		a[0].interval = 99;
		// A fresh call is unaffected by the mutation above.
		expect(bassHitsForBar(0)[0].interval).toBe(0);
	});
});
