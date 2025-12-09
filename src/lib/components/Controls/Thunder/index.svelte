<script lang="ts">
  import { IconCloudStorm } from "@tabler/icons-svelte";
  import { onMount } from "svelte";

  export let volume: number;

  let storm = new Audio("assets/engine/effects/thunder.mp3");
  let isStorming = false;

  function toggleThunder() {
    if (isStorming) {
      storm.pause();
    } else {
      storm.play();
      storm.loop = true;
      storm.volume = volume;
    }

    isStorming = !isStorming;
  }

  // Shortuct to toggle storm with "S" key
  window.addEventListener("keydown", (e) => {
    if (e.key === "s") {
      toggleThunder();
    }
  });

  // Update volume
  onMount(() => {
    window.addEventListener("lofi-toggle-thunder", toggleThunder);
    setInterval(() => {
      storm.volume = volume;
    }, 100);

    return () => {
      window.removeEventListener("lofi-toggle-thunder", toggleThunder);
    };
  });
</script>

<button
  style={`
    background-color: ${isStorming ? "white" : "transparent"};
    `}
  on:click={toggleThunder}
>
  <IconCloudStorm size={25} color={isStorming ? "black" : "white"} />
</button>

<style>
  button {
    color: white;
    border-radius: 50%;
    aspect-ratio: 4/4;
  }
</style>
