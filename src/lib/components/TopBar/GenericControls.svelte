<script lang="ts">
  import { IconCopy, IconMinus, IconSquare, IconX } from "@tabler/icons-svelte";
  import { onMount } from "svelte";
  
  let isMaximized = false;

  export let appWindow;
  export let noSideEffect = false;

  let pollInterval: ReturnType<typeof setInterval>;

  onMount(() => {
    const close = document.getElementById("close-maximaze-wl");
    const minimize = document.getElementById("minimize-wl");
    const maximize = document.getElementById("maximaze-wl");

    const handleClose = () => {
      appWindow.close();
    };

    const handleMinimize = () => {
      appWindow.minimize();
    };

    const handleMaximize = () => {
      if (isMaximized) {
        appWindow.unmaximize();
      } else {
        appWindow.maximize();
      }
      isMaximized = !isMaximized;
    };

    close.addEventListener("click", handleClose);
    minimize.addEventListener("click", handleMinimize);
    maximize.addEventListener("click", handleMaximize);

    // watch if window is maximized
    // from other sources apart from top bar
    if (!noSideEffect) {
      pollInterval = setInterval(() => {
        appWindow.isMaximized().then((maximized) => {
          isMaximized = maximized;
          // Remove the rounded corners when maximized
          if (isMaximized) {
            document.body.style.borderRadius = "0px";
          } else {
            document.body.style.borderRadius = "10px";
          }
        });
      }, 300);
    }

    return () => {
      close.removeEventListener("click", handleClose);
      minimize.removeEventListener("click", handleMinimize);
      maximize.removeEventListener("click", handleMaximize);
      if (pollInterval) clearInterval(pollInterval);
    };
  });
</script>

<div class="controls">
  <div class="minimize" id="minimize-wl">
    <IconMinus size={14} />
  </div>
  <div class="maximize" id="maximaze-wl">
    {#if isMaximized}
      <IconCopy size={14} />
    {:else}
      <IconSquare size={12} />
    {/if}
  </div>
  <div class="close" id="close-maximaze-wl">
    <IconX size={14} />
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
    width: 18px;
    height: 18px;
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