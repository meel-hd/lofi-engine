<script lang="ts">
  import { IconCloudRain } from "@tabler/icons-svelte";
  import { onMount, onDestroy } from "svelte";
  import RainAnimation from "./RainAnimation.svelte";

  export let volume: number;

  let rain = new Audio("assets/engine/effects/rain.mp3");
  let isRaining = false;

  function toggleRain() {
    if (isRaining) {
      rain.pause();
    } else {
      rain.play().catch(() => {});
      rain.loop = true;
      rain.volume = volume;
    }

    isRaining = !isRaining;
  }

  // Shortuct to toggle rain with "A" key
  function handleKeydown(e: KeyboardEvent) {
    if ((e.target as HTMLElement)?.closest("input, textarea, [contenteditable]"))
      return;
    if (e.key === "a") {
      toggleRain();
    }
  }

  // Keep the audio element's volume in sync with the prop
  $: if (rain) rain.volume = volume;

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("lofi-toggle-rain", toggleRain);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("lofi-toggle-rain", toggleRain);
    };
  });

  onDestroy(() => {
    rain.pause();
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
