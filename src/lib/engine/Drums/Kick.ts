import * as Tone from 'tone';

const samplePath = `assets/engine/DrumSamples/kick.mp3`;
const samples = {C4: samplePath};

const vol = new Tone.Volume(-3);

class Kick {
	sampler: Tone.Sampler;
	constructor(cb) {
		this.sampler = new Tone.Sampler(samples, () => {
			cb();
		}).chain(vol,Tone.getDestination());
	}
}

export default Kick;