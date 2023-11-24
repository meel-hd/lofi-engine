<script lang="ts">
  import {
    IconPlayerPlayFilled,
    IconPlayerPauseFilled,
  } from "@tabler/icons-svelte";
  import { onMount } from "svelte";

  const audio = new Audio("/assets/engine/main.mp3");
  let isPlaying = false;

  const STORAGE_KEY = "Volumes";
  const DEFFAULT_VOLUMES = {
    rain: 1,
    thunder: 1,
    campfire: 1,
    jungle: 1,
    main_track: 1,
  };
  // Load previous vols or defualt
  let volumes =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFFAULT_VOLUMES;

  function playTrack() {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.loop = true;
      audio.volume = volumes.main_track;
      audio.play();
      isPlaying = true;
    }
  }

  // listen on spacebar press to play/pause
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      // Reserving spacebar for play/pause only
      e.preventDefault();
      playTrack();
    }
  });

  // Update volume
  onMount(() => {
    setInterval(() => {
      let updatedVol =
        JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFFAULT_VOLUMES;
      audio.volume = updatedVol.main_track;
    },100);
  });
</script>

<button on:click={playTrack} class="play-button">
  {#if isPlaying}
    <IconPlayerPauseFilled size={30} />
  {:else}
    <IconPlayerPlayFilled size={30} />
  {/if}
</button>

<style>
  .play-button {
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: white;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }
  .play-button:hover {
    cursor: pointer;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  }
</style>
