<script lang="ts">
  import { afterUpdate } from "svelte";

  export let activeAudios = [];
  export let track = {
    id: -1,
    track: "none",
    qoute: "none",
    isPlaying: false,
  };

  export let visibleTrackId = -1;
  let trackItemAnimationClass = "item-hidden";

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
  updateAnimation();
  afterUpdate(updateAnimation);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  on:click={() => {
    if (track.isPlaying) {
      // Pause playing track
      activeAudios.forEach((item) => {
        if (item.id === track.id) {
          item.audio.pause();
        }
      });
      track.isPlaying = false;
    } else {
      // Play track
      const audio = new Audio(`/assets/engine/tracks/${track.track}`);
      audio.play();
      audio.loop = true;
      activeAudios.push({
        id: track.id,
        audio,
      });
      track.isPlaying = true;
    }
  }}
  class={"carousel__item " + trackItemAnimationClass}
>
  <div class="carousel__item-body">
    <img
      class="carousel__item-body__img"
      src="/assets/images/{track.id}.jpg"
      alt=""
    />
    <div>
      <p id="title">Track {track.id}</p>
      <p id="info">{track?.qoute}</p>
      {#if track.isPlaying}
        <div class="play-indicator" />
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
    background-color: rgba(0, 0, 0, 30%);
    backdrop-filter: blur(10px);
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
  .play-indicator {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: white;
    color: black;
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
</style>
