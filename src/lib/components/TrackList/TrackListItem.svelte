<script lang="ts">
  import { afterUpdate, onMount } from "svelte";
  import { t } from "../../locales/store";

  export let setMeVisible;
  export let activeAudios = [];
  export let track = {
    id: -1,
    track: "none",
    isPlaying: false,
  };

  export let visibleTrackId = -1;
  let trackItemAnimationClass = "item-hidden";
  let volume = 0.5;

  function updateAnimation() {
    if (track.id == visibleTrackId) {
      trackItemAnimationClass = "item-visible";
    } else if (track.id + 1 == visibleTrackId) {
      trackItemAnimationClass = "item-before-visible";
    } else if (track.id - 1 == visibleTrackId) {
      trackItemAnimationClass = "item-after-visible";
    }
    // Edge tracks
    else if (track.id == 9 && visibleTrackId == 1) {
      trackItemAnimationClass = "item-before-visible";
    } else if (track.id == 1 && visibleTrackId == 9) {
      trackItemAnimationClass = "item-after-visible";
    } else {
      trackItemAnimationClass = "item-hidden";
    }
  }

  function handleVolumeChange(event) {
    volume = event.target.value;
    localStorage.setItem("audioVolume", volume.toString());
    activeAudios.forEach((item) => {
      if (item.id === track.id) {
        item.audio.volume = volume;
      }
    });
  }

  function playTrack() {
    const audio = new Audio(`assets/engine/tracks/${track.track}`);
    audio.volume = volume;
    audio.play();
    audio.loop = true;
    activeAudios.push({
      id: track.id,
      audio,
    });
    track.isPlaying = true;
    setMeVisible(track.id);
  }

  function pauseTrack() {
    activeAudios.forEach((item) => {
      if (item.id === track.id) {
        item.audio.pause();
      }
    });
    track.isPlaying = false;
  }

  onMount(() => {
    const savedVolume = localStorage.getItem("audioVolume");
    if (savedVolume !== null) {
      volume = parseFloat(savedVolume);
    }
  });

  updateAnimation();
  afterUpdate(updateAnimation);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  on:contextmenu={() => {
    if (!track.isPlaying) {
      setMeVisible(track.id);
    }
  }}
  on:click={() => {
    track.isPlaying ? pauseTrack() : playTrack();
  }}
  class={"carousel__item " + trackItemAnimationClass}
>
  <div
    class={"carousel__item-body glass " + (track.isPlaying ? "playing" : "")}
  >
    <img
      class="carousel__item-body__img"
      src="assets/images/{track.id}.jpg"
      alt=""
    />
    <div>
      <p id="title">Track {track.id}</p>
      <p id="info">{$t.tracks[track.id].quote}</p>
      {#if track.isPlaying}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          bind:value={volume}
          on:input={handleVolumeChange}
          on:click={(e) => e.stopPropagation()}
          id="volume-slider"
          class="volume-slider"
        />
      {/if}
    </div>
  </div>
</div>

<style>
  .carousel__item {
    display: flex;
    align-items: center;
    position: absolute;
    width: 100%;
    will-change: transform, opacity;
    transition-duration: 500ms;
  }
  .carousel__item-body {
    position: relative;
    width: 100%;
    color: white;
    border-radius: 8px;
    padding-right: 15px;
    display: flex;
    gap: 20px;
    min-width: max-content;
  }

  .carousel__item-body__img {
    width: 80px;
    min-width: 80px;
    height: 80px;
    margin: 10px;
    border-radius: 5px;
    overflow: hidden;
  }
  #title {
    font-size: 16px;
    font-weight: 600;
  }
  #info {
    display: flex;
    flex-wrap: wrap;
    font-size: 11px;
  }

  .playing {
    background-color: rgba(0, 0, 0, 60%);
  }
  .item-visible {
    opacity: 1;
    visibility: visible;
  }
  .item-hidden {
    opacity: 0.2;
    visibility: hidden;
    animation-duration: 0ms;
    transform: scale(0.1);
  }
  .item-before-visible {
    opacity: 0.5;
    visibility: visible;
    transform: scale(0.8) translate(0, -150px);
  }
  .item-after-visible {
    opacity: 0.5;
    visibility: visible;
    transform: scale(0.8) translate(0, 150px);
  }
  .volume-slider {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 80px;
    height: 5px;
  }
</style>
