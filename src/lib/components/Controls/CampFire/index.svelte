<script lang="ts">
  import { IconCampfire } from "@tabler/icons-svelte";
  import { onMount, onDestroy } from "svelte";

  export let volume: number;

  let fire = new Audio("assets/engine/effects/fire.mp3");
  let isFire = false;

  function toggleFire() {
    if (isFire) {
      fire.pause();
    } else {
      fire.play().catch(() => {});
      fire.loop = true;
      fire.volume = volume;
    }

    isFire = !isFire;
  }

  // Shortuct to toggle fire with "F" key
  function handleKeydown(e: KeyboardEvent) {
    if ((e.target as HTMLElement)?.closest("input, textarea, [contenteditable]"))
      return;
    if (e.key === "f") {
      toggleFire();
    }
  }

  // Keep the audio element's volume in sync with the prop
  $: if (fire) fire.volume = volume;

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("lofi-toggle-campfire", toggleFire);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("lofi-toggle-campfire", toggleFire);
    };
  });

  onDestroy(() => {
    fire.pause();
  });
</script>

<button
  style={`
        background-color: ${isFire ? "white" : "transparent"};
        `}
  on:click={toggleFire}
>
  <IconCampfire size={25} color={isFire ? "black" : "white"} />
</button>

<style>
  button {
    color: white;
    border-radius: 50%;
    aspect-ratio: 4/4;
  }
</style>
