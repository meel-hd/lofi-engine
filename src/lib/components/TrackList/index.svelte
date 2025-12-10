<script lang="ts">
  import { IconChevronDown } from "@tabler/icons-svelte";
  import TrackListItem from "./TrackListItem.svelte";
  import { onMount } from "svelte";

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

  // Shortcut for stoping all effects with "k" key
  window.addEventListener("keydown", (e) => {
    if (e.key === "k") {
      activeAudios.forEach((item) => {
        item.audio.pause();
      });
      console.log("activeAudios", activeAudios);
      activeAudios = [];
      tracks.forEach((track) => {
        track.isPlaying = false;
      });
    }
  });

  // Add toggle for each track with number keys
  //  through (1-9) on keyboard
  for (let i = 1; i < 10; i++) {
    window.addEventListener("keydown", (e) => {
      if (e.key === i.toString()) {
        tracks[i - 1].isPlaying = !tracks[i - 1].isPlaying;
        if (tracks[i - 1].isPlaying) {
          const audio = new Audio(
            `assets/engine/tracks/${tracks[i - 1].track}`,
          );
          audio.play();
          audio.loop = true;
          activeAudios.push({
            id: tracks[i - 1].id,
            audio,
          });
          visibleTrackId = i;
        } else {
          activeAudios.forEach((item) => {
            if (item.id === tracks[i - 1].id) {
              item.audio.pause();
              // Remove from activeAudios
              activeAudios = activeAudios.filter(
                (item) => item.id !== tracks[i - 1].id,
              );
            }
          });
        }
      }
    });
  }

  // Visible tracks animation
  let visibleTrackId = 1;
  window.addEventListener("keydown", (e) => {
    // Ignore change when event is targeting inputs
    if (e.target instanceof HTMLElement && !e.target.closest("input")) {
      if (e.key == "ArrowUp") {
        prevTrack();
      }
      if (e.key == "ArrowDown") {
        nextTrack();
      }
    }
  });

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

  function toggleTrack(id: number) {
    tracks[id - 1].isPlaying = !tracks[id - 1].isPlaying;
    if (tracks[id - 1].isPlaying) {
      const audio = new Audio(`assets/engine/tracks/${tracks[id - 1].track}`);
      audio.play();
      audio.loop = true;
      activeAudios.push({
        id: tracks[id - 1].id,
        audio,
      });
      visibleTrackId = id;
    } else {
      activeAudios.forEach((item) => {
        if (item.id === tracks[id - 1].id) {
          item.audio.pause();
          // Remove from activeAudios
          activeAudios = activeAudios.filter(
            (item) => item.id !== tracks[id - 1].id,
          );
        }
      });
    }
    tracks = tracks; // Trigger reactivity
  }

  onMount(() => {
    const handleToggleTrack = (e: CustomEvent) => {
      if (e.detail && e.detail.id) {
        toggleTrack(e.detail.id);
      }
    };
    window.addEventListener("lofi-toggle-track", handleToggleTrack);
    return () => {
      window.removeEventListener("lofi-toggle-track", handleToggleTrack);
    };
  });
</script>

<div class="track-list" on:wheel={handleScroll}>
  <div class="wrapper">
    <div class="carousel">
      {#each tracks as track}
        <TrackListItem
          {activeAudios}
          {track}
          {visibleTrackId}
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
      display: none;
    }
    #btn-view {
      display: none;
    }
  }
</style>
