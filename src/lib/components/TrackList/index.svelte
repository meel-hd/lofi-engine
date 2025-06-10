<script lang="ts">
  import { IconChevronDown, IconChevronUp } from "@tabler/icons-svelte";
  import TrackListItem from "./TrackListItem.svelte";

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
</script>

<div class="track-list">
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
    <button class="nav-track-button" on:click={prevTrack} aria-label="Previous Track">
      <IconChevronUp size={24} />
    </button>
    <button class="nav-track-button" on:click={nextTrack} aria-label="Next Track">
      <IconChevronDown size={24} />
    </button>
  </div>
</div>

<style>
  .track-list {
    width: 28vw;
    height: 65vh;
    padding: 20px 10px;
    border-radius: 20px;
    backdrop-filter: blur(0px);
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
    width: 100%;
    display: flex;
    justify-content: space-around; /* Changed from center */
    align-items: center;
    margin-top: 10px; /* Added some top margin for separation */
  }
  /* Removed #navigate-btn styles, replaced by .nav-track-button */
  .nav-track-button {
    width: 44px;
    height: 44px;
    color: white;
    background-color: rgba(0,0,0,0.15); /* Default background */
    border: 1px solid rgba(255,255,255,0.1); /* Subtle border */
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .nav-track-button:hover {
    background-color: rgba(0, 0, 0, 0.3); /* Darker on hover */
    backdrop-filter: blur(5px); /* Optional: blur on hover if desired */
  }
  .nav-track-button:active {
    background-color: rgba(0, 0, 0, 0.4); /* Even darker on active/click */
  }


  @media (max-width: 768px) {
    .track-list {
      width: 100%;
      height: auto;
      max-height: 60vh;
      min-height: 40vh;
      padding: 15px 10px;
      border-radius: 10px;
      overflow-y: hidden;
    }
  }
</style>
