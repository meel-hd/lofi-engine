import * as Tone from 'tone';
import Samples from './Samples';

const lpf = new Tone.Filter(1000, "lowpass");
const sw = new Tone.StereoWidener(0.5);

class Piano {
	constructor(cb) {
		this.sampler = new Tone.Sampler(Samples, () => {
			cb();
		}).chain(lpf,sw,Tone.Master);
	}

	sampler() {
		return this.sampler;
	}
}

export default Piano;