<script lang="ts">
  import { IconSettings } from "@tabler/icons-svelte";
  import { onMount } from "svelte";
  import Background from "./Background.svelte";
  import Volume from "./Volume.svelte";
  import AutoDJ from "./AutoDJ.svelte";

  import { t, locale, setLocale } from "../../../locales/store";

  let isActive = false;

  function toggle() {
    isActive = !isActive;
    window.dispatchEvent(new CustomEvent("settings-open-changed", { detail: { isActive } }));
  }

  // Shortuct to toggle settings with "J" key
  window.addEventListener("keydown", (e) => {
    if (e.key === "j") {
      toggle();
    }
  });

  // when mounted toggle settings
  // to excute settings of children (old saved)
  onMount(() => {
    toggle();
    setTimeout(() => {
      toggle();
    }, 10);
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (
      isActive &&
      event.target instanceof HTMLElement &&
      !event.target.closest("#settings-box")
    ) {
      isActive = false;
    }
  };
  document.addEventListener("click", handleClickOutside);

  const languages = [
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
    { code: "hi", label: "हिन्दी" },
    { code: "fr", label: "Français" },
    { code: "nl", label: "Nederlands" },
    { code: "ja", label: "日本語" },
  ];
</script>

<div id="settings-box">
  <button
    style={`
          background-color: ${isActive ? "white" : "transparent"};
          `}
    on:click={toggle}
  >
    <IconSettings size={25} color={isActive ? "black" : "white"} />
  </button>
  {#if isActive}
    <div class="settings-container glass">
      <div class="settings-header">
        <h3>{$t.settings.title}</h3>
      </div>
      <div class="settings-content">
        <Background />
        <Volume />
        <AutoDJ />
        <div class="section language-section">
          <h4>{$t.settings.language.title}</h4>
          <div class="lang-switcher">
            {#each languages as lang}
              <button
                class:active={$locale === lang.code}
                on:click={() => setLocale(lang.code)}
              >
                {lang.label}
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  button {
    color: white;
    border-radius: 50%;
    aspect-ratio: 4/4;
  }
  #settings-box {
    position: relative;
  }
  .settings-container {
    position: absolute;
    right: 0;
    top: 70px;
    z-index: 100;
    height: 58vh;
    padding: 20px;
    width: 340px; /* Like controls width */
    color: white;
    border-radius: 20px;
    overflow-y: auto;
    animation: show 0.4s ease-in-out;
    display: flex;
    flex-direction: column;
  }

  .settings-header {
    margin-bottom: 20px;
    padding-bottom: 10px;
  }

  .settings-header h3 {
    margin: 0;
    font-size: 1.5em;
    font-weight: 600;
  }

  .settings-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .section h4 {
    margin: 0 0 10px 0;
    font-size: 1em;
    opacity: 0.9;
  }

  @keyframes show {
    from {
      transform: translateY(-10%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .lang-switcher {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .lang-switcher button {
    width: auto;
    height: auto;
    padding: 6px 12px;
    font-size: 0.85em;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    aspect-ratio: auto;
    border-radius: 20px;
  }

  .lang-switcher button:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    transform: translateY(-1px);
  }

  .lang-switcher button.active {
    background: white;
    color: black;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  @media only screen and (max-width: 600px) {
    .settings-container {
      width: 80vw;
      right: -3vw;
      background-color: rgba(0, 0, 0, 50%);
      height: 55vh;
    }
  }
</style>
