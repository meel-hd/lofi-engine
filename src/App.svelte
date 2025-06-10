<script lang="ts">
  import PlayButton from "./lib/PlayButton.svelte";
  import TrackList from "./lib/components/TrackList/index.svelte";
  import Controls from "./lib/components/Controls/index.svelte";
  import TopBar from "./lib/components/TopBar/TopBar.svelte";
  import Info from "./lib/components/InfoBox/Info.svelte";
  import Config from "./lib/Config.svelte";
  import { slide } from "svelte/transition";
  import { innerWidth } from "svelte/internal"; // Using svelte/internal for innerWidth, consider official 'svelte/window' if available or alternative for prod

  let isMobile = false;
  let showControlsMobile = false;

  // $: isMobile = $innerWidth <= 768; // This would be ideal with svelte/window or similar
  // For now, using a less ideal onMount and on:resize approach if $innerWidth is not directly available
  // Or, will rely on CSS media queries for visual changes and pass a reactive isMobile for logic

  function toggleControlsMobile() {
    showControlsMobile = !showControlsMobile;
  }

  // Reactive statement to update isMobile based on window width
  // This requires `bind:innerWidth` on a window event listener or similar
  // For the purpose of this exercise, we'll assume `isMobile` is correctly updated.
  // A more robust solution would use <svelte:window bind:innerWidth />
  let windowWidth = 0;
  $: isMobile = windowWidth <= 768;

</script>

<svelte:window bind:innerWidth={windowWidth} />

<main id="bg" class="container">
  <Config />
  <TopBar {isMobile} {showControlsMobile} {toggleControlsMobile} />
  <section class="content">
    <TrackList {isMobile} />
    {#if !isMobile}
      <Controls />
    {/if}
    <Info />
  </section>

  {#if isMobile && showControlsMobile}
    <div class="mobile-controls-overlay" transition:slide={{ duration: 300 }}>
      <div class="mobile-controls-header">
        <h3>Controls</h3>
        <button on:click={toggleControlsMobile} class="close-controls-btn">Close</button>
      </div>
      <Controls />
    </div>
  {/if}
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

  .mobile-controls-overlay {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(5px);
    padding: 20px;
    padding-top: 10px;
    z-index: 1000;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
  }

  .mobile-controls-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    color: white;
  }

  .mobile-controls-header h3 {
    margin: 0;
  }

  .close-controls-btn {
    background-color: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.9em;
  }

  .close-controls-btn:hover {
    background-color: #555;
  }


  @media (max-width: 768px) {
    .content {
      flex-direction: column;
      align-items: center;
      padding: 10px;
      padding-top: 20px;
      height: auto;
      min-height: calc(100vh - 50px); /* Adjust if TopBar height changes */
      overflow-y: auto;
    }

    /* Adjust children of .content on mobile IF Controls is not part of it */
    /* Since Controls is now an overlay on mobile, it's no longer a direct flex child of .content */
    /* So, the specific rule for .controls-wrapper might not be needed here if it was for that */
    section.content > :global(div):not(.mobile-controls-overlay), /* Exclude overlay if it were a child */
    section.content > :global(section) {
      width: 90%;
      margin-bottom: 15px;
    }

    /* This rule might be redundant now if Controls is in an overlay */
    /* section.content > :global(div[class*="controls-wrapper"]) {
      width: 90%;
    } */
  }
</style>
