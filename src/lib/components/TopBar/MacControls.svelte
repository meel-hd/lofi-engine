<script lang="ts">
  import { onMount } from "svelte";

  let isMaximized = false;
  export let appWindow;
  export let noSideEffect = false;

  let pollInterval: ReturnType<typeof setInterval>;

  onMount(() => {
    const close = document.getElementById("close-mac");
    const minimize = document.getElementById("minimize-mac");
    const maximize = document.getElementById("maximize-mac");

    const handleClose = () => {
      appWindow.close();
    };

    const handleMinimize = () => {
      appWindow.minimize();
    };

    const handleMaximize = () => {
      if (isMaximized) {
        appWindow.unmaximize();
        isMaximized = false;
      } else {
        appWindow.maximize();
        isMaximized = true;
      }
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
  <div class="close" id="close-mac" />
  <div class="minimize" id="minimize-mac" />
  <div class="maximize" id="maximize-mac" />
</div>

<style>
  .controls {
    display: flex;
    gap: 15px;
  }
  .close {
    width: 13px;
    height: 13px;
    background-color: #ff5f56;
    cursor: pointer;
    border-radius: 50%;
  }
  .minimize {
    width: 13px;
    height: 13px;
    background-color: #ffbd2e;
    cursor: pointer;
    border-radius: 50%;
  }
  .maximize {
    width: 13px;
    height: 13px;
    background-color: #27c93f;
    cursor: pointer;
    border-radius: 50%;
  }
  .maximize:hover {
    background-color: #1e9c30;
  }
  .minimize:hover {
    background-color: #e0a800;
  }
  .close:hover {
    background-color: #d63000;
  }
</style>
