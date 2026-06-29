<script lang="ts">
  import { IconCloudStorm } from "@tabler/icons-svelte";
  import { onMount, onDestroy } from "svelte";

  export let volume: number;

  let storm = new Audio("assets/engine/effects/thunder.mp3");
  let isStorming = false;

  function toggleThunder() {
    if (isStorming) {
      storm.pause();
    } else {
      storm.play().catch(() => {});
      storm.loop = true;
      storm.volume = volume;
    }

    isStorming = !isStorming;
  }

  // Shortuct to toggle storm with "S" key
  function handleKeydown(e: KeyboardEvent) {
    if ((e.target as HTMLElement)?.closest("input, textarea, [contenteditable]"))
      return;
    if (e.key === "s") {
      toggleThunder();
    }
  }

  // Keep the audio element's volume in sync with the prop
  $: if (storm) storm.volume = volume;

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("lofi-toggle-thunder", toggleThunder);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("lofi-toggle-thunder", toggleThunder);
    };
  });

  onDestroy(() => {
    storm.pause();
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
