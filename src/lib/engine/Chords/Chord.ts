import { singleOct } from './MajorScale';

class Chord {
    degree: number;
    semitoneDist: number;
    intervals: number[];
    nextChordIdxs: number[];

    constructor(degree,intervals,nextChordIdxs) {
        this.degree = degree;
        this.semitoneDist = singleOct[degree-1];
        this.intervals = intervals;
        this.nextChordIdxs = nextChordIdxs;
    }

    nextChordIdx() {
        return this.nextChordIdxs[Math.floor(Math.random()*this.nextChordIdxs.length)];
    }

    generateVoicing(size, opts: { invert?: boolean; extend?: boolean } = {}) {
        const { invert = false, extend = false } = opts;

        // The chord tones for this voicing: the root (intervals[0] is at 0)
        // and the next size-1 tones above it. For size < 3 this still yields a
        // sane minimal voicing (root + whatever tones fit), so no special-casing.
        let tones = this.intervals.slice(0,size);

        // Optionally fold in a higher diatonic extension (9th/11th/13th) that
        // already lives beyond `size` in the chord's own intervals. The caller
        // opts in occasionally so chords aren't always fully extended.
        if(extend && this.intervals.length > size) {
            const extIdx = size + Math.floor(Math.random()*(this.intervals.length - size));
            tones.push(this.intervals[extIdx]);
        }

        // The root sits in the bass by default. For an inversion a non-root
        // chord tone is the lowest note instead — a separate bass instrument
        // still carries the root, so an inverted upper voicing stays musical.
        let bass = tones[0];
        let voicing;
        if(invert && tones.length > 1) {
            const k = 1 + Math.floor(Math.random()*(tones.length-1));
            bass = tones[k] % 12;
            voicing = [...tones.slice(0,k), ...tones.slice(k+1)];
        } else {
            voicing = tones.slice(1);
        }

        // Fisher–Yates shuffle: an unbiased randomization of the spread
        // (sort(() => Math.random()-0.5) is non-uniform).
        for(let i = voicing.length-1; i > 0; i--) {
            const j = Math.floor(Math.random()*(i+1));
            [voicing[i], voicing[j]] = [voicing[j], voicing[i]];
        }
        // Stack each voice above the previous so the voicing ascends from the bass.
        for(let i = 0; i<voicing.length; i++) {
            const floor = i === 0 ? bass : voicing[i-1];
            while(voicing[i] < floor){
                voicing[i] += 12;
            }
        }
        voicing.unshift(bass);
        return voicing;
    }

    pickVelocity() {
        // A little loudness variation so chords don't all hit at the same level.
        return 0.6 + Math.random()*0.3;
    }
}

export default Chord;
