<script lang="ts">
  import { IconCloudRain } from "@tabler/icons-svelte";
  import { onMount } from "svelte";
  import RainAnimation from "./RainAnimation.svelte";

  export let volume: number;

  let rain = new Audio("/assets/engine/effects/rain.mp3");
  let isRaining = false;

  function toggleRain() {
    if (isRaining) {
      rain.pause();
    } else {
      rain.play();
      rain.loop = true;
      rain.volume = volume;
    }

    isRaining = !isRaining;
  }

  // Shortuct to toggle rain with "A" key
  window.addEventListener("keydown", (e) => {
    if (e.key === "a") {
      toggleRain();
    }
  });

  // Update volume
  onMount(() => {
    setInterval(() => {
      rain.volume = volume;
    },100);
  });
</script>

<div>
  <button
    style={`
      background-color: ${isRaining ? "white" : "transparent"};
      `}
    on:click={toggleRain}
  >
    <IconCloudRain size={25} color={isRaining ? "black" : "white"} />
  </button>
  <RainAnimation {isRaining} />
</div>

<style>
  button {
    color: white;
    border-radius: 50%;
    aspect-ratio: 4/4;
  }
</style>
