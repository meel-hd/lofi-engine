<script lang="ts">
  import { IconCampfire } from "@tabler/icons-svelte";
  import { onMount } from "svelte";
  import { isEditableTarget } from "../../../keyboard";

  export let volume: number;

  let fire = new Audio("assets/engine/effects/fire.mp3");
  let isFire = false;

  function toggleFire() {
    if (isFire) {
      fire.pause();
    } else {
      fire.play();
      fire.loop = true;
      fire.volume = volume;
    }

    isFire = !isFire;
    window.dispatchEvent(new CustomEvent("ambient-sound-state-changed", {
      detail: { id: "campfire", active: isFire },
    }));
  }

  // Shortuct to toggle fire with "F" key
  window.addEventListener("keydown", (e) => {
    if (isEditableTarget(e.target)) return;

    if (e.key === "f") {
      toggleFire();
    }
  });

  // Update volume
  onMount(() => {
    window.addEventListener("lofi-toggle-campfire", toggleFire);
    setInterval(() => {
      fire.volume = volume;
    }, 100);

    return () => {
      window.removeEventListener("lofi-toggle-campfire", toggleFire);
    };
  });
</script>

<button
  style={`
        background-color: ${isFire ? "white" : "transparent"};
        `}
  on:click={toggleFire}
>
  <IconCampfire size={18} color={isFire ? "black" : "white"} />
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
