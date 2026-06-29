import { fiveToFive } from './MajorScale';

const mod12 = (n) => ((n % 12) + 12) % 12;

/**
 * Pick an index from a list of (relative) weights using a random value in
 * [0, 1). Returns -1 for an empty list and is otherwise always within
 * [0, weights.length - 1] — the final bucket acts as a fallback so the search
 * can never run past the end of the array. This is the bounded, pure version
 * of PlayButton's melody weighted-picker and locks in the fix for BUG-1
 * (an empty `scale` used to yield empty `weights` and an infinite loop).
 */
export function pickWeightedIndex(weights, randomValue) {
    if(weights.length === 0)
        return -1;
    const sum = weights.reduce((prev, curr) => prev + curr, 0);
    let cumulative = 0;
    for(let i = 0; i < weights.length - 1; i++) {
        cumulative += weights[i] / sum;
        if(randomValue <= cumulative)
            return i;
    }
    // Last bucket is the fallback (also covers sum === 0 -> NaN comparisons).
    return weights.length - 1;
}

/**
 * Pitch classes (0-11, relative to the tonic) of a chord's tones, derived from
 * its root offset within the key plus each chord interval.
 */
export function chordTonePitchClasses(chord) {
    const set = new Set();
    for(const interval of chord.intervals) {
        set.add(mod12(chord.semitoneDist + interval));
    }
    return set;
}

/**
 * Given a target scale position (index into `fiveToFive`), return the nearest
 * scale position whose pitch class is a chord tone of `chord`, searching no
 * further than `maxStep` degrees away. Returns the original position if it is
 * already a chord tone, or -1 if none is found within range (or no chord is
 * given). Keeps melody movement subtle and diatonic (GEN-1).
 */
export function nearestChordToneScalePos(pos, chord, maxStep = 2) {
    if(!chord)
        return -1;
    const tones = chordTonePitchClasses(chord);
    const inScale = (i) => i >= 0 && i < fiveToFive.length;
    const isTone = (i) => tones.has(mod12(fiveToFive[i]));
    if(inScale(pos) && isTone(pos))
        return pos;
    for(let step = 1; step <= maxStep; step++) {
        if(inScale(pos - step) && isTone(pos - step))
            return pos - step;
        if(inScale(pos + step) && isTone(pos + step))
            return pos + step;
    }
    return -1;
}
