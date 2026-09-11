<script lang="ts">
  import { IconCloudStorm } from "@tabler/icons-svelte";
  import { onMount } from "svelte";
  import { isEditableTarget } from "../../../keyboard";

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
    window.dispatchEvent(new CustomEvent("ambient-sound-state-changed", {
      detail: { id: "thunder", active: isStorming },
    }));
  }

  // Shortuct to toggle storm with "S" key
  window.addEventListener("keydown", (e) => {
    if (isEditableTarget(e.target)) return;

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
  <IconCloudStorm size={18} color={isStorming ? "black" : "white"} />
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
