<script lang="ts">
  import { IconEye, IconX } from "@tabler/icons-svelte";
  import ShortCuts from "./ShortCuts.svelte";
  import SocialLinks from "./SocialLinks.svelte";
  import { onMount } from "svelte";
  import { t } from "../../locales/store";

  let visible = false;

  function toggleInfoBox() {
    visible = !visible;
  }

  // First time, show info box
  if (!localStorage.getItem("shownBefore-info")) {
    toggleInfoBox();
    localStorage.setItem("shownBefore-info", "true");
  }

  // Listen to escape key to close info box
  document.addEventListener(
    "keydown",
    function (e) {
      if (e.key === "Escape" && visible) {
        toggleInfoBox();
      }
    },
    false,
  );

  function showNextTime() {
    localStorage.removeItem("shownBefore-info");
  }

  onMount(() => {
    window.addEventListener("lofi-toggle-info", toggleInfoBox);
    return () => {
      window.removeEventListener("lofi-toggle-info", toggleInfoBox);
    };
  });
</script>

{#if visible}
  <div class="info-overlay glass">
    <div id="info-box" class="glass">
      <div id="top-section">
        <button id="close-btn" on:click={toggleInfoBox}>
          <IconX color="white" size={17} />
        </button>
        <button
          id="show-btn"
          data-tooltip={$t.info.buttons.show_next_time}
          on:click={showNextTime}
        >
          <IconEye color="white" size={17} />
        </button>
        <div id="app-info">
          <img id="app-logo" src="LofiEngine.png" alt="" />
          <div>
            <h1>{$t.info.title}</h1>
            <p id="version">Version 1.2.0</p>
            <p id="tagline">
              {$t.info.tagline}
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
    z-index: 99; /* on top of everything and under topbar(100 z-index) */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #info-box {
    padding: 0px 15px;
    color: white;
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
  }
  #bottom-section {
    overflow: hidden;
    overflow-y: scroll;
    height: 45vh;
  }
  img {
    aspect-ratio: 1/1;
    width: 130px;
    height: 130px;
    min-width: 130px;
    min-height: 130px;
    border-radius: 20px;
  }

  @media only screen and (max-width: 600px) {
    #info-box {
      width: 90vw;
    }
    #app-info {
      margin-top: 20px;
      flex-direction: column;
    }
    img {
      width: 80px;
      height: 80px;
      min-width: auto;
      min-height: auto;
      align-self: center;
    }
    #app-info h1 {
      font-size: large;
    }
    #bottom-section {
      display: none;
    }
  }
</style>
