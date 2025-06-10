<script lang="ts">
  import { IconEye, IconX } from "@tabler/icons-svelte";
  import ShortCuts from "./ShortCuts.svelte";
  import SocialLinks from "./SocialLinks.svelte";
  import { fly } from "svelte/transition";

  let visible = false;

  function toggleInfoBox() {
    visible = !visible;
  }

  // First time, show info box
  if (!localStorage.getItem("shownBefore-info")) {
    toggleInfoBox();
    localStorage.setItem("shownBefore-info", "true");
  }

  function showNextTime() {
    localStorage.removeItem("shownBefore-info");
  }
  // Listen to escape key to close info box
  document.addEventListener(
    "keydown",
    function (e) {
      if (e.key === "Escape") {
        toggleInfoBox();
      }
    },
    false
  );
</script>

{#if visible}
  <div class="info-overlay" transition:fly={{ y: 20, duration: 250 }}>
    <div id="info-box">
      <div id="top-section">
        <button id="close-btn" on:click={toggleInfoBox}>
          <IconX color="white" size={17} />
        </button>
        <button
          id="show-btn"
          title="Show on start next time"
          on:click={showNextTime}
        >
          <IconEye color="white" size={17} />
        </button>
        <div id="app-info">
          <img id="app-logo" src="LofiEngine.png" alt="" />
          <div>
            <h1>Lofi Engine</h1>
            <p id="version">Version 1.0.0</p>
            <p id="tagline">
              Create your own atmosphere, Lofi Engine sets the mood.
            </p>
            <SocialLinks />
          </div>
        </div>
      </div>
      <div id="bottom-section">
        <ShortCuts />
      </div>
    </div>
  </div>
{/if}

<style>
  .info-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1005; /* Increased z-index */
    background-color: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #info-box {
    padding: 0px 15px;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    width: 55vw;
    height: 75vh;
    overflow: hidden;
  }
  #top-section {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    position: relative;
  }
  #close-btn {
    position: absolute;
    top: 10px;
    right: 0;
    outline: none;
  }
  #show-btn {
    position: absolute;
    top: 10px;
    right: 35px;
    outline: none;
  }
  button:active {
    transform: scale(0.9);
  }
  #app-info {
    display: flex;
    padding: 10px;
    gap: 20px;
  }
  #app-info h1 {
    margin: 10px 0px 5px 0px;
  }
  #app-info #version {
    font-size: x-small;
    margin: -2px 10px;
    color: lightgray;
  }
  #app-info #tagline {
    font-size: small;
    margin: 5px 10px;
    font-family: "Courier New", Courier, monospace;
  }
  #bottom-section {
    margin-top: 20px;
    overflow: hidden;
    overflow-y: scroll;
    height: 45vh;
    padding-bottom: 50px;
  }
  img {
    aspect-ratio: 1/1;
    width: 130px;
    height: 130px;
    min-width: 130px;
    min-height: 130px;
    border-radius: 20px;
  }

  @media (max-width: 768px) {
    #info-box {
      width: 90vw;
      height: auto;
      max-height: 85vh;
      padding: 10px;
    }

    #app-info {
      flex-direction: column;
      align-items: center;
      gap: 10px;
      text-align: center; /* Optional: for better text presentation */
    }

    #app-info img#app-logo { /* More specific selector for the logo */
      width: 80px;
      height: 80px;
      min-width: unset;
      min-height: unset;
    }

    #bottom-section {
      height: auto; /* Adjust based on content */
      max-height: 40vh; /* Or another suitable value */
      /* Ensure scrolling is still possible if content exceeds this */
    }
  }
</style>
