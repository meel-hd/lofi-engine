<script lang="ts">
  import CampFire from "./CampFire/index.svelte";
  import Jungle from "./Jungle/index.svelte";
  import Rain from "./Rain/index.svelte";
  import Settings from "./Settings/index.svelte";
  import Thunder from "./Thunder/index.svelte";

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

<div class="controls">
  <Rain volume={volumes.rain} />
  <Thunder volume={volumes.thunder} />
  <Jungle volume={volumes.jungle} />
  <CampFire volume={volumes.campfire} />
  <Settings />
</div>

<style>
  .controls {
    width: 340px;
    height: 50px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-radius: 50px;
    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 28%);
  }

  @media (max-width: 768px) {
    .controls {
      width: 100%; /* Parent in App.svelte is 90% */
      height: auto;
      min-height: 50px;
      flex-wrap: wrap;
      justify-content: space-around; /* Or center */
      padding: 10px;
      gap: 10px; /* For spacing between wrapped items */
    }

    .controls > :global(div) {
      margin: 5px; /* Spacing for child components when wrapped */
    }
  }
</style>
