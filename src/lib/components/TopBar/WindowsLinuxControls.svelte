<script lang="ts">
  import { IconCopy, IconMinus, IconSquare, IconX } from "@tabler/icons-svelte";
  import { appWindow } from "@tauri-apps/api/window";
  import { onMount } from "svelte";

  let isMaximized = false;

  onMount(() => {
    const close = document.getElementById("close-maximaze-wl");
    const minimize = document.getElementById("minimize-wl");
    const maximize = document.getElementById("maximaze-wl");

    close.addEventListener("click", () => {
      appWindow.close();
    });

    minimize.addEventListener("click", () => {
      appWindow.minimize();
    });

    maximize.addEventListener("click", () => {
      if (isMaximized) {
        appWindow.unmaximize();
      } else {
        appWindow.maximize();
      }
      isMaximized = !isMaximized;
    });

    // watch if window is maximized
    // from other sources apart from top bar
    setInterval(() => {
      appWindow.isMaximized().then((maximized) => {
        isMaximized = maximized;
      });
    }, 300);
  });
</script>

<div class="controls">
  <div class="minimize" id="minimize-wl">
    <IconMinus size={10} />
  </div>
  <div class="maximize" id="maximaze-wl">
    {#if isMaximized}
      <IconCopy size={10} />
    {:else}
      <IconSquare size={10} />
    {/if}
  </div>
  <div class="close" id="close-maximaze-wl">
    <IconX size={10} />
  </div>
</div>

<style>
  .controls {
    position: absolute;
    right: 35px;
    display: flex;
    gap: 15px;
    color: white;
  }
  .controls div {
    width: 13px;
    height: 13px;
    background-color: transparent;
    cursor: pointer;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .close:hover {
    background-color: #ff5f56;
  }
  .minimize:hover {
    background-color: #ffffff80;
  }
  .maximize:hover {
    background-color: #ffffff80;
  }
</style>
