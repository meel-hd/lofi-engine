<script lang="ts">
  import { onMount } from "svelte";
  import MacControls from "./MacControls.svelte";
  import WindowsLinuxControls from "./WindowsLinuxControls.svelte";
  import { IconSettings } from "@tabler/icons-svelte"; // Or IconMenu2

  export let isMobile = false;
  export let showControlsMobile = false; // Though not directly used to change appearance here, good to have if needed
  export let toggleControlsMobile = () => {};

  let currentOs = "null";

  onMount(() => {
    const os = window.navigator.platform;
    if (os.includes("Mac")) {
      currentOs = "mac";
    } else if (os.includes("Win")) {
      currentOs = "win";
    } else if (os.includes("Linux")) {
      currentOs = "linux";
    }
  });
</script>

<div class="titlebar" data-tauri-drag-region>
  {#if currentOs === "mac"}
    <MacControls />
  {/if}

  <div class="drag" data-tauri-drag-region>
    {#if !isMobile}
      <img src="assets/dots.svg" alt="logo" width="18" />
    {/if}
  </div>

  {#if isMobile}
    <button class="mobile-controls-toggle" on:click={toggleControlsMobile} aria-label="Toggle Controls">
      <IconSettings size={20} color="white" />
    </button>
  {/if}

  {#if currentOs !== "mac"}
    <WindowsLinuxControls />
  {/if}
</div>

<style>
  .titlebar {
    position: absolute;
    width: 100%;
    height: 26px; /* Consider if this height needs to be dynamic or larger for mobile tap target */
    z-index: 1001; /* Increased z-index */
    padding: 0 10px;
    background-color: #00000030;
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: space-between; /* Ensure controls are pushed to sides if needed */
  }
  .drag {
    cursor: grab;
    margin: auto; /* This might need adjustment if settings icon is on one side */
    opacity: 80%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 5px; /* Adjust if icon changes vertical alignment */
  }
  .drag:hover {
    opacity: 100%;
  }

  .mobile-controls-toggle {
    /* Positioned by flex justify-content: space-between on .titlebar or specific positioning */
    /* For example, if Windows/Linux controls are on the right, this could be on the left or vice-versa */
    /* Or centered if other controls are hidden on mobile */
    background: none;
    border: none;
    color: white;
    padding: 3px; /* Make it easier to tap */
    display: flex; /* For icon alignment */
    align-items: center;
    justify-content: center;
    cursor: pointer;
    /* If it's the only item on one side, it will go to that side due to justify-content: space-between */
    /* If drag region is hidden, it will be centered by margin:auto on .drag, so need to adjust */
    /* Let's assume it will be on the left, so MacControls might need to be hidden on mobile or layout adjusted */
    order: -1; /* Puts it to the left if MacControls are also visible */
  }

  /* If MacControls are present, ensure they don't overlap or hide them on mobile */
  /* Also, the drag region might need to be hidden or take less space on mobile */
  @media (max-width: 768px) {
    .drag {
      /* Potentially hide or shrink the drag region if space is an issue */
       display: none; /* Example: hiding the dots on mobile to make space for toggle */
    }
    /* Adjust Mac/Windows controls if they are present on mobile */
    /* e.g. :global(.mac-controls-selector) { display: none; } */
  }
</style>