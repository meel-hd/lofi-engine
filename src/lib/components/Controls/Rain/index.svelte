<script lang="ts">
  import { IconCloudRain } from "@tabler/icons-svelte";
  import { onMount } from "svelte";
  import { isEditableTarget } from "../../../keyboard";
  import RainAnimation from "./RainAnimation.svelte";

  export let volume: number;

  let rain = new Audio("assets/engine/effects/rain.mp3");
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
    if (isEditableTarget(e.target)) return;

    if (e.key === "a") {
      toggleRain();
    }
  });

  onMount(() => {
    window.addEventListener("lofi-toggle-rain", toggleRain);

    setInterval(() => {
      rain.volume = volume;
    }, 100);

    return () => {
      window.removeEventListener("lofi-toggle-rain", toggleRain);
    };
  });
</script>

<div>
  <button
    style={`
      background-color: ${isRaining ? "white" : "transparent"};
      `}
    on:click={toggleRain}
  >
    <IconCloudRain size={18} color={isRaining ? "black" : "white"} />
  </button>
  <RainAnimation {isRaining} />
</div>

<style>
  button {
    width: 26.64px;
    height: 26.64px;
    padding: 0;
    display: grid;
    place-items: center;
    color: white;
    border-radius: 50%;
    aspect-ratio: 4/4;
  }
</style>
