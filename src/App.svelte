<script lang="ts">
  import { onMount } from "svelte";
  import { dir, locale } from "./lib/locales/store";
  import PlayButton from "./lib/PlayButton.svelte";
  import TrackList from "./lib/components/TrackList/index.svelte";
  import Controls from "./lib/components/Controls/index.svelte";
  import TopBar from "./lib/components/TopBar/TopBar.svelte";
  import Info from "./lib/components/InfoBox/Info.svelte";
  import Config from "./lib/Config.svelte";
  import ContextMenu from "./lib/components/ContextMenu/ContextMenu.svelte";
  import Tooltip from "./lib/components/Tooltip.svelte";
  import FocusPanel from "./lib/components/Focus/FocusPanel.svelte";
  import { zen } from "./lib/focus/store";
  import { getDefaultBackground } from "./lib/backgrounds";

  let activeTrackCount = 0;
  let mainTrackPlaying = false;
  let backgroundIsLoading = false;
  let initialBackgroundRequestId = 0;
  let ambientSounds = { rain: false, thunder: false, jungle: false, campfire: false };

  $: showEffectsWarning =
    mainTrackPlaying &&
    activeTrackCount === 9 &&
    Object.values(ambientSounds).every(Boolean);

  onMount(() => {
    const handleTrackState = (event: CustomEvent) => {
      activeTrackCount = event.detail?.count || 0;
    };
    const handleAmbientState = (event: CustomEvent) => {
      const { id, active } = event.detail || {};
      if (id in ambientSounds) ambientSounds = { ...ambientSounds, [id]: Boolean(active) };
    };
    const handleMainTrackState = (event: CustomEvent) => {
      mainTrackPlaying = Boolean(event.detail?.isPlaying);
    };
    const handleBackgroundLoading = (event: CustomEvent) => {
      backgroundIsLoading = Boolean(event.detail?.isLoading);
      if (backgroundIsLoading) initialBackgroundRequestId += 1;
    };
    window.addEventListener("ambient-tracks-changed", handleTrackState);
    window.addEventListener("ambient-sound-state-changed", handleAmbientState);
    window.addEventListener("lofi-play-state-changed", handleMainTrackState);
    window.addEventListener("background-loading-changed", handleBackgroundLoading);

    // Initialize direction
    document.documentElement.dir = $dir;
    document.documentElement.lang = $locale;

    const bgEl = document.getElementById("bg");
    const bgType = localStorage.getItem("bg-type") || "default";

    if (bgEl) {
      const setBackgroundImage = (src: string) => {
        const requestId = ++initialBackgroundRequestId;
        backgroundIsLoading = true;
        const img = new Image();
        img.onload = () => {
          if (requestId !== initialBackgroundRequestId) return;
          bgEl.style.backgroundImage = `url('${src}')`;
          backgroundIsLoading = false;
        };
        img.onerror = () => {
          if (requestId !== initialBackgroundRequestId) return;
          backgroundIsLoading = false;
        };
        img.src = src;
      };

      if (bgType === "custom") {
        const customBgId = localStorage.getItem("custom-bg-id");
        if (customBgId) {
          import("./lib/localDB").then(async ({ default: localDB }) => {
            const saved = await localDB.getItem("custom-backgrounds");
            if (saved) {
              const customs = JSON.parse(saved) as Array<{ id: string; dataUrl: string }>;
              const match   = customs.find((b) => b.id === customBgId);
              if (match) {
                setBackgroundImage(match.dataUrl);
              }
            }
          });
        }
      } else {
        const id = localStorage.getItem("bg-id") || "1";
        const src = getDefaultBackground(id).url;
        setBackgroundImage(src);
      }
    }
    return () => {
      window.removeEventListener("ambient-tracks-changed", handleTrackState);
      window.removeEventListener("ambient-sound-state-changed", handleAmbientState);
      window.removeEventListener("lofi-play-state-changed", handleMainTrackState);
      window.removeEventListener("background-loading-changed", handleBackgroundLoading);
    };
  });

  $: {
    if (typeof document !== "undefined") {
      document.documentElement.dir = $dir;
      document.documentElement.lang = $locale;
    }
  }
</script>

<main id="bg" class="container">
  {#if backgroundIsLoading}
    <div class="background-loading" role="status" aria-label="Loading background">
      <div class="background-spinner"></div>
    </div>
  {/if}
  <Config />
  <TopBar />
  <section class="content">
    <div class="track-list-slot"><TrackList /></div>
    <Controls />
    <Info />
  </section>
  <PlayButton />
  <FocusPanel showEffectsWarning={showEffectsWarning} />
  <ContextMenu />
  <Tooltip />
</main>

<style>
  .container {
    max-width: 100vw;
    max-height: 100vh;
    height: 100vh;
    position: relative;
    overflow: hidden;
    background-color: #0a0a0a;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    transition: background-image 0.3s ease;
  }

  .background-loading {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: grid;
    place-items: center;
    pointer-events: none;
  }

  .background-spinner {
    width: 24px;
    height: 24px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: background-spin 0.8s linear infinite;
  }

  @keyframes background-spin {
    to {
      transform: rotate(360deg);
    }
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

  .track-list-slot {
    display: contents;
  }

</style>
