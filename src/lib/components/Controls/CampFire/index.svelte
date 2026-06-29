<script lang="ts">
  import { IconCampfire } from "@tabler/icons-svelte";
  import { onMount, onDestroy } from "svelte";
  import { effects, toggleEffect } from "../../../stores/effects";
  import { volumes } from "../../../stores/volumes";

  let fire = new Audio("assets/engine/effects/fire.mp3");

  // Shortuct to toggle fire with "F" key
  function handleKeydown(e: KeyboardEvent) {
    if ((e.target as HTMLElement)?.closest("input, textarea, [contenteditable]"))
      return;
    if (e.key === "f") {
      toggleEffect("campfire");
    }
  }

  // Drive playback from the store (single source of truth)
  $: if (fire) {
    if ($effects.campfire) {
      fire.loop = true;
      fire.play().catch(() => {});
    } else {
      fire.pause();
    }
  }

  // Keep the audio element's volume in sync with the store
  $: if (fire) fire.volume = $volumes.campfire;

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  onDestroy(() => {
    fire.pause();
  });
</script>

<button
  style={`
        background-color: ${$effects.campfire ? "white" : "transparent"};
        `}
  on:click={() => toggleEffect("campfire")}
>
  <IconCampfire size={25} color={$effects.campfire ? "black" : "white"} />
</button>

<style>
  button {
    color: white;
    border-radius: 50%;
    aspect-ratio: 4/4;
  }
</style>
