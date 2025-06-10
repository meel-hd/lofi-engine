<script lang="ts">
  import { IconChevronDown, IconArrowsMaximize, IconArrowsMinimize } from "@tabler/icons-svelte";
  import TrackListItem from "./TrackListItem.svelte";

  export let isMobile = false;
  let showAllTracksOnMobile = false;

  let tracks = [
    {
      id: 1,
      track: "Wind-Mark_DiAngelo-1940285615.mp3",
      qoute: "We cannot direct the wind, but we can adjust the sails.",
      isPlaying: false,
    },
    {
      id: 2,
      track: "small-waves-onto-the-sand-143040.mp3",
      qoute: "Sea is emotion incarnate. It loves, hates, and weeps.",
      isPlaying: false,
    },
    {
      id: 3,
      track: "night-ambience-17064.mp3",
      qoute: "The night reveals the stars as the darkness reveals the self.",
      isPlaying: false,
    },
    {
      id: 4,
      track: "urban-seagulls-30068.mp3",
      qoute: "The sunset sky speaks of a thousand of colors.",
      isPlaying: false,
    },
    {
      id: 5,
      track: "office-ambience-6322.mp3",
      qoute: "Work hard in silence, let your success be your noise.",
      isPlaying: false,
    },
    {
      id: 6,
      track: "city-ambience-9272.mp3",
      qoute: "The city is not a concrete jungle, it is a human zoo.",
      isPlaying: false,
    },
    {
      id: 7,
      track: "old-server-turning-on-and-off-24540.mp3",
      qoute: "The past is a place of reference, not a place of residence.",
      isPlaying: false,
    },
    {
      id: 8,
      track: "train-to-munich-germany.mp3",
      qoute: "Trips don't last forever, but memories do.",
      isPlaying: false,
    },
    {
      id: 9,
      track: "underwater-white-noise-46423.mp3",
      qoute: "Please help me, I'm underwater.",
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
            `assets/engine/tracks/${tracks[i - 1].track}`
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
                (item) => item.id !== tracks[i - 1].id
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

  $: currentTrackForMobile = tracks.find(t => t.id === visibleTrackId);

  function toggleMobileTrackView() {
    showAllTracksOnMobile = !showAllTracksOnMobile;
  }
</script>

<div class="track-list">
  {#if isMobile}
    {#if !showAllTracksOnMobile && currentTrackForMobile}
      <!-- Compact Mobile View: Show only current track -->
      <div class="compact-view-wrapper">
        <TrackListItem
          {activeAudios}
          track={currentTrackForMobile}
          {visibleTrackId}
          setMeVisible={(id) => (visibleTrackId = id)}
        />
        <button class="mobile-track-toggle-btn" on:click={toggleMobileTrackView}>
          <IconArrowsMaximize size={20} /> Show All Tracks
        </button>
      </div>
    {:else}
      <!-- Expanded Mobile View: Show all tracks (carousel) -->
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
        <button id="navigate-btn" on:click={prevTrack} aria-label="Previous Track">
          <IconChevronDown style="transform: rotate(90deg);" />
        </button>
        <button class="mobile-track-toggle-btn" on:click={toggleMobileTrackView}>
          <IconArrowsMinimize size={20} /> Show Current Track
        </button>
        <button id="navigate-btn" on:click={nextTrack} aria-label="Next Track">
          <IconChevronDown style="transform: rotate(-90deg);" />
        </button>
      </div>
    {/if}
  {:else}
    <!-- Desktop View -->
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
       <!-- Desktop navigation can remain as is or be styled like mobile's next/prev -->
       <button id="navigate-btn" on:click={prevTrack} aria-label="Previous Track">
        <IconChevronDown style="transform: rotate(90deg);" />
      </button>
      <button id="navigate-btn" on:click={nextTrack} aria-label="Next Track">
        <IconChevronDown style="transform: rotate(-90deg);" />
      </button>
    </div>
  {/if}
</div>

<style>
  .track-list {
    width: 28vw;
    height: 65vh;
    padding: 20px 10px;
    border-radius: 20px;
    backdrop-filter: blur(0px);
    z-index: 20;
    display: flex; /* Added for centering compact view */
    flex-direction: column; /* Added for centering compact view */
    justify-content: center; /* Added for centering compact view */
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
    width: 100%; /* Adjusted from 120% for better fit */
    display: flex;
    justify-content: space-around; /* Space out buttons */
    align-items: center;
    margin-top: 10px; /* Add some space above nav buttons */
  }
  #navigate-btn { /* Applies to multiple buttons now */
    width: 40px; /* Slightly larger tap target */
    height: 40px; /* Slightly larger tap target */
    color: white;
    background-color: rgba(0,0,0,0.2);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgba(255,255,255,0.2);
  }
  #navigate-btn:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }

  .compact-view-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .mobile-track-toggle-btn {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 8px 15px;
    border-radius: 20px;
    margin-top: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9em;
  }
  .mobile-track-toggle-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }


  @media (max-width: 768px) {
    .track-list {
      width: 100%;
      height: auto; /* Keep this for expanded view */
      /* min-height is good for expanded, compact will be smaller */
      /* max-height is good for expanded */
      /* overflow-y should be auto for expanded */
      padding: 10px 5px;
      /* For compact view, ensure it doesn't take full max-height unless needed */
    }

    /* Styles for when only one track is shown */
    .track-list:has(.compact-view-wrapper) {
        min-height: unset; /* Allow compact view to shrink */
        max-height: 30vh; /* Example, or enough for one item + button */
         overflow-y: hidden; /* No scroll for single item view */
    }


    #btn-view {
      width: 100%;
      /* justify-content: space-around; is good for mobile full view */
    }
  }
</style>
