<script lang="ts">
  import { IconMusic, IconX } from "@tabler/icons-svelte";
  // @ts-ignore Tone's browser audio types are broader than this component needs.
  import * as Tone from "tone";
  import { onMount } from "svelte";
  import { isEditableTarget } from "../../keyboard";
  import { t } from "../../locales/store";
  import { zen } from "../../focus/store";

  // Set true to show the trigger while debugging its position.
  const SHOW_TRACK_TRIGGER = false;

  // Ambient tracks shown in the radial selector.
  let tracks = [
    { id: 1, track: "Wind-Mark_DiAngelo-1940285615.mp3", isPlaying: false },
    { id: 2, track: "small-waves-onto-the-sand-143040.mp3", isPlaying: false },
    { id: 3, track: "night-ambience-17064.mp3", isPlaying: false },
    { id: 4, track: "urban-seagulls-30068.mp3", isPlaying: false },
    { id: 5, track: "office-ambience-6322.mp3", isPlaying: false },
    { id: 6, track: "city-ambience-9272.mp3", isPlaying: false },
    { id: 7, track: "old-server-turning-on-and-off-24540.mp3", isPlaying: false },
    { id: 8, track: "train-to-munich-germany.mp3", isPlaying: false },
    { id: 9, track: "underwater-white-noise-46423.mp3", isPlaying: false },
  ];

  // Keep generated audio elements so active tracks can be paused.
  let activeAudios = [];
  let trigger: HTMLButtonElement;
  let menuOpen = false;
  let isDragging = false;
  let pointerId: number | null = null;
  let selectedTrackId = 1;
  let hoveredTrackId: number | null = 1;
  let visualizerActive = false;
  // Screen position shared by the trigger and radial menu.
  let anchorX = 0;
  let anchorY = 0;

  function isClickableTarget(target: EventTarget | null) {
    return (
      target instanceof Element &&
      Boolean(
        target.closest(
          "button, a, input, select, textarea, dialog, .modal, [role='dialog'], [role='button'], [contenteditable='true']",
        ),
      )
    );
  }
  // Tone.js cues provide feedback for hover, cancel, and toggle states.
  let uiSynth: Tone.Synth | null = null;

  function playUiSound(kind: "select" | "cancel" | "toggle" | "off" | "close") {
    uiSynth ??= new Tone.Synth({
      volume: -12,
      oscillator: { type: "sine" },
      envelope: { attack: 0.005, decay: 0.04, sustain: 0, release: 0.08 },
    }).toDestination();
    void Tone.start();
    const notes = {
      select: "C6",
      cancel: "E4",
      toggle: "G6",
      off: "D4",
      close: "A4",
    };
    uiSynth.triggerAttackRelease(
      notes[kind],
      kind === "toggle" || kind === "off" || kind === "close" ? "8n" : "32n",
    );
  }

  function toggleTrack(id: number) {
    const track = tracks[id - 1];
    track.isPlaying = !track.isPlaying;

    if (track.isPlaying) {
      const audio = new Audio(`assets/engine/tracks/${track.track}`);
      audio.loop = true;
      audio.volume = getTrackVolume(track.id);
      audio.play();
      activeAudios.push({ id: track.id, audio });
    } else {
      activeAudios.forEach((item) => {
        if (item.id === track.id) item.audio.pause();
      });
      activeAudios = activeAudios.filter((item) => item.id !== track.id);
    }

    tracks = tracks;
    window.dispatchEvent(
      new CustomEvent("ambient-tracks-changed", {
        detail: { count: tracks.filter((item) => item.isPlaying).length },
      }),
    );
  }

  // Keyboard K and other callers use this to stop every ambient track.
  function stopAllTracks() {
    activeAudios.forEach((item) => item.audio.pause());
    activeAudios = [];
    tracks.forEach((track) => (track.isPlaying = false));
    tracks = tracks;
    window.dispatchEvent(
      new CustomEvent("ambient-tracks-changed", { detail: { count: 0 } }),
    );
  }

  function getTrackVolume(id: number) {
    const saved =
      localStorage.getItem(`audioVolume-${id}`) ??
      localStorage.getItem("audioVolume");
    const volume = saved === null ? 0.5 : Number(saved);
    return Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.5;
  }

  function updateTrackVolume(id: number, event: Event) {
    const volume = Number((event.currentTarget as HTMLInputElement).value);
    localStorage.setItem(`audioVolume-${id}`, String(volume));
    const activeTrack = activeAudios.find((item) => item.id === id);
    if (activeTrack) activeTrack.audio.volume = volume;
  }

  function updateHoveredTrack(event: PointerEvent) {
    const rect = trigger.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);

    // Returning to the center cancels the pending selection.
    if (Math.hypot(x, y) < 30) {
      if (hoveredTrackId !== null) playUiSound("cancel");
      isDragging = false;
      hoveredTrackId = null;
      return;
    }

    isDragging = true;
    const slice = (Math.PI * 2) / tracks.length;
    const angle =
      (Math.atan2(y, x) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
    const nextTrackId =
      (Math.floor((angle + slice / 2) / slice) % tracks.length) + 1;
    if (nextTrackId !== hoveredTrackId) playUiSound("select");
    hoveredTrackId = nextTrackId;
  }

  function handlePointerDown(event: PointerEvent) {
    if (
      window.innerWidth <= 600 ||
      event.button !== 0 ||
      isClickableTarget(event.target)
    )
      return;
    anchorX = event.clientX;
    anchorY = event.clientY;
    menuOpen = true;
    document.body.style.cursor = "pointer";
    isDragging = false;
    pointerId = event.pointerId;
    hoveredTrackId = selectedTrackId;
    hoveredTrackId = null;
  }

  // Follow the cursor while idle; track the radial slice while dragging.
  function handlePointerMove(event: PointerEvent) {
    if (pointerId === null && !menuOpen) {
      anchorX = event.clientX;
      anchorY = event.clientY;
      return;
    }
    if (event.pointerId === pointerId) updateHoveredTrack(event);
  }

  function closeMenu(event: PointerEvent) {
    if (event.pointerId !== pointerId) return;
    if (hoveredTrackId === null) playUiSound("close");
    if (isDragging && hoveredTrackId !== null) {
      selectedTrackId = hoveredTrackId;
      const wasPlaying = tracks[selectedTrackId - 1].isPlaying;
      toggleTrack(selectedTrackId);
      playUiSound(wasPlaying ? "off" : "toggle");
    }
    pointerId = null;
    hoveredTrackId = selectedTrackId;
    menuOpen = false;
    document.body.style.cursor = "";
  }

  onMount(() => {
    anchorX = window.innerWidth / 2;
    anchorY = window.innerHeight / 2;

    // Preserve number shortcuts and K alongside pointer controls.
    const handleKeydown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      if (event.key === "k") stopAllTracks();
      const id = Number(event.key);
      if (id >= 1 && id <= tracks.length) {
        selectedTrackId = id;
        toggleTrack(id);
      }
    };
    const handleToggleTrack = (event: CustomEvent) => {
      if (event.detail?.id >= 1 && event.detail.id <= tracks.length) {
        selectedTrackId = event.detail.id;
        toggleTrack(event.detail.id);
      }
    };
    const handlePlayState = (event: CustomEvent) => {
      visualizerActive = Boolean(event.detail?.isPlaying);
    };

    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("lofi-toggle-track", handleToggleTrack);
    window.addEventListener("lofi-play-state-changed", handlePlayState);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", closeMenu);
    window.addEventListener("pointercancel", closeMenu);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("lofi-toggle-track", handleToggleTrack);
      window.removeEventListener("lofi-play-state-changed", handlePlayState);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", closeMenu);
      window.removeEventListener("pointercancel", closeMenu);
    };
  });
