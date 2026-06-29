<script lang="ts">
  import {
      IconLoader,
      IconPlayerPauseFilled,
      IconPlayerPlayFilled,
      IconRefresh,
  } from "@tabler/icons-svelte";
  import { onDestroy, onMount } from "svelte";
// @ts-ignore
  import * as Tone from "tone";
  import Visualizer from "../lib/components/Visualizer/index.svelte";
  import ChordProgression from "../lib/engine/Chords/ChordProgression";
  import intervalWeights from "../lib/engine/Chords/IntervalWeights";
  import {
      nearestChordToneScalePos,
      pickWeightedIndex,
  } from "../lib/engine/Chords/melodyHelpers";
  import Keys from "../lib/engine/Chords/Keys";
  import { fiveToFive } from "../lib/engine/Chords/MajorScale";
  import Hat from "../lib/engine/Drums/Hat";
  import Kick from "../lib/engine/Drums/Kick";
  import Noise from "../lib/engine/Drums/Noise";
  import Snare from "../lib/engine/Drums/Snare";
  import Piano from "../lib/engine/Piano/Piano";

  const STORAGE_KEY = "Volumes";
  const DEFFAULT_VOLUMES = {
    rain: 1,
    thunder: 1,
    campfire: 1,
    jungle: 1,
    main_track: 1,
  };
  // Load previous vols or default (guard against corrupt localStorage)
  let volumes;
  try {
    volumes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFFAULT_VOLUMES;
  } catch (e) {
    volumes = DEFFAULT_VOLUMES;
  }
  // Convert linear volume (0 to 1) to dB
  const linearToDb = (value) =>
    value === 0 ? -Infinity : 20 * Math.log10(value);

  // Resting cutoff of the master low-pass. Transitions dip below this and must
  // ramp back UP to it so the mix never gets permanently darker (GEN-8).
  const MASTER_LPF_BASE_CUTOFF = 2000;
  // Tempo / feel. NOTE: these still need listening-based tuning — they are
  // reasonable starting points, not final values (GEN-3).
  const BASE_BPM = 150; // lofi sits a touch lower; kept near the original 156
  const SWING_AMOUNT = 0.5; // was 1.0 (max) — too extreme; ~0.5 is a gentler shuffle
  // How likely a resolved melody note is pulled onto a chord tone (GEN-1).
  const CHORD_TONE_PULL = 0.5;

  // Setup audio chain
  const cmp = new Tone.Compressor({
    threshold: -6,
    ratio: 3,
    attack: 0.5,
    release: 0.1,
  });
  const lpf = new Tone.Filter(MASTER_LPF_BASE_CUTOFF, "lowpass");
  const vol = new Tone.Volume(linearToDb(volumes.main_track));
  Tone.getDestination().chain(cmp, lpf, vol);
  Tone.Transport.bpm.value = BASE_BPM;
  Tone.Transport.swing = SWING_AMOUNT;

  // State variables
  let key = "C";
  let progression = [];
  let scale = [];
  let progress = 0;
  let scalePos = 0;

  let pianoLoaded = false;
  let kickLoaded = false;
  let snareLoaded = false;
  let hatLoaded = false;

  let genChordsOnce = false;

  let kickOff = false;
  let snareOff = false;
  let hatOff = false;
  let melodyDensity = 0.33;
  let melodyOff = false;

  let isPlaying = false;
  let autoDJMode = "MUSIC";

  // Initialize instruments
  const pn = new Piano(() => (pianoLoaded = true)).sampler;
  const kick = new Kick(() => (kickLoaded = true)).sampler;
  const snare = new Snare(() => (snareLoaded = true)).sampler;
  const hat = new Hat(() => (hatLoaded = true)).sampler;
  const noise = Noise;

  // Sequences
  let chords, melody, kickLoop, snareLoop, hatLoop;
  // Volume-poll interval id (cleared in onDestroy — PERF-2 / BUG-9)
  let volumeInterval;

  onMount(() => {
    // Setup sequences
    chords = new Tone.Sequence(
      (time, note) => {
        playChord();
      },
      [""],
      "1n",
    );

    melody = new Tone.Sequence(
      (time, note) => {
        playMelody();
      },
      [""],
      "8n",
    );

    kickLoop = new Tone.Sequence(
      (time, note) => {
        if (!kickOff) {
          if (note === "C4" && Math.random() < 0.9) {
            // @ts-ignore
            kick.triggerAttack(note);
          } else if (note === "." && Math.random() < 0.1) {
            // @ts-ignore
            kick.triggerAttack("C4");
          }
        }
      },
      ["C4", "", "", "", "", "", "", "C4", "C4", "", ".", "", "", "", "", ""],
      "8n",
    );

    snareLoop = new Tone.Sequence(
      (time, note) => {
        if (!snareOff) {
          if (note !== "" && Math.random() < 0.8) {
            // @ts-ignore
            snare.triggerAttack(note);
          }
        }
      },
      ["", "C4"],
      "2n",
    );

    hatLoop = new Tone.Sequence(
      (time, note) => {
        if (!hatOff) {
          // @ts-ignore
          if (note !== "" && Math.random() < 0.8) {
            // @ts-ignore
            hat.triggerAttack(note);
          }
        }
      },
      ["C4", "C4", "C4", "C4", "C4", "C4", "C4", "C4"],
      "4n",
    );

    chords.humanize = true;
    melody.humanize = true;
    kickLoop.humanize = true;
    snareLoop.humanize = true;
    hatLoop.humanize = true;

    // Listen for spacebar press. Route through handleButtonAction so the same
    // load/generation guards the play button enforces also apply to Space
    // (CRIT-1 — calling toggle() directly during sample load crashes/freezes).
    const handleKeydown = (e) => {
      if (e.code === "Space") {
        const target = e.target;
        const isTyping =
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable);
        // Don't hijack Space while the user is typing.
        if (isTyping) return;
        e.preventDefault();
        handleButtonAction();
      }
    };

    const handleCustomToggle = () => {
      handleButtonAction();
    };

    const handleAutoDJModeChange = (e) => {
      autoDJMode = e.detail.mode;
    };

    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("lofi-toggle-play", handleCustomToggle);
    window.addEventListener("auto-dj-mode-changed", handleAutoDJModeChange);

    // Initialize mode
    autoDJMode = localStorage.getItem("AutoDJMode") || "MUSIC";

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("lofi-toggle-play", handleCustomToggle);
      window.removeEventListener("auto-dj-mode-changed", handleAutoDJModeChange);
    };
  });

  onDestroy(() => {
    // Stop the volume-poll interval (PERF-2).
    if (volumeInterval) clearInterval(volumeInterval);
    if (Tone.Transport.state === "started") {
      noise.stop();
      Tone.Transport.stop();
    }
    // Dispose the sequences so their scheduled events are released (BUG-9).
    [chords, melody, kickLoop, snareLoop, hatLoop].forEach((seq) => {
      if (seq) {
        seq.stop();
        seq.dispose();
      }
    });
  });

  let barCount = 0;
  let sectionBarLength = 32; // change section every 32 bars
  let isTransitioning = false;

  function nextChord() {
    const nextProgress = progress === progression.length - 1 ? 0 : progress + 1;
    const nextKickOff = Math.random() < 0.15;
    const nextSnareOff = Math.random() < 0.2;
    const nextHatOff = Math.random() < 0.25;
    const nextMelodyDensity = Math.random() * 0.3 + 0.2;
    const nextMelodyOff = Math.random() < 0.25;

    // Section boundaries derived from the progression length (BUG-7): the
    // midpoint refreshes drums, the start refreshes drums + melody.
    const midpoint = Math.floor(progression.length / 2);

    if (progress === midpoint) {
      progress = nextProgress;
      kickOff = nextKickOff;
      snareOff = nextSnareOff;
      hatOff = nextHatOff;
    } else if (progress === 0) {
      progress = nextProgress;
      kickOff = nextKickOff;
      snareOff = nextSnareOff;
      hatOff = nextHatOff;
      melodyDensity = nextMelodyDensity;
      melodyOff = nextMelodyOff;
    } else {
      progress = nextProgress;
    }
    barCount++;
    if(barCount >= sectionBarLength) {
      barCount = 0;
      autoDJTransition();
      // New next transition length
      const barLengthOptions = [16, 20, 24, 28, 32, 48];
      sectionBarLength = barLengthOptions[Math.floor(Math.random() * barLengthOptions.length)];
    }
  }

  function autoDJTransition() {
    if(isTransitioning) return; // Prevent overlaps
    if(autoDJMode === "MANUAL") return;

    isTransitioning = true;

    // Change keys/chords
    generateProgression()

    // GEN-3: drift the tempo a few BPM per section for variety (kept subtle).
    const bpmDrift = Math.floor(Math.random() * 7) - 3; // -3..+3
    Tone.Transport.bpm.rampTo(BASE_BPM + bpmDrift, 2);

    // Original Instrument Logic (Applied in ALL active modes: MUSIC, ATMOSPHERE, WORLD)
    // This was the "current main lofi track generation"
    melodyDensity = 0.2 + Math.random() * 0.5;
    kickOff = Math.random() < 0.13;
    snareOff = Math.random() < 0.17;
    hatOff = Math.random() < 0.22;
    melodyOff = Math.random() < 0.25;

    // Smart Effects: Toggle environmental effects randomly
    // Applied in ATMOSPHERE and WORLD
    if (autoDJMode === "ATMOSPHERE" || autoDJMode === "WORLD") {
      const effects = ["rain", "thunder", "jungle", "campfire"];
      // 30% chance to toggle an effect
      if (Math.random() < 0.3) {
        const effect = effects[Math.floor(Math.random() * effects.length)];
        window.dispatchEvent(new CustomEvent(`lofi-toggle-${effect}`));
      }
    }

    // Smart Tracks: Toggle tracks randomly
    // Applied ONLY in WORLD
    if (autoDJMode === "WORLD") {
      // 20% chance to toggle a track
      if (Math.random() < 0.2) {
        const trackId = Math.floor(Math.random() * 9) + 1; // 1-9
        window.dispatchEvent(new CustomEvent("lofi-toggle-track", { detail: { id: trackId } }));
      }
    }

    // Crossfade FX (Always apply for smoother transitions if not OFF)
    lpf.frequency.linearRampTo(300, 2) // 2s Muffle
    setTimeout(() => {
      // Restore the full base cutoff so the mix doesn't stay darker (GEN-8).
      lpf.frequency.linearRampTo(MASTER_LPF_BASE_CUTOFF, 2) // Open back up
      setTimeout(() => {
        isTransitioning = false;
      }, 2000);
    }, 2000);
  }

  function playChord() {
    // Defensive: nothing to play before a progression has been generated (BUG-1).
    if (progression.length === 0 || scale.length === 0) {
      return;
    }
    const chord = progression[progress];
    const root = Tone.Frequency(key + "3").transpose(chord.semitoneDist);
    const size = 4;
    const voicing = chord.generateVoicing(size);
    const notes = Tone.Frequency(root)
      .harmonize(voicing)
      .map((f) => Tone.Frequency(f).toNote());
    // @ts-ignore
    pn.triggerAttackRelease(notes, "1n");
    nextChord();
  }

  function playMelody() {
    // Defensive: nothing to walk before a scale/progression exists (BUG-1 —
    // an empty scale used to drive the weighted picker into an infinite loop).
    if (progression.length === 0 || scale.length === 0) {
      return;
    }
    if (melodyOff || !(Math.random() < melodyDensity)) {
      return;
    }

    const descendRange = Math.min(scalePos, 7) + 1;
    const ascendRange = Math.min(scale.length - scalePos, 7);

    let descend = descendRange > 1;
    let ascend = ascendRange > 1;

    if (descend && ascend) {
      if (Math.random() > 0.5) {
        ascend = !descend;
      } else {
        descend = !ascend;
      }
    }

    const weights = descend
      ? intervalWeights.slice(0, descendRange)
      : intervalWeights.slice(0, ascendRange);

    // Bounded weighted pick: returns -1 for empty weights and never runs past
    // the array end (BUG-1).
    const scaleDist = pickWeightedIndex(weights, Math.random());
    if (scaleDist < 0) {
      return;
    }

    const scalePosChange = descend ? -scaleDist : scaleDist;
    let newScalePos = scalePos + scalePosChange;

    // GEN-1: occasionally pull the resolved note onto a chord tone of the
    // current chord so the melody outlines the harmony (subtle + diatonic).
    if (Math.random() < CHORD_TONE_PULL) {
      const snapped = nearestChordToneScalePos(newScalePos, progression[progress]);
      if (snapped >= 0) {
        newScalePos = snapped;
      }
    }
    // Keep the walk in-bounds regardless of any nudge.
    newScalePos = Math.max(0, Math.min(scale.length - 1, newScalePos));

    scalePos = newScalePos;
    // @ts-ignore
    pn.triggerAttackRelease(scale[newScalePos], "2n");
  }

  function generateProgression() {
    const _scale = fiveToFive;
    const newKey = Keys[Math.floor(Math.random() * Keys.length)];
    const newScale = Tone.Frequency(newKey + "5")
      .harmonize(_scale)
      .map((f) => Tone.Frequency(f).toNote());
    const newProgression = ChordProgression.generate(8);
    const newScalePos = Math.floor(Math.random() * _scale.length);

    key = newKey;
    progress = 0;
    progression = newProgression;
    scale = newScale;
    genChordsOnce = true;
    scalePos = newScalePos;
  }

  function toggle() {
    progress = 0;
    if (Tone.Transport.state === "started") {
      noise.stop();
      Tone.Transport.stop();
      isPlaying = false;
    } else {
      Tone.start();
      Tone.Transport.start();
      noise.start(0);
      chords.start(0);
      melody.start(0);
      kickLoop.start(0);
      snareLoop.start(0);
      hatLoop.start(0);
      isPlaying = true;
    }
    window.dispatchEvent(new CustomEvent("lofi-play-state-changed", { detail: { isPlaying } }));
  }

  $: allSamplesLoaded = pianoLoaded && kickLoaded && snareLoaded && hatLoaded;
  // Highlight the chord that is currently sounding (one behind `progress`,
  // which already points at the next chord). Derived from the actual
  // progression length rather than a hardcoded 8 (BUG-7).
  $: activeProgressionIndex =
    progression.length > 0
      ? (progress + progression.length - 1) % progression.length
      : 0;
  // Update volume
  onMount(() => {
    volumeInterval = setInterval(() => {
      let updatedVol;
      try {
        updatedVol =
          JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFFAULT_VOLUMES;
      } catch (e) {
        updatedVol = DEFFAULT_VOLUMES;
      }
      vol.volume.value = linearToDb(updatedVol.main_track);
    }, 100);
  });
  // Generate the first progression once samples are loaded so the preview
  // renders. The AudioContext is NOT started here — it is unlocked only from a
  // real user gesture via toggle()'s Tone.start() (BUG-6).
  $: if (allSamplesLoaded && !genChordsOnce) {
    generateProgression();
  }

  function handleButtonAction() {
    if (!allSamplesLoaded) {
      // Button is disabled until every sample has loaded.
      return;
    }
    // By the time samples are loaded the first progression has been generated,
    // so play/pause is the only remaining action (BUG-6).
    toggle();
  }
