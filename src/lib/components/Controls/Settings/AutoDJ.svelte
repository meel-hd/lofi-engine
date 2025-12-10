<script lang="ts">
  import { onMount } from "svelte";

  let mode = "MUSIC";

  const MODES = [
    { id: "MUSIC", label: "Music", desc: "Just the beat and chords. No atmosphere or world effects." },
    { id: "ATMOSPHERE", label: "Atmosphere", desc: "Adds the core weather and nature effects" },
    { id: "WORLD", label: "World", desc: "Adds the specific textures like city, wind, etc." },
    { id: "MANUAL", label: "Manual", desc: "No automatic changes. Full user control." },
  ];

  onMount(() => {
    mode = localStorage.getItem("AutoDJMode") || "MUSIC";
  });

  function updateMode(newMode) {
    mode = newMode;
    localStorage.setItem("AutoDJMode", mode);
    window.dispatchEvent(
      new CustomEvent("auto-dj-mode-changed", { detail: { mode } })
    );
  }
</script>

<div class="auto-dj-container">
  <h4>Immersion</h4>
  <div class="modes">
    {#each MODES as m}
      <button
        class:active={mode === m.id}
        on:click={() => updateMode(m.id)}
        title={m.desc}
      >
        {m.label}
      </button>
    {/each}
  </div>
  <small class="desc">{MODES.find(m => m.id === mode)?.desc}</small>
</div>

<style>
  .auto-dj-container {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  h4 {
    margin-left: 10px;
    margin-bottom: 10px;
  }

  .modes {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 0 10px;
  }

  button {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 8px 12px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.9em;
    transition: all 0.2s;
  }

  button:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  button.active {
    background: white;
    color: black;
    border-color: white;
    font-weight: bold;
  }

  .desc {
    display: block;
    margin-top: 10px;
    margin-left: 10px;
    font-size: 0.8em;
    color: rgba(255, 255, 255, 0.7);
    font-style: italic;
  }
</style>
