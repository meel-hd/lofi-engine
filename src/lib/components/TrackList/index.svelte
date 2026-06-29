<script lang="ts">
  import { IconChevronDown } from "@tabler/icons-svelte";
  import TrackListItem from "./TrackListItem.svelte";
  import { onMount, onDestroy } from "svelte";

  let tracks = [
    {
      id: 1,
      track: "Wind-Mark_DiAngelo-1940285615.mp3",
      isPlaying: false,
    },
    {
      id: 2,
      track: "small-waves-onto-the-sand-143040.mp3",
      isPlaying: false,
    },
    {
      id: 3,
      track: "night-ambience-17064.mp3",
      isPlaying: false,
    },
    {
      id: 4,
      track: "urban-seagulls-30068.mp3",
      isPlaying: false,
    },
    {
      id: 5,
      track: "office-ambience-6322.mp3",
      isPlaying: false,
    },
    {
      id: 6,
      track: "city-ambience-9272.mp3",
      isPlaying: false,
    },
    {
      id: 7,
      track: "old-server-turning-on-and-off-24540.mp3",
      isPlaying: false,
    },
    {
      id: 8,
      track: "train-to-munich-germany.mp3",
      isPlaying: false,
    },
    {
      id: 9,
      track: "underwater-white-noise-46423.mp3",
      isPlaying: false,
    },
  ];

  let activeAudios = [];
  let isMobileHidden = false; // Used to hide track list on mobile due to tight space

  // Visible tracks animation
  let visibleTrackId = 1;

  function nextTrack() {
    visibleTrackId < 9 ? visibleTrackId++ : (visibleTrackId = 1);
  }
  function prevTrack() {
    visibleTrackId > 1 ? visibleTrackId-- : (visibleTrackId = 9);
  }

  let lastScrollTime = 0;
  const SCROLL_THROTTLE = 100; // ms

  function handleScroll(event: WheelEvent) {
    const currentTime = Date.now();
    if (currentTime - lastScrollTime < SCROLL_THROTTLE) return;

    if (event.deltaY > 0) {
      nextTrack();
      lastScrollTime = currentTime;
    } else if (event.deltaY < 0) {
      prevTrack();
      lastScrollTime = currentTime;
    }
  }

  function getSavedVolume(id) {
    const saved = localStorage.getItem(`audioVolume:${id}`);
    return saved !== null ? Number(saved) : 0.5;
  }

  // Single source of truth for starting/stopping a track's audio.
  // All control paths (click, number keys, "k", Auto-DJ) funnel through here.
  function setTrack(id, shouldPlay) {
    const track = tracks[id - 1];
    if (!track) return;
    if (shouldPlay) {
      // Never create a second Audio for a track that is already playing
      if (!activeAudios.some((item) => item.id === id)) {
        const audio = new Audio(`assets/engine/tracks/${track.track}`);
        audio.loop = true;
        audio.volume = getSavedVolume(id);
        audio.play().catch(() => {});
        activeAudios.push({ id, audio });
      }
      track.isPlaying = true;
      visibleTrackId = id;
    } else {
      activeAudios.forEach((item) => {
        if (item.id === id) {
          item.audio.pause();
        }
      });
      // Remove the entry so it can't leak (single source of truth)
      activeAudios = activeAudios.filter((item) => item.id !== id);
      track.isPlaying = false;
    }
    activeAudios = activeAudios; // Keep parent + children sharing one reference
    tracks = tracks; // Trigger reactivity
  }

  function toggleTrack(id) {
    setTrack(id, !tracks[id - 1].isPlaying);
  }

  function stopAllTracks() {
    activeAudios.forEach((item) => item.audio.pause());
    activeAudios = [];
    tracks.forEach((track) => (track.isPlaying = false));
    tracks = tracks; // Trigger reactivity
  }

  // Ignore shortcuts while typing in inputs/textareas/contenteditable
  function isTypingTarget(target) {
    return (
      target instanceof HTMLElement &&
      (target.closest("input, textarea") !== null || target.isContentEditable)
    );
  }

  function handleKeydown(e) {
    if (isTypingTarget(e.target)) return;

    if (e.key === "k") {
      stopAllTracks();
      return;
    }
    if (e.key === "ArrowUp") {
      prevTrack();
      return;
    }
    if (e.key === "ArrowDown") {
      nextTrack();
      return;
    }
    // Toggle a track with the number keys (1-9)
    const trackNumber = Number(e.key);
    if (Number.isInteger(trackNumber) && trackNumber >= 1 && trackNumber <= 9) {
      toggleTrack(trackNumber);
    }
  }

  onMount(() => {
    const handleToggleTrack = (e: CustomEvent) => {
      if (e.detail && e.detail.id) {
        toggleTrack(e.detail.id);
      }
    };
    const handleSettingsOpen = (e: CustomEvent) => {
      if (e.detail && e.detail.isActive !== undefined) {
        isMobileHidden = e.detail.isActive;
      }
    };
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("lofi-toggle-track", handleToggleTrack);
    window.addEventListener("settings-open-changed", handleSettingsOpen);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("lofi-toggle-track", handleToggleTrack);
      window.removeEventListener("settings-open-changed", handleSettingsOpen);
    };
  });

  onDestroy(() => {
    activeAudios.forEach((item) => item.audio.pause());
    activeAudios = [];
  });
</script>

<div
  class={"track-list" + (isMobileHidden ? " mobile-hidden" : "")}
  on:wheel={handleScroll}
>
  <div class="wrapper">
    <div class="carousel">
      {#each tracks as track}
        <TrackListItem
          {activeAudios}
          {track}
          {visibleTrackId}
          onToggle={toggleTrack}
          setMeVisible={(id) => (visibleTrackId = id)}
        />
      {/each}
    </div>
  </div>
  <div id="btn-view">
    <button id="navigate-btn" class="glass" on:click={prevTrack}>
      <IconChevronDown />
    </button>
  </div>
</div>

<style>
  .track-list {
    width: 28vw;
    height: 65vh;
    padding: 20px 10px;
    border-radius: 20px;
    z-index: 20;
  }

  .wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .carousel {
    position: relative;
    width: 100%;
    max-width: 500px;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  #btn-view {
    width: 120%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #navigate-btn {
    width: 30px;
    height: 30px;
    color: white;
    border-radius: 99px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #navigate-btn:hover {
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
  }

  @media only screen and (max-width: 600px) {
    .track-list {
      width: 100vw;
      margin-top: 40px;
      height: 45vh;
    }
    #btn-view {
      width: 100%;
    }
    .mobile-hidden {
      display: none;
    }
  }
</style>