</script>

<div>
  <div class="controls">
    <button
      class="play-button"
      on:click={handleButtonAction}
      disabled={!allSamplesLoaded}
    >
      {#if !allSamplesLoaded}
        <IconLoader size={30} class="spinning" />
      {:else if isPlaying}
        <IconPlayerPauseFilled size={30} />
      {:else}
        <IconPlayerPlayFilled size={30} />
      {/if}
    </button>
    <button class="generateBtn glass" on:click={generateProgression}>
      <IconRefresh size={16} />
    </button>
  </div>

  {#if genChordsOnce}
    <ol class="progressionList">
      <li class="key" id="glass">{key}</li>
      {#each progression as chord, idx}
        <li id="glass" class={idx === activeProgressionIndex ? "live" : ""}>
          {chord.degree}
        </li>
      {/each}
    </ol>
  {/if}
  {#if Tone.Transport.state === "started"}
    <div class="visualizer-container">
      <Visualizer audio={Tone.getDestination()} />
    </div>
  {/if}
</div>

<style>
  .controls {
    position: fixed;
    bottom: 70px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }

  .play-button {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: white;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .play-button:hover {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  }

  .generateBtn {
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    outline: none;
  }

  .progressionList {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    list-style: none;
    padding: 0;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    z-index: 1;
  }

  .progressionList li {
    padding: 5px 10px;
    border-radius: 4px;
    color: white;
    border: 2px solid transparent;
  }

  .progressionList li.live {
    border-color:#ffffff66;
  }

  .visualizer-container {
    position: absolute;
    left: 30px;
    bottom: 30px;
    height: 180px;
    overflow: hidden;
    margin-top: 10px;
  }

  @media only screen and (max-width: 600px) {
    .play-button {
      margin-bottom: 40px;
    }
    .progressionList {
      bottom: 0;
      left: 0;
      width: 100vw;
      transform: scale(0.8);
    }
    .visualizer-container {
      display: none;
    }
  }
</style>
