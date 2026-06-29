<script lang="ts">
  import { IconTrees } from "@tabler/icons-svelte";
  import { onMount, onDestroy } from "svelte";
  import { effects, toggleEffect } from "../../../stores/effects";
  import { volumes } from "../../../stores/volumes";

  let jungle = new Audio("assets/engine/effects/jungle.mp3");

  // Shortuct to toggle jungle with "D" key
  function handleKeydown(e: KeyboardEvent) {
    if ((e.target as HTMLElement)?.closest("input, textarea, [contenteditable]"))
      return;
    if (e.key === "d") {
      toggleEffect("jungle");
    }
  }

  // Drive playback from the store (single source of truth)
  $: if (jungle) {
    if ($effects.jungle) {
      jungle.loop = true;
      jungle.play().catch(() => {});
    } else {
      jungle.pause();
    }
  }

  // Keep the audio element's volume in sync with the store
  $: if (jungle) jungle.volume = $volumes.jungle;

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  onDestroy(() => {
    jungle.pause();
  });
</script>

<button
  style={`
        background-color: ${$effects.jungle ? "white" : "transparent"};
        `}
  on:click={() => toggleEffect("jungle")}
>
  <IconTrees size={25} color={$effects.jungle ? "black" : "white"} />
</button>

<style>
  button {
    color: white;
    border-radius: 50%;
    aspect-ratio: 4/4;
  }
</style>
