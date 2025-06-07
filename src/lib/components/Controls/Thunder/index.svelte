<script lang="ts">
  import { IconCloudStorm } from "@tabler/icons-svelte";
  import { onMount } from "svelte";

  export let volume: number;

  let storm = new Audio("assets/engine/effects/thunder.mp3");
  let isStorming = false;

  function toggleStorm() {
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
      toggleStorm();
    }
  });

  // Update volume
  onMount(() => {
    setInterval(() => {
      storm.volume = volume;
    }, 100);
  });
</script>

<button
  style={`
    background-color: ${isStorming ? "white" : "transparent"};
    `}
  on:click={toggleStorm}
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
