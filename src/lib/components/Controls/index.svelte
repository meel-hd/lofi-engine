<script lang="ts">
  import Rain from "./Rain/index.svelte";
  import Thunder from "./Thunder/index.svelte";
  import CampFire from "./CampFire/index.svelte";
  import Jungle from "./Jungle/index.svelte";
  import Settings from "./Settings/index.svelte";
</script>

<div class="controls">
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
    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 28%);
  }
</style>
