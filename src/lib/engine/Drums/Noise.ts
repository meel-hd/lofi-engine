import * as Tone from 'tone';

const lpf = new Tone.Filter(2000, "lowshelf");
const vol = new Tone.Volume(-32);
const noise = new Tone.Noise("pink").chain(lpf,vol,Tone.Master);

export default noise;