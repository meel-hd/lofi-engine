import * as Tone from 'tone';

const samplePath = `/assets/engine/DrumSamples/snare.mp3`;
const samples = {C4: samplePath};

const lpf = new Tone.Filter(6000, "lowpass");
const vol = new Tone.Volume(-6);
const sw = new Tone.StereoWidener(0.3);

class Snare {
	constructor(cb) {
		this.sampler = new Tone.Sampler(samples, () => {
			cb();
		}).chain(lpf,vol,sw,Tone.Master);
	}

	sampler() {
		return this.sampler;
	}
}

export default Snare;