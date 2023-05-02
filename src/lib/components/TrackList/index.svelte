<script lang="ts">
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
  setTimeout(() => {
    for (let i = 1; i < 10; i++) {
      window.addEventListener("keydown", (e) => {
        if (e.key === i.toString()) {
          tracks[i - 1].isPlaying = !tracks[i - 1].isPlaying;
          if (tracks[i - 1].isPlaying) {
            const audio = new Audio(
              `/assets/engine/tracks/${tracks[i - 1].track}`
            );
            audio.play();
            audio.loop = true;
            activeAudios.push({
              id: tracks[i - 1].id,
              audio,
            });
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
  }, 28000); // Wait for carousel to appear (bug fix)
</script>

<div class="track-list">
  <div class="wrapper">
    <div class="carousel">
      {#each tracks as track}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          on:click={() => {
            if (track.isPlaying) {
              // Pause playing track
              activeAudios.forEach((item) => {
                if (item.id === track.id) {
                  item.audio.pause();
                }
              });
              track.isPlaying = false;
            } else {
              // Play track
              const audio = new Audio(`/assets/engine/tracks/${track.track}`);
              audio.play();
              audio.loop = true;
              activeAudios.push({
                id: track.id,
                audio,
              });
              track.isPlaying = true;
            }
          }}
          class="carousel__item"
        >
          <div class="carousel__item-body">
            <img
              class="carousel__item-body__img"
              src="/assets/images/{track.id}.jpg"
              alt=""
            />
            <div>
              <p id="title">Track {track.id}</p>
              <p id="info">{track?.qoute}</p>
              {#if track.isPlaying}
                <div class="count" />
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
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
    animation: bug_fix_anim 32s linear 1;
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

  .carousel__item {
    display: flex;
    align-items: center;
    position: absolute;
    width: 100%;
    opacity: 0;
    will-change: transform, opacity;
    animation: carousel-animate-vertical 30s linear infinite;
  }
  .carousel__item-body {
    position: relative;
    width: 100%;
    color: white;
    border-radius: 8px;
    padding-right: 15px;
    display: flex;
    gap: 20px;
    min-width: max-content;
    background-color: rgba(0, 0, 0, 30%);
    backdrop-filter: blur(10px);
  }

  .carousel__item-body__img {
    width: 80px;
    min-width: 80px;
    height: 80px;
    margin: 10px;
    border-radius: 5px;
    overflow: hidden;
  }
  #title {
    font-size: 16px;
    font-weight: 600;
  }
  #info {
    display: flex;
    flex-wrap: wrap;
    font-size: 11px;
  }
  .count {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: white;
    color: black;
  }

  .carousel__item:nth-child(1) {
    -webkit-animation-delay: calc(3.3333333333s * -1);
    animation-delay: calc(3.3333333333s * -1);
  }

  .carousel__item:nth-child(2) {
    -webkit-animation-delay: calc(3.3333333333s * 0);
    animation-delay: calc(3.3333333333s * 0);
  }

  .carousel__item:nth-child(3) {
    -webkit-animation-delay: calc(3.3333333333s * 1);
    animation-delay: calc(3.3333333333s * 1);
  }

  .carousel__item:nth-child(4) {
    -webkit-animation-delay: calc(3.3333333333s * 2);
    animation-delay: calc(3.3333333333s * 2);
  }

  .carousel__item:nth-child(5) {
    -webkit-animation-delay: calc(3.3333333333s * 3);
    animation-delay: calc(3.3333333333s * 3);
  }

  .carousel__item:nth-child(6) {
    -webkit-animation-delay: calc(3.3333333333s * 4);
    animation-delay: calc(3.3333333333s * 4);
  }

  .carousel__item:nth-child(7) {
    -webkit-animation-delay: calc(3.3333333333s * 5);
    animation-delay: calc(3.3333333333s * 5);
  }

  .carousel__item:nth-child(8) {
    -webkit-animation-delay: calc(3.3333333333s * 6);
    animation-delay: calc(3.3333333333s * 6);
  }

  .carousel__item:last-child {
    -webkit-animation-delay: calc(-3.3333333333s * 2);
    animation-delay: calc(-3.3333333333s * 2);
  }

  @keyframes carousel-animate-vertical {
    0% {
      transform: translateY(100%) scale(0.5);
      opacity: 0;
      visibility: hidden;
    }
    3%,
    11.1111111111% {
      transform: translateY(100%) scale(0.7);
      opacity: 0.4;
      visibility: visible;
    }
    14.1111111111%,
    22.2222222222% {
      transform: translateY(0) scale(1);
      opacity: 1;
      visibility: visible;
    }
    25.2222222222%,
    33.3333333333% {
      transform: translateY(-100%) scale(0.7);
      opacity: 0.4;
      visibility: visible;
    }
    36.3333333333% {
      transform: translateY(-100%) scale(0.5);
      opacity: 0;
      visibility: visible;
    }
    100% {
      transform: translateY(-100%) scale(0.5);
      opacity: 0;
      visibility: hidden;
    }
  }
  /* Display after the bug of 8th child is gone */
  @keyframes bug_fix_anim {
    0% {
      opacity: 0;
      z-index: -100;
    }
    100% {
      opacity: 1;
      z-index: 20;
    }
  }
</style>
