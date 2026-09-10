<script lang="ts">
  import CampFire from "./CampFire/index.svelte";
  import Jungle from "./Jungle/index.svelte";
  import Rain from "./Rain/index.svelte";
  import Thunder from "./Thunder/index.svelte";
  import { zen } from "../../focus/store";

  const STORAGE_KEY = "Volumes";
  const DEFFAULT_VOLUMES = {
    rain: 1,
    thunder: 1,
    campfire: 1,
    jungle: 1,
    main_track: 1,
  };
  // Load previous vols or defualt
  let volumes =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFFAULT_VOLUMES;

  // Update
  setInterval(() => {
    volumes = volumes =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFFAULT_VOLUMES;
  }, 200);
</script>

<div class:zen={$zen} class="controls glass">
  <Rain volume={volumes.rain} />
  <Thunder volume={volumes.thunder} />
  <Jungle volume={volumes.jungle} />
  <CampFire volume={volumes.campfire} />
</div>

<style>
  .controls {
    width: auto;
    height: 36px;
    color: white;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: center;
    padding: 3px 10px;
    border-radius: 36px;
  }

  .controls.zen {
    position: relative;
    isolation: isolate;
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
    visibility: hidden;
    pointer-events: none;
  }

  .controls.zen :global(.rain) {
    visibility: visible;
  }

  @media only screen and (max-width: 600px) {
    .controls {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 61.2vw;
    }
  }
</style>
