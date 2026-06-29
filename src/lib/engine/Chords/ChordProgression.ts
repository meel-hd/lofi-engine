import Chords from './Chords';
import Chord from './Chord';

const TONIC_IDX = 0; // I
// Cadence targets in priority order for each of the final steps.
const DOMINANTS = [4, 6];        // V, then vii° (both resolve to I)
const PREDOMINANTS = [1, 3, 5];  // ii, IV, vi (set up the dominant)

// Pick the first target that is a *valid* next chord, otherwise fall back to
// the normal random transition. This biases toward a cadence without ever
// producing an invalid chord-to-chord move.
function preferTransitions(chord, targetIdxs) {
    for(const target of targetIdxs) {
        if(chord.nextChordIdxs.includes(target))
            return target;
    }
    return chord.nextChordIdx();
}

class ChordProgression {
    static generate(length) {
        if(length < 2)
            return null;

        const progression = [];
        let chord = Chords[Math.floor(Math.random()*Chords.length)];

        for(let i = 0; i < length; i++) {
            progression.push(new Chord(
                chord.degree,
                [...chord.intervals],
                [...chord.nextChordIdxs]));

            // GEN-6: steer the final few transitions toward a predominant ->
            // dominant -> tonic cadence so the phrase tends to resolve, while
            // only ever choosing a valid next chord (preferTransitions falls
            // back to a random valid move when the target isn't reachable).
            let nextIdx;
            if(i === length - 2) {
                nextIdx = preferTransitions(chord, [TONIC_IDX]); // resolve to I
            } else if(i === length - 3) {
                nextIdx = preferTransitions(chord, DOMINANTS);   // set up the V
            } else if(i === length - 4) {
                nextIdx = preferTransitions(chord, PREDOMINANTS); // pre-dominant
            } else {
                nextIdx = chord.nextChordIdx();
            }
            chord = Chords[nextIdx];
        }

        return progression;
    }
}

export default ChordProgression;
