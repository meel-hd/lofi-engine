import * as Tone from 'tone';

const samplePath = `/assets/engine/DrumSamples/hat.mp3`;
const samples = {C4: samplePath};

const lpf = new Tone.Filter(2400, "lowpass");
const vol = new Tone.Volume(-9);
const sw = new Tone.StereoWidener(0.7);

class Hat {
	constructor(cb) {
		this.sampler = new Tone.Sampler(samples, () => {
			cb();
		}).chain(lpf,vol,sw,Tone.Master);
	}

	sampler() {
		return this.sampler;
	}
}

export default Hat;