import * as Tone from 'tone';

// Keep the bass soft and DARK so it sits under the piano/drums rather than
// competing with them: a gentle low-pass shaves the highs and a generous volume
// cut tucks it below the mix (GEN-2). Module-level nodes mirror Piano.ts/Kick.ts.
const lpf = new Tone.Filter(400, "lowpass");
const vol = new Tone.Volume(-14);

class Bass {
	synth: Tone.MonoSynth;
	constructor() {
		// A single sine-driven MonoSynth — no samples to load, so no callback.
		// Slow attack/release give a rounded, mellow lofi bass; the filter
		// envelope only opens a little, keeping it muted and warm.
		this.synth = new Tone.MonoSynth({
			oscillator: { type: "sine" },
			envelope: {
				attack: 0.04,
				decay: 0.3,
				sustain: 0.7,
				release: 1.2,
			},
			filterEnvelope: {
				attack: 0.05,
				decay: 0.2,
				sustain: 0.4,
				release: 1.4,
				baseFrequency: 120,
				octaves: 2.2,
			},
		}).chain(lpf, vol, Tone.getDestination());
	}
}

export default Bass;