</script>

<div
  class="track-selector"
  class:open={menuOpen}
  style={`left: ${anchorX}px; top: ${anchorY}px;`}
>
  {#if menuOpen}
    <div class="track-wheel" aria-hidden="true">
      {#each tracks as track, index}
        {@const angle = index * (360 / tracks.length)}
        <div
          class:targeted={hoveredTrackId === track.id}
          class:playing={track.isPlaying}
          class="track-option glass"
          style={`transform: translate(-50%, -50%) rotate(${angle}deg) translateY(-128px) rotate(${-angle}deg);`}
        >
          <img src={`assets/images/${track.id}.jpg`} alt="" />
          <span>{track.id}</span>
        </div>
      {/each}
    </div>
  {/if}

  <button
    bind:this={trigger}
    class:playing={tracks[selectedTrackId - 1].isPlaying}
    class:canceling={hoveredTrackId === null}
    class:cancel-mode={menuOpen}
    class:trigger-hidden={!SHOW_TRACK_TRIGGER && !menuOpen}
    class="track-trigger glass"
    aria-label="Choose ambient track"
    aria-expanded={menuOpen}
  >
    {#if menuOpen}
      <IconX size={17} />
      <span class="cancel-label">{$t.focus.cancel}</span>
    {:else}
      <IconMusic size={14} />
    {/if}
  </button>
  {#if menuOpen}
    {#if hoveredTrackId !== null}
      <div class="track-description glass">
        {$t.tracks[hoveredTrackId].quote}
      </div>
    {/if}
  {/if}
</div>

<!-- Active tracks remain available as quick toggle buttons. -->
<div
  class:visualizer-active={visualizerActive && !$zen}
  class="active-tracks"
  aria-label="Active tracks"
>
  {#each tracks.filter((track) => track.isPlaying) as track (track.id)}
    <div class="active-track-wrap">
      {#if !$zen}
        <input
          class="active-track-volume"
          aria-label={`Volume for track ${track.id}`}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={getTrackVolume(track.id)}
          on:input={(event) => updateTrackVolume(track.id, event)}
          on:click|stopPropagation
          on:pointerdown|stopPropagation
        />
      {/if}
      <button
        class="active-track glass"
        aria-label={`Pause track ${track.id}`}
        data-tooltip={$t.tracks[track.id].quote}
        aria-pressed="true"
        on:click={() => toggleTrack(track.id)}
        on:pointerdown|stopPropagation
      >
        <img src={`assets/images/${track.id}.jpg`} alt="" />
        <span class="active-track-number">{track.id}</span>
        <span class="active-track-close"><IconX size={14} /></span>
      </button>
    </div>
  {/each}
</div>

<style>
  .track-selector {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .track-wheel {
    position: absolute;
    inset: 50% auto auto 50%;
    width: 1px;
    height: 1px;
    pointer-events: none;
  }

  .track-trigger,
  .track-option {
    color: white;
    border: 0;
    box-sizing: border-box;
  }

  .track-trigger {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
    touch-action: none;
    flex-direction: column;
    gap: 1px;
  }

  .track-trigger.trigger-hidden {
    visibility: hidden;
  }

  .cancel-label {
    color: inherit;
    font-size: 9px;
    line-height: 1;
  }

  .track-trigger.canceling {
    color: #ff8a80;
    box-shadow: none;
  }

  .track-trigger:not(.cancel-mode) {
    flex-direction: row;
    gap: 3px;
  }

  .track-option {
    position: absolute;
    left: 50%;
    top: 50%;
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    padding: 0;
    overflow: hidden;
    border-radius: 50%;
    opacity: 1;
    transition:
      transform 140ms ease,
      opacity 140ms ease,
      box-shadow 140ms ease;
  }

  .track-option img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .track-option span {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: white;
    font-size: 14px;
    font-weight: 700;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9);
  }

  .track-option.targeted {
    box-shadow:
      0 0 0 3px white,
      0 8px 20px rgba(0, 0, 0, 0.4);
  }

  .track-option.playing {
    box-shadow:
      0 0 0 3px rgba(255, 255, 255, 0.75),
      0 8px 20px rgba(0, 0, 0, 0.4);
  }

  .track-option.playing.targeted {
    box-shadow:
      0 0 0 3px #ff4444,
      0 8px 20px rgba(0, 0, 0, 0.4);
  }

  .track-description {
    position: absolute;
    top: calc(50% + 168px);
    left: 50%;
    width: min(360px, 80vw);
    transform: translateX(-50%);
    box-sizing: border-box;
    padding: 6px 10px;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 11px;
    line-height: 1.4;
    text-align: center;
    pointer-events: none;
    text-shadow: 0 1px 5px rgba(0, 0, 0, 0.8);
  }

  .active-tracks {
    position: fixed;
    left: 16px;
    bottom: 18px;
    display: flex;
    align-items: center;
    gap: 4px;
    z-index: 25;
  }

  .active-tracks.visualizer-active {
    left: 190px;
  }

  .active-track {
    position: relative;
    width: 30px;
    height: 30px;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: 50%;
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }

  .active-track-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .active-track-volume {
    align-self: center;
    width: 4px;
    height: 54px;
    padding: 0;
    writing-mode: vertical-lr;
    direction: rtl;
    accent-color: white;
    cursor: ns-resize;
  }

  .active-track-volume::-webkit-slider-thumb {
    margin-left: -4px;
  }

  .active-track-volume::-webkit-slider-runnable-track {
    width: 5px;
  }

  .active-track img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 140ms ease;
  }

  .active-track:hover img {
    opacity: 0.4;
  }

  .active-track-number,
  .active-track-close {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 10px;
    font-weight: 700;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9);
  }

  .active-track-close {
    display: none;
    color: #ff4444;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9);
  }

  .active-track:hover .active-track-number {
    display: none;
  }

  .active-track:hover .active-track-close {
    display: grid;
  }

  @media only screen and (max-width: 600px) {
    .track-selector {
      display: none;
    }

    .track-option {
      width: 48px;
      height: 48px;
    }

    .track-description {
      top: calc(50% + 155px);
    }

    .active-tracks {
      display: none;
    }

    .active-tracks.visualizer-active {
      display: none;
    }
  }
</style>
