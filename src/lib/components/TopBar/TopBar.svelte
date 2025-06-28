<script lang="ts">
  import { onMount } from "svelte";
  import MacControls from "./MacControls.svelte";
  import GenericControls from "./GenericControls.svelte";

  let barType = "generic" as  "mac" | "generic" | "hidden";

  onMount(() => {
    const userAgent = navigator.userAgent || "";
    const platform = navigator.platform || "";

    const isTauri = "__TAURI_IPC__" in window;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent);
    const noSideEffect = isMobile && !isTauri;


    if (!isTauri || isMobile) {
      barType = "hidden";
      return;
    }

    if (platform.includes("Mac")) {
      barType = "mac";
    } else {
      barType = "generic";
    } 
  });
  console.log(barType)
  console.lgo("app",app)
</script>

{#if barType !== "hidden"}
  <div class="titlebar" data-tauri-drag-region>
    {#if barType === "mac"}
      <MacControls noSideEffect />
    {/if}
    <div class="drag" data-tauri-drag-region>
      <img src="assets/dots.svg" alt="logo" width="18" />
    </div>
    {#if barType === "generic"}
      <GenericControls noSideEffect/>
    {/if}
  </div>
{/if}

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
