<script lang="ts">
  import { IconSettings } from "@tabler/icons-svelte";
  import ChangeBg from "./ChangeBg.svelte";
  import { onMount } from "svelte";

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
  // to excute old settings
  onMount(() => {
    toggle();
    setTimeout(() => {
      toggle();
    }, 10);
  });
</script>

<div>
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
