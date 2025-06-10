const letters = ["A","C","D#","F#"];
const octaves = [1, 2, 3, 4, 5, 6];
const samplePath = `assets/engine/PianoSamples/`;
const velocity = 1;

const notes = [];

letters.forEach(letter => {
    octaves.forEach(octave => {
        notes.push(letter+octave);
    });
});

const samples = {};

notes.forEach(note => {
    let noteFilename = note;
    if(note.includes("#")) {
        noteFilename = note.replace("#","sharp");
    }
    samples[note] = `${samplePath+noteFilename}v${velocity}.mp3`;
});

export default samples;