<script lang="ts">
  import { onMount } from "svelte";
  import MacControls from "./MacControls.svelte";
  import WindowsLinuxControls from "./WindowsLinuxControls.svelte";

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
    <img src="/assets/dots.svg" alt="logo" width="18" />
  </div>
  {#if currentOs !== "mac"}
    <WindowsLinuxControls />
  {/if}
</div>

<style>
  .titlebar {
    position: absolute;
    width: 100%;
    height: 26px;
    z-index: 100;
    padding: 0 10px;
    background-color: #00000030;
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
  }
  .drag {
    cursor: grab;
    margin: auto;
    opacity: 80%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 5px;
  }
  .drag:hover {
    opacity: 100%;
  }
</style>