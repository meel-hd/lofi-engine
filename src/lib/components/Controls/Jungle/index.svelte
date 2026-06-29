<script lang="ts">
  import { IconTrees } from "@tabler/icons-svelte";
  import { onMount, onDestroy } from "svelte";

  export let volume: number;

  let jungle = new Audio("assets/engine/effects/jungle.mp3");
  let isActive = false;

  function toggleJungle() {
    if (isActive) {
      jungle.pause();
    } else {
      jungle.play().catch(() => {});
      jungle.loop = true;
      jungle.volume = volume;
    }

    isActive = !isActive;
  }

  // Shortuct to toggle jungle with "D" key
  function handleKeydown(e: KeyboardEvent) {
    if ((e.target as HTMLElement)?.closest("input, textarea, [contenteditable]"))
      return;
    if (e.key === "d") {
      toggleJungle();
    }
  }

  // Keep the audio element's volume in sync with the prop
  $: if (jungle) jungle.volume = volume;

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("lofi-toggle-jungle", toggleJungle);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("lofi-toggle-jungle", toggleJungle);
    };
  });

  onDestroy(() => {
    jungle.pause();
  });
</script>

<button
  style={`
        background-color: ${isActive ? "white" : "transparent"};
        `}
  on:click={toggleJungle}
>
  <IconTrees size={25} color={isActive ? "black" : "white"} />
</button>

<style>
  button {
    color: white;
    border-radius: 50%;
    aspect-ratio: 4/4;
  }
</style>
