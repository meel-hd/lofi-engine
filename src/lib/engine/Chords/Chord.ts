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

    generateVoicing(size) {
        // Upper voices above the root (intervals[0] is the root at 0). For
        // size < 3 this still yields a sane minimal voicing (root + whatever
        // upper voices fit), so no special-casing is needed.
        let voicing = this.intervals.slice(1,size);
        // Fisher–Yates shuffle: an unbiased randomization of the spread
        // (sort(() => Math.random()-0.5) is non-uniform).
        for(let i = voicing.length-1; i > 0; i--) {
            const j = Math.floor(Math.random()*(i+1));
            [voicing[i], voicing[j]] = [voicing[j], voicing[i]];
        }
        // Stack each voice above the previous so the voicing ascends.
        for(let i = 1; i<voicing.length; i++) {
            while(voicing[i] < voicing[i-1]){
                voicing[i] += 12;
            }
        }
        voicing.unshift(0);
        return voicing;
    }
}

export default Chord;
