<script lang="ts">
  import {
    IconCheck,
    IconChevronDown,
    IconDotsVertical,
    IconTarget,
    IconX,
  } from "@tabler/icons-svelte";
  import { onMount } from "svelte";
  import {
    activePanel,
    currentTaskId,
    taskActions,
    tasks,
  } from "../../focus/store";
  import { t } from "../../locales/store";

  let draft = "";
  let completedOpen = false;
  let menuTaskId: string | null = null;
  let menuPosition = { top: 0, left: 0 };
  $: active = $tasks.filter((task) => !task.done);
  $: completed = $tasks.filter((task) => task.done);

  function add() {
    taskActions.add(draft);
    draft = "";
  }

  function complete(id: string) {
    taskActions.toggle(id);
    completedOpen = true;
    menuTaskId = null;
    if ($currentTaskId === id)
      currentTaskId.set(active.find((task) => task.id !== id)?.id ?? null);
  }

  function toggleActive(id: string) {
    currentTaskId.update((current) => (current === id ? null : id));
    menuTaskId = null;
  }

  function remove(id: string) {
    taskActions.remove(id);
    menuTaskId = null;
  }

  function toggleMenu(id: string, event: MouseEvent) {
    const trigger = event.currentTarget as HTMLElement;
    const rect = trigger.getBoundingClientRect();
    menuPosition = { top: rect.bottom + 6, left: rect.right };
    menuTaskId = menuTaskId === id ? null : id;
  }

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        node.remove();
      },
    };
  }

  onMount(() => {
    const closeMenu = () => (menuTaskId = null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  });
</script>

<aside class="panel" aria-label={$t.focus.tasks}>
  <header>
    <h2>{$t.focus.tasks}</h2>
    <button
      class="close"
      aria-label={$t.focus.close_tasks}
      on:click={() => activePanel.set(null)}
      ><IconX color="white" size={17} /></button
    >
  </header>

  <form class="composer" on:submit|preventDefault={add}>
    <input
      bind:value={draft}
      maxlength="200"
      placeholder={$t.focus.placeholder}
    />
    <button>{$t.focus.add}</button>
  </form>

  <div class="list">
    {#each active as task (task.id)}
      <div class:current={task.id === $currentTaskId} class="row">
        <span
          class="status-dot"
          class:active={task.id === $currentTaskId}
          data-tooltip={task.id === $currentTaskId
            ? $t.focus.active
            : $t.focus.inactive}
        ></span>
        <span class="name">
          <span class="title">{task.title}</span>
          {#if task.pomodoros > 0}
            <small
              data-tooltip={`${task.pomodoros} ${$t.focus.pomodoros_completed}`}
              >{task.pomodoros} 🍅</small
            >
          {/if}
        </span>
        <button
          class="more"
          data-tooltip={$t.focus.task_actions}
          aria-label={`${$t.focus.task_actions}: ${task.title}`}
          on:click|stopPropagation={(event) => toggleMenu(task.id, event)}
        >
          <IconDotsVertical size={14} />
        </button>
        {#if menuTaskId === task.id}
          <div
            class="task-menu glass"
            style={`top:${menuPosition.top}px;left:${menuPosition.left}px`}
            use:portal
            on:click|stopPropagation
          >
            <button on:click={() => toggleActive(task.id)}><IconTarget size={14} /> {task.id === $currentTaskId ? $t.focus.unselect : $t.focus.select}</button>
            <button on:click={() => complete(task.id)}><IconCheck size={14} /> {$t.focus.complete}</button>
            <button on:click={() => remove(task.id)}><IconX size={14} /> {$t.focus.remove}</button>
          </div>
        {/if}
      </div>
    {:else}
      <p class="empty">{$t.focus.empty}</p>
    {/each}
  </div>

  {#if completed.length}
    <button class="accordion" on:click={() => (completedOpen = !completedOpen)}>
      <span>{$t.focus.completed} · {completed.length}</span>
      <span class:rotated={completedOpen} class="chevron"
        ><IconChevronDown size={16} /></span
      >
    </button>
    {#if completedOpen}
      <div class="completed">
        {#each completed as task (task.id)}
          <div class="row done">
            <span class="status-dot" data-tooltip={$t.focus.completed_task}
            ></span>
            <span class="name">
              <span class="title">{task.title}</span>
              {#if task.pomodoros > 0}
                <small
                  data-tooltip={`${task.pomodoros} ${$t.focus.pomodoros_completed}`}
                  >{task.pomodoros} 🍅</small
                >
              {/if}
            </span>
            <button
              class="more"
              data-tooltip={$t.focus.task_actions}
              aria-label={`${$t.focus.task_actions}: ${task.title}`}
              on:click|stopPropagation={(event) => toggleMenu(task.id, event)}
            >
              <IconDotsVertical size={14} />
            </button>
            {#if menuTaskId === task.id}
              <div
                class="task-menu glass"
                style={`top:${menuPosition.top}px;left:${menuPosition.left}px`}
                use:portal
                on:click|stopPropagation
              >
                <button on:click={() => { taskActions.toggle(task.id); menuTaskId = null; }}><IconCheck size={14} /> {$t.focus.incomplete}</button>
                <button on:click={() => remove(task.id)}><IconX size={14} /> {$t.focus.remove}</button>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</aside>

<style>
  .panel {
    position: relative;
    width: min(480px, 80vw);
    min-height: 360px;
    padding: 34px 28px 28px;
    box-sizing: border-box;
    border: 0;
    border-radius: 20px;
    background: var(--glass-background);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    box-shadow: 0 16px 45px #0008;
    color: #fff;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: -16px;
  }
  h2 {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
  }
  button {
    color: #fff;
    border: 0;
    background: transparent;
    cursor: pointer;
  }
  .close {
    padding: 0;
  }
  .composer {
    display: flex;
    gap: 8px;
    margin: 18px 0 10px;
  }
  .composer input {
    flex: 1;
    min-width: 0;
    padding: 8px 12px;
    color: #fff;
    background: rgba(0, 0, 0, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    outline: 0;
  }
  .composer input:focus {
    border-color: rgba(255, 255, 255, 0.8);
  }
  .composer input::placeholder {
    color: rgba(255, 255, 255, 0.48);
    opacity: 1;
  }
  .composer button {
    padding: 8px 15px;
    color: #111;
    background: #fff;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
  }
  .list {
    max-height: 270px;
    overflow: auto;
  }
  .row {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 38px;
  }
  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #ffffff45;
  }
  .status-dot.active {
    background: #71c98b;
    box-shadow: 0 0 8px #71c98b;
  }
  .name {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 0;
    color: #fff;
    text-align: left;
    font-size: 13px;
  }
  .title {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
  }
  .name small {
    margin-left: auto;
    flex: 0 0 auto;
    color: #ffffff80;
    font-size: 11px;
  }
  .more {
    padding: 4px;
    color: #fff;
    opacity: 0.58;
    transition: opacity 160ms ease;
  }
  .row:hover .more,
  .more:focus-visible {
    opacity: 1;
  }
  .task-menu {
    position: fixed;
    z-index: 1100;
    display: grid;
    min-width: 158px;
    padding: 5px;
    border-radius: 10px;
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
    transform: translateX(-100%);
  }
  .task-menu button {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 8px;
    border-radius: 6px;
    color: rgba(255, 255, 255, 0.82);
    font-size: 11px;
    text-align: left;
  }
  .task-menu button:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
  .empty {
    margin: 20px 0;
    color: #ffffff80;
    font-size: 12px;
  }
  .accordion {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    padding: 10px 0;
    color: #ffffffaa;
    font-size: 12px;
  }
  .chevron {
    display: inline-flex;
    transition: transform 220ms ease;
  }
  .chevron.rotated {
    transform: rotate(180deg);
  }
  .completed {
    animation: expand 180ms ease-out;
  }
  .done .name {
    color: #ffffff70;
    text-decoration: line-through;
  }
  .done .status-dot {
    background: #ffffff35;
  }
  @keyframes expand {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @media only screen and (max-width: 600px) {
    .panel {
      width: calc(80vw + 40px);
    }
  }
</style>
