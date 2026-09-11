<script lang="ts">
  import { IconEye, IconX } from "@tabler/icons-svelte";
  import Credits from "./Credits.svelte";
  import ShortCuts from "./ShortCuts.svelte";
  import SocialLinks from "./SocialLinks.svelte";
  import { onMount } from "svelte";
  import { t } from "../../locales/store";
  import { isEditableTarget } from "../../keyboard";

  let visible = false;
  let activeTab: "shortcuts" | "credits" = "shortcuts";

  function toggleInfoBox() {
    visible = !visible;
  }

  function handleTabKeydown(event: KeyboardEvent) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    if (window.matchMedia("(max-width: 600px)").matches) return;

    event.preventDefault();
    const nextTab =
      event.key === "ArrowLeft" || event.key === "End" ? "credits" : "shortcuts";
    activeTab = nextTab;
    document.getElementById(`${nextTab}-tab`)?.focus();
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
      if (isEditableTarget(e.target)) return;

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
    if (window.matchMedia("(max-width: 600px)").matches) {
      activeTab = "credits";
    }

    window.addEventListener("lofi-toggle-info", toggleInfoBox);
    return () => {
      window.removeEventListener("lofi-toggle-info", toggleInfoBox);
    };
  });
</script>

{#if visible}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="info-overlay glass"
    on:click|self={toggleInfoBox}
    on:contextmenu|preventDefault|stopPropagation
    on:pointerdown|stopPropagation
  >
    <div id="info-box" class="glass" role="dialog" aria-modal="true" aria-labelledby="info-title">
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
            <h1 id="info-title">{$t.info.title}</h1>
            <p id="version">Version 1.2.0</p>
            <p id="tagline">
              {$t.info.tagline}
            </p>
            <SocialLinks />
          </div>
        </div>
      </div>
      <div id="bottom-section">
        <div class="tabs" role="tablist" aria-label="About information">
          <button
            class:active={activeTab === "shortcuts"}
            id="shortcuts-tab"
            role="tab"
            aria-selected={activeTab === "shortcuts"}
            aria-controls="shortcuts-panel"
            on:click={() => (activeTab = "shortcuts")}
            on:keydown={handleTabKeydown}
          >
            Shortcuts
          </button>
          <button
            class:active={activeTab === "credits"}
            id="credits-tab"
            role="tab"
            aria-selected={activeTab === "credits"}
            aria-controls="credits-panel"
            on:click={() => (activeTab = "credits")}
            on:keydown={handleTabKeydown}
          >
            Credits
          </button>
        </div>

        {#if activeTab === "shortcuts"}
          <div id="shortcuts-panel" role="tabpanel" aria-labelledby="shortcuts-tab">
            <ShortCuts />
          </div>
        {:else}
          <div id="credits-panel" role="tabpanel" aria-labelledby="credits-tab">
            <Credits />
          </div>
        {/if}
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
    display: flex;
    flex-direction: column;
    padding: 0px 15px;
    color: white;
    border-radius: 20px;
    width: 55vw;
    height: 75vh;
    overflow: hidden;
  }
  #top-section {
    display: flex;
    flex-shrink: 0;
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
    flex: 1;
    min-height: 0;
    overflow: hidden;
    overflow-y: scroll;
  }
  .tabs {
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    width: fit-content;
    gap: 0.25rem;
    margin: 0 auto 1rem;
    padding: 0.25rem;
    border: 0;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  .tabs button {
    border: 0;
    border-radius: 9999px;
    padding: 0.45rem 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    background: transparent;
    cursor: pointer;
  }
  .tabs button.active {
    color: white;
    background: rgba(255, 255, 255, 0.16);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  .tabs button:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
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
    #shortcuts-tab {
      display: none;
    }
    /* Credits is the only mobile tab, so its selector is unnecessary. */
    .tabs {
      display: none;
    }
  }
</style>
