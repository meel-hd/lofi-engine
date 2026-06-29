<script lang="ts">
  import { IconCloudStorm } from "@tabler/icons-svelte";
  import { onMount, onDestroy } from "svelte";
  import { effects, toggleEffect } from "../../../stores/effects";
  import { volumes } from "../../../stores/volumes";

  let storm = new Audio("assets/engine/effects/thunder.mp3");

  // Shortuct to toggle storm with "S" key
  function handleKeydown(e: KeyboardEvent) {
    if ((e.target as HTMLElement)?.closest("input, textarea, [contenteditable]"))
      return;
    if (e.key === "s") {
      toggleEffect("thunder");
    }
  }

  // Drive playback from the store (single source of truth)
  $: if (storm) {
    if ($effects.thunder) {
      storm.loop = true;
      storm.play().catch(() => {});
    } else {
      storm.pause();
    }
  }

  // Keep the audio element's volume in sync with the store
  $: if (storm) storm.volume = $volumes.thunder;

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  onDestroy(() => {
    storm.pause();
  });
</script>

<button
  style={`
    background-color: ${$effects.thunder ? "white" : "transparent"};
    `}
  on:click={() => toggleEffect("thunder")}
>
  <IconCloudStorm size={25} color={$effects.thunder ? "black" : "white"} />
</button>

<style>
  button {
    color: white;
    border-radius: 50%;
    aspect-ratio: 4/4;
  }
</style>
