<script lang="ts">
  import PlayButton from "./lib/PlayButton.svelte";
  import TrackList from "./lib/components/TrackList/index.svelte";
  import Controls from "./lib/components/Controls/index.svelte";
  import TopBar from "./lib/components/TopBar/TopBar.svelte";
  import Info from "./lib/components/InfoBox/Info.svelte";
  import Config from "./lib/Config.svelte";
</script>

<main id="bg" class="container">
  <Config />
  <TopBar />
  <section class="content">
    <TrackList />
    <Controls />
    <PlayButton />
    <Info />
  </section>
</main>

<style>
  .container {
    max-width: 100vw;
    max-height: 100vh;
    height: 100vh;
    position: relative;
    overflow: hidden;
    background-color: black;
    background-image: url("/assets/background/bg1.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  .content {
    padding: 24px;
    padding-top: 30px;
    z-index: 20;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
