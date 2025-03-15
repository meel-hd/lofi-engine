import Chord from './Chord';

const toChordIdxs = (arr) => arr.map(n => n-1);

const I = new Chord(
	1,
    [0,4,7,11,14,17,21],
    toChordIdxs([2,3,4,5,6,7])
);
const ii = new Chord(
	2,
    [0,3,7,10,14,17,21],
    toChordIdxs([3,5,7])
);
const iii = new Chord(
	3,
    [0,3,7,10,13,17,20],
    toChordIdxs([4,6])
);
const IV = new Chord(
	4,
    [0,4,7,11,14,18,21],
    toChordIdxs([2,5])
);
const V = new Chord(
	5,
    [0,4,7,10,14,17,21],
    toChordIdxs([1,3,6])
);
const vi = new Chord(
	6,
    [0,3,7,10,14,17,20],
    toChordIdxs([2,4])
);
const vii = new Chord(
	7,
    [0,3,6,10,13,17,20],
    toChordIdxs([1,3])
);

const Chords = [I,ii,iii,IV,V,vi,vii];

export default Chords;