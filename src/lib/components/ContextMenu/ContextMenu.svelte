<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    IconPlayerPlay,
    IconPlayerPause,
    IconRefresh,
    IconCloudRain,
    IconCloudStorm,
    IconTrees,
    IconCampfire,
    IconInfoCircle,
  } from "@tabler/icons-svelte";

  let visible = false;
  let x = 0;
  let y = 0;
  let isPlaying = false;

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    visible = true;
    x = e.clientX;
    y = e.clientY;

    // Adjust position if it goes off screen
    if (x + 200 > window.innerWidth) {
      x = window.innerWidth - 210;
    }
    if (y + 300 > window.innerHeight) {
      y = window.innerHeight - 310;
    }
  }

  function handleClickOutside(e: MouseEvent) {
    if (visible) {
      visible = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && visible) {
      visible = false;
    }
  }

  function togglePlay() {
    window.dispatchEvent(new CustomEvent("lofi-toggle-play"));
    visible = false;
  }

  function reload() {
    window.location.reload();
  }

  function toggleEffect(effect: string) {
    window.dispatchEvent(new CustomEvent(`lofi-toggle-${effect}`));
    visible = false; 
  }

  function openAbout() {
    window.dispatchEvent(new CustomEvent("lofi-toggle-info"));
    visible = false;
  }

  function handlePlayStateChange(e: CustomEvent) {
    isPlaying = e.detail.isPlaying;
  }

  onMount(async () => {
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("lofi-play-state-changed", handlePlayStateChange as EventListener);
  });

  onDestroy(() => {
    window.removeEventListener("contextmenu", handleContextMenu);
    window.removeEventListener("click", handleClickOutside);
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("lofi-play-state-changed", handlePlayStateChange as EventListener);
  });
</script>

{#if visible}
  <div
    class="context-menu"
    style="top: {y}px; left: {x}px;"
    on:click|stopPropagation
    on:contextmenu|preventDefault
  >
    <button class="menu-item" on:click={togglePlay}>
      <span class="icon">
        {#if isPlaying}
          <IconPlayerPause size={16} />
        {:else}
          <IconPlayerPlay size={16} />
        {/if}
      </span>
      <span>{isPlaying ? "Pause" : "Play"}</span>
    </button>
    
    <div class="divider"></div>

    <button class="menu-item" on:click={() => toggleEffect('rain')}>
      <span class="icon"><IconCloudRain size={16} /></span>
      <span>Toggle Rain</span>
    </button>
    <button class="menu-item" on:click={() => toggleEffect('thunder')}>
      <span class="icon"><IconCloudStorm size={16} /></span>
      <span>Toggle Thunder</span>
    </button>
    <button class="menu-item" on:click={() => toggleEffect('jungle')}>
      <span class="icon"><IconTrees size={16} /></span>
      <span>Toggle Jungle</span>
    </button>
    <button class="menu-item" on:click={() => toggleEffect('campfire')}>
      <span class="icon"><IconCampfire size={16} /></span>
      <span>Toggle Campfire</span>
    </button>

    <div class="divider"></div>

    <button class="menu-item" on:click={reload}>
      <span class="icon"><IconRefresh size={16} /></span>
      <span>Reload</span>
    </button>
    
    <div class="divider"></div>

    <button class="menu-item" on:click={openAbout}>
      <span class="icon"><IconInfoCircle size={16} /></span>
      <span>About</span>
    </button>
  </div>
{/if}

<style>
  .context-menu {
    position: fixed;
    z-index: 9999;
    width: 200px;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 6px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    gap: 2px;
    animation: fade-in 0.1s ease-out;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 12px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.9);
    font-family: inherit;
    font-size: 14px;
    text-align: left;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.2s;
  }

  .menu-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    width: 20px;
  }

  .divider {
    height: 1px;
    background-color: rgba(255, 255, 255, 0.1);
    margin: 4px 0;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
