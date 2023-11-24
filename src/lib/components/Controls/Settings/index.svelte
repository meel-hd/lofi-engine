<script lang="ts">
  import { IconSettings } from "@tabler/icons-svelte";
  import { onMount } from "svelte";
  import ChangeBg from "./ChangeBg.svelte";
  import Volume from "./Volume.svelte";

  let isActive = false;

  function toggle() {
    isActive = !isActive;
  }

  // Shortuct to toggle settings with "J" key
  window.addEventListener("keydown", (e) => {
    if (e.key === "j") {
      toggle();
    }
  });

  // when mounted toggle settings
  // to excute settings of children (old saved)
  onMount(() => {
    toggle();
    setTimeout(() => {
      toggle();
    }, 10);
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (
      isActive &&
      event.target instanceof HTMLElement &&
      !event.target.closest("#settings-box")
    ) {
      isActive = false;
    }
  };
  document.addEventListener("click", handleClickOutside);
</script>

<div id="settings-box">
  <button
    style={`
          background-color: ${isActive ? "white" : "transparent"};
          `}
    on:click={toggle}
  >
    <IconSettings size={25} color={isActive ? "black" : "white"} />
  </button>
  {#if isActive}
    <div class="settings-box">
      <div>
        <ChangeBg />
        <Volume />
        <small>For more information press ESC key</small>
      </div>
    </div>
  {/if}
</div>

<style>
  button {
    color: white;
    border-radius: 50%;
    aspect-ratio: 4/4;
  }
  .settings-box {
    position: absolute;
    left: 0;
    top: 70px;
    height: 58vh;
    padding: 5px 20px;
    width: 340px; /* Like controls width */
    color: white;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    background-color: rgba(0, 0, 0, 40%);
    overflow-y: auto;
    animation: show 0.4s ease-in-out;
  }
  @keyframes show {
    from {
      transform: translateY(-10%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  small {
    display: block;
    font-size: x-small;
    margin-top: 30px;
    color: azure;
  }
</style>
