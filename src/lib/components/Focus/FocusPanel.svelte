<script lang="ts">
  import { onMount } from "svelte";
  import { IconYinYang } from "@tabler/icons-svelte";
  import Settings from "../Controls/Settings/index.svelte";
  import TimerView from "./TimerView.svelte";
  import TaskPanel from "./TaskPanel.svelte";
  import {
    activePanel,
    mini,
    startFocusSystem,
    timer,
    timerOpen,
    zen,
  } from "../../focus/store";
  import { t } from "../../locales/store";

  async function toggleMini() {
    if (!("__TAURI_INTERNALS__" in window)) return;
    const { getCurrentWebviewWindow } = await import(
      "@tauri-apps/api/webviewWindow"
    );
    const { LogicalSize } = await import("@tauri-apps/api/dpi");
    const { invoke } = await import("@tauri-apps/api/core");
    const nativeWindow = getCurrentWebviewWindow();
    if (!$mini) {
      const [size, position, scale] = await Promise.all([
        nativeWindow.innerSize(),
        nativeWindow.outerPosition(),
        nativeWindow.scaleFactor(),
      ]);
      const dimensions = size.toLogical(scale),
        point = position.toLogical(scale);
      await invoke("set_mini_geometry", {
        active: true,
        width: dimensions.width,
        height: dimensions.height,
        x: point.x,
        y: point.y,
        minWidth: 930,
        minHeight: 530,
      });
      await nativeWindow.setMinSize(new LogicalSize(240, 96));
      await nativeWindow.setSize(new LogicalSize(320, 120));
      await nativeWindow.setResizable(false);
      await nativeWindow.setAlwaysOnTop(true);
      mini.set(true);
    } else {
      await invoke("exit_mini");
      mini.set(false);
    }
  }
  onMount(startFocusSystem);
</script>

<div class:mini={$mini} class="focus-layer">
  <nav aria-label={$t.focus.focus} class="focus-nav">
    {#if !$zen}
      <button
        class="focus-trigger glass"
        on:click={() => {
          timerOpen.set(true);
          activePanel.set(null);
        }}
        >{#if $timer.status === "running"}<i></i>{/if}{$t.focus.focus}</button
      >
      <button
        class="glass"
        on:click={() => {
          activePanel.set("tasks");
          timerOpen.set(false);
        }}>{$t.focus.tasks}</button
      >
    {/if}
    <button
      class="zen-trigger glass"
      data-tooltip={$zen ? $t.focus.exit_zen : $t.focus.zen}
      aria-label={$zen ? $t.focus.exit_zen : $t.focus.zen}
      on:click={() => zen.update((enabled) => !enabled)}
    >
      <IconYinYang size={15} />
    </button>
    {#if !$zen}<Settings />{/if}
    {#if "__TAURI_INTERNALS__" in window}<button on:click={toggleMini}
        >{$mini ? $t.focus.normal : $t.focus.mini}</button
      >{/if}
  </nav>
  {#if $timerOpen}<div class="modal" on:click|self={() => timerOpen.set(false)}>
      <TimerView onClose={() => timerOpen.set(false)} />
    </div>{/if}
  {#if $activePanel === "tasks"}<div
      class="modal"
      on:click|self={() => activePanel.set(null)}
    >
      <TaskPanel />
    </div>{/if}
</div>

<style>
  .focus-layer {
    position: absolute;
    inset: 0;
    z-index: 25;
    color: #fff;
    pointer-events: none;
  }
  .focus-nav {
    position: absolute;
    right: 20px;
    bottom: 15px;
    display: flex;
    align-items: center;
    gap: 3px;
    pointer-events: auto;
  }
  .focus-nav button {
    height: 28px;
    box-sizing: border-box;
    color: #fff;
    border: 0;
    border-radius: 6px;
    padding: 0 9px;
    font-size: 11px;
  }
  .focus-nav button:hover {
    background: var(--glass-hover-background);
  }
  .focus-trigger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 8px !important;
  }
  .zen-trigger {
    display: grid;
    width: 28px;
    place-items: center;
    padding: 0 !important;
  }
  .focus-trigger i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #71c98b;
    box-shadow: 0 0 8px #71c98b;
  }
  .modal {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: #00000038;
    pointer-events: auto;
  }
  .modal :global(.panel) {
    position: relative !important;
    inset: auto !important;
    right: auto !important;
    left: auto !important;
    top: auto !important;
  }
  .mini .focus-nav,
  .mini .modal {
    display: none;
  }
  @media (max-width: 700px) {
    .focus-nav {
      left: 50%;
      right: auto;
      bottom: 7px;
      transform: translateX(-50%);
      flex-wrap: wrap;
      justify-content: flex-end;
    }
  }
</style>
