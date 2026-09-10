<script lang="ts">
  import { IconSettings, IconX } from "@tabler/icons-svelte";
  import Background from "./Background.svelte";
  import Volume from "./Volume.svelte";
  import { rainSpeed } from "../Rain/speed";
  import AutoDJ from "./AutoDJ.svelte";

  import { t, locale, setLocale } from "../../../locales/store";
  import { isEditableTarget } from "../../../keyboard";

  let isActive = false;

  let dialog: HTMLDialogElement;

  function syncOpenState() {
    isActive = dialog.open;
    window.dispatchEvent(
      new CustomEvent("settings-open-changed", { detail: { isActive } }),
    );
  }

  function close() {
    dialog.close();
    syncOpenState();
  }

  function toggle() {
    if (dialog.open) {
      close();
    } else {
      dialog.showModal();
      syncOpenState();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (isEditableTarget(event.target) || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key.toLowerCase() === "j") {
      event.preventDefault();
      toggle();
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) close();
  }

  const languages = [
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
    { code: "hi", label: "हिन्दी" },
    { code: "fr", label: "Français" },
    { code: "nl", label: "Nederlands" },
    { code: "ja", label: "日本語" },
    { code: "ru", label: "Русский" },
  ];
</script>

<svelte:window on:keydown={handleKeydown} />

<button
  class="settings-trigger glass"
  data-tooltip={$t.settings.title}
  aria-label={$t.settings.title}
  aria-haspopup="dialog"
  aria-expanded={isActive}
  aria-controls="settings-modal"
  on:click={toggle}
>
  <IconSettings size={15} />
</button>

<!-- Escape provides native keyboard dismissal for backdrop clicks. -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  bind:this={dialog}
  id="settings-modal"
  class="settings-container glass"
  aria-labelledby="settings-title"
  on:close={syncOpenState}
  on:click={handleBackdropClick}
>
  <div class="settings-header">
    <h3 id="settings-title">{$t.settings.title}</h3>
    <button class="close-button" aria-label="Close settings" on:click={close}>
      <IconX size={17} />
    </button>
  </div>
  <div class="settings-content">
    <div class="settings-column">
      <Background />
      <AutoDJ />
      <div class="section language-section">
        <h4>{$t.settings.language.title}</h4>
        <div class="lang-switcher">
          {#each languages as lang}
            <button
              class:active={$locale === lang.code}
              on:click={() => setLocale(lang.code)}
            >
              {lang.label}
            </button>
          {/each}
        </div>
      </div>
    </div>
    <div class="settings-column">
      <Volume />
      <section class="rain-speed-section">
        <h4><label for="rain-speed">{$t.settings.rain_speed}</label></h4>
        <input
          id="rain-speed"
          type="range"
          min="0.25"
          max="2"
          step="0.25"
          bind:value={$rainSpeed}
        />
      </section>
    </div>
  </div>
</dialog>

<style>
  .settings-trigger,
  .close-button {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    box-sizing: border-box;
    padding: 0;
    color: white;
    border: 0;
    border-radius: 6px;
  }

  .settings-trigger:hover,
  .close-button:hover {
    background: var(--glass-hover-background);
  }

  button:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }

  .settings-container {
    position: fixed;
    inset: 0;
    margin: auto;
    box-sizing: border-box;
    max-height: min(647px, calc(100dvh - 48px));
    padding: 24px;
    width: min(800px, calc(100vw - 32px));
    max-width: none;
    color: white;
    border: 0;
    border-radius: 20px;
    overflow-y: auto;
    pointer-events: auto;
    box-shadow: 0 24px 80px #00000050;
  }

  .settings-container:focus,
  .settings-container:focus-visible {
    outline: none;
  }

  .settings-container[open] {
    animation: show 0.2s ease-out;
  }

  .settings-container::backdrop {
    background: #00000060;
  }

  .settings-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
    padding-bottom: 10px;
  }

  .settings-header h3 {
    margin: 0;
    font-size: 1.5em;
    font-weight: 600;
  }

  .settings-content {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;
    align-items: start;
  }

  .settings-column {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .rain-speed-section {
    margin: 0;
  }

  #rain-speed {
    width: 90%;
    margin-left: 10px;
  }

  #rain-speed::-webkit-slider-runnable-track {
    height: 3px;
  }

  .section h4 {
    margin: 0 0 10px 0;
    font-size: 1em;
    opacity: 0.9;
  }

  .rain-speed-section h4 {
    margin: 0 0 10px;
    font-size: 1em;
    opacity: 0.9;
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

  .lang-switcher {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .lang-switcher button {
    width: auto;
    height: auto;
    padding: 6px 12px;
    font-size: 0.85em;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    aspect-ratio: auto;
    border-radius: 20px;
  }

  .lang-switcher button:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    transform: translateY(-1px);
  }

  .lang-switcher button.active {
    background: white;
    color: black;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 700px) {
    .settings-content {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .settings-container[open] {
      animation: none;
    }
  }
</style>
