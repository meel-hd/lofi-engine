<script lang="ts">
  import CampFire from "./CampFire/index.svelte";
  import Jungle from "./Jungle/index.svelte";
  import Rain from "./Rain/index.svelte";
  import Settings from "./Settings/index.svelte";
  import Thunder from "./Thunder/index.svelte";
</script>

<div class="controls glass">
  <Rain />
  <Thunder />
  <Jungle />
  <CampFire />
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
  }

  @media only screen and (max-width: 600px) {
    .controls {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 85vw;
    }
  }
</style>
