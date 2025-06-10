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
    <Info />
  </section>
  <PlayButton />
</main>

<style>
  .container {
    max-width: 100vw;
    max-height: 100vh;
    height: 100vh;
    position: relative;
    overflow: hidden;
    background-color: black;
    background-image: url("assets/background/bg1.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  .content {
    padding: 24px;
    padding-top: 30px;
    height: 100vh;
    z-index: 20;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  @media (max-width: 768px) {
    .content {
      flex-direction: column;
      align-items: center;
      padding: 10px;
      padding-top: 20px;
      height: auto;
      min-height: calc(100vh - 50px);
      overflow-y: auto;
    }

    section.content > :global(div),
    section.content > :global(section) {
      width: 90%;
      margin-bottom: 15px;
    }

    /* Ensure Controls specifically has width: 90% */
    section.content > :global(div[class*="controls-wrapper"]) {
      width: 90%;
    }
  }
</style>
