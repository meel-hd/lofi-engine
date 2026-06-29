<script lang="ts">
  import { IconCloudRain } from "@tabler/icons-svelte";
  import { onMount, onDestroy } from "svelte";
  import RainAnimation from "./RainAnimation.svelte";
  import { effects, toggleEffect } from "../../../stores/effects";
  import { volumes } from "../../../stores/volumes";

  let rain = new Audio("assets/engine/effects/rain.mp3");

  // Shortuct to toggle rain with "A" key
  function handleKeydown(e: KeyboardEvent) {
    if ((e.target as HTMLElement)?.closest("input, textarea, [contenteditable]"))
      return;
    if (e.key === "a") {
      toggleEffect("rain");
    }
  }

  // Drive playback from the store (single source of truth)
  $: if (rain) {
    if ($effects.rain) {
      rain.loop = true;
      rain.play().catch(() => {});
    } else {
      rain.pause();
    }
  }

  // Keep the audio element's volume in sync with the store
  $: if (rain) rain.volume = $volumes.rain;

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  onDestroy(() => {
    rain.pause();
  });
</script>

<div>
  <button
    style={`
      background-color: ${$effects.rain ? "white" : "transparent"};
      `}
    on:click={() => toggleEffect("rain")}
  >
    <IconCloudRain size={25} color={$effects.rain ? "black" : "white"} />
  </button>
  <RainAnimation isRaining={$effects.rain} />
</div>

<style>
  button {
    color: white;
    border-radius: 50%;
    aspect-ratio: 4/4;
  }
</style>
