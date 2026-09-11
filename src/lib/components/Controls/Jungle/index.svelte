<script lang="ts">
  import { IconTrees } from "@tabler/icons-svelte";
  import { onMount } from "svelte";
  import { isEditableTarget } from "../../../keyboard";

  export let volume: number;

  let jungle = new Audio("assets/engine/effects/jungle.mp3");
  let isActive = false;

  function toggleJungle() {
    if (isActive) {
      jungle.pause();
    } else {
      jungle.play();
      jungle.loop = true;
      jungle.volume = volume;
    }

    isActive = !isActive;
    window.dispatchEvent(new CustomEvent("ambient-sound-state-changed", {
      detail: { id: "jungle", active: isActive },
    }));
  }

  // Shortuct to toggle jungle with "D" key
  window.addEventListener("keydown", (e) => {
    if (isEditableTarget(e.target)) return;

    if (e.key === "d") {
      toggleJungle();
    }
  });
  // Update volume
  onMount(() => {
    window.addEventListener("lofi-toggle-jungle", toggleJungle);
    setInterval(() => {
      jungle.volume = volume;
    }, 100);

    return () => {
      window.removeEventListener("lofi-toggle-jungle", toggleJungle);
    };
  });
</script>

<button
  style={`
        background-color: ${isActive ? "white" : "transparent"};
        `}
  on:click={toggleJungle}
>
  <IconTrees size={18} color={isActive ? "black" : "white"} />
</button>

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
