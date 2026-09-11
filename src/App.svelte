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
    window.addEventListener("ambient-tracks-changed", handleTrackState);
    window.addEventListener("ambient-sound-state-changed", handleAmbientState);
    window.addEventListener("lofi-play-state-changed", handleMainTrackState);

    // Initialize direction
    document.documentElement.dir = $dir;
    document.documentElement.lang = $locale;

    const bgEl = document.getElementById("bg");
    const bgType = localStorage.getItem("bg-type") || "default";

    if (bgEl) {
      if (bgType === "custom") {
        const customBgId = localStorage.getItem("custom-bg-id");
        if (customBgId) {
          import("./lib/localDB").then(async ({ default: localDB }) => {
            const saved = await localDB.getItem("custom-backgrounds");
            if (saved) {
              const customs = JSON.parse(saved) as Array<{ id: string; dataUrl: string }>;
              const match   = customs.find((b) => b.id === customBgId);
              if (match) {
                const img  = new Image();
                img.onload = () => {
                  bgEl.style.backgroundImage = `url('${match.dataUrl}')`;
                };
                img.src = match.dataUrl;
              }
            }
          });
        }
      } else {
        const id = localStorage.getItem("bg-id") || "1";
        const src = getDefaultBackground(id).url;
        const img = new Image();
        img.onload = () => {
          bgEl.style.backgroundImage = `url('${src}')`;
        };
        img.src = src;
      }
    }
    return () => {
      window.removeEventListener("ambient-tracks-changed", handleTrackState);
      window.removeEventListener("ambient-sound-state-changed", handleAmbientState);
      window.removeEventListener("lofi-play-state-changed", handleMainTrackState);
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
