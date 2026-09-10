<script lang="ts">
  import { IconChevronDown, IconTarget, IconX } from "@tabler/icons-svelte";
  import {
    config,
    currentTask,
    duration,
    formatClock,
    timer,
    timerActions,
    today,
    week,
    weekDays,
  } from "../../focus/store";
  import { locale, t } from "../../locales/store";
  export let onClose: () => void = () => {};
  let openSection: "settings" | "stats" | null = "stats";
  const minutes = (milliseconds: number) => Math.floor(milliseconds / 60_000);
  $: total = duration($timer.phase, $config);
  $: shown = $timer.status === "idle" ? total : $timer.remaining;
  $: progress = Math.max(0, Math.min(1, 1 - shown / total));
  $: label =
    $timer.status === "paused"
      ? $t.focus.paused
      : $timer.phase === "focus"
        ? $t.focus.focus
        : $timer.phase === "shortBreak"
          ? $t.focus.short_break
          : $t.focus.long_break;
  $: completedInCycle = $timer.completedRounds % $config.rounds;
  $: highestDailyFocus = Math.max(...$weekDays.map((day) => day.focusMs), 1);
  $: weekday = new Intl.DateTimeFormat($locale, { weekday: "narrow" });
</script>

<section
  class:break={$timer.phase !== "focus"}
  class="timer"
  aria-label={$t.focus.focus}
>
  <button class="close" aria-label={$t.focus.close_timer} on:click={onClose}>
    <IconX color="white" size={17} />
  </button>
  <div class="phase">
    <i class:running={$timer.status === "running"}></i>
    <span>{label}</span>
    {#if $timer.status !== "idle"}
      <span
        class="rounds"
        aria-label={`${completedInCycle}/${$config.rounds} ${$t.focus.rounds_complete}`}
      >
        {#each Array($config.rounds) as _, index}
          <i class:done={index < completedInCycle} />
        {/each}
      </span>
    {/if}
  </div>
  <div class="clock">{formatClock(shown)}</div>
  <div class="progress"><i style={`width:${progress * 100}%`}></i></div>
  {#if $currentTask}
    <div class="task">
      <IconTarget size={13} />
      <span>{$t.focus.working_on}</span>
      <b>{$currentTask.title}</b>
    </div>
  {/if}
  <div class="actions">
    <button class="primary" on:click={() => timerActions.toggle()}>
      {$timer.status === "running"
        ? $t.focus.pause
        : $timer.status === "paused"
          ? $t.focus.resume
          : $t.focus.start}
    </button>
    {#if $timer.status !== "idle"}
      <button on:click={() => timerActions.skip()}>{$t.focus.skip}</button>
      <button on:click={() => timerActions.end()}>{$t.focus.end}</button>
    {/if}
  </div>
  <div class="accordions">
    <button
      class:open={openSection === "settings"}
      on:click={() =>
        (openSection = openSection === "settings" ? null : "settings")}
    >
      <span>{$t.focus.settings}</span>
      <span class:rotated={openSection === "settings"} class="chevron"
        ><IconChevronDown size={16} /></span
      >
    </button>
    {#if openSection === "settings"}
      <div class="settings">
        <label
          ><span>{$t.focus.focus}</span><span class="input-row"
            ><input
              type="number"
              min="1"
              max="180"
              bind:value={$config.focus}
            /><small>{$t.focus.minutes}</small></span
          ></label
        >
        <label
          ><span>{$t.focus.short_break}</span><span class="input-row"
            ><input
              type="number"
              min="1"
              max="60"
              bind:value={$config.shortBreak}
            /><small>{$t.focus.minutes}</small></span
          ></label
        >
        <label
          ><span>{$t.focus.long_break}</span><span class="input-row"
            ><input
              type="number"
              min="1"
              max="120"
              bind:value={$config.longBreak}
            /><small>{$t.focus.minutes}</small></span
          ></label
        >
        <label
          ><span>{$t.focus.rounds}</span><span class="input-row"
            ><input
              type="number"
              min="2"
              max="12"
              bind:value={$config.rounds}
            /><small>&nbsp;</small></span
          ></label
        >
        <label class="notify"
          ><input type="checkbox" bind:checked={$config.notifications} />
          {$t.focus.notifications}</label
        >
      </div>
    {/if}
    <button
      class:open={openSection === "stats"}
      on:click={() => (openSection = openSection === "stats" ? null : "stats")}
    >
      <span>{$t.focus.stats}</span>
      <span class:rotated={openSection === "stats"} class="chevron"
        ><IconChevronDown size={16} /></span
      >
    </button>
    {#if openSection === "stats"}
      <div class="stats">
        <div>
          <b>{minutes($today.focusMs)}</b><span>{$t.focus.today_minutes}</span>
        </div>
        <div>
          <b>{$today.pomodoros}</b><span>{$t.focus.today_pomodoros}</span>
        </div>
        <div>
          <b>{minutes($week.focusMs)}</b><span>{$t.focus.week_minutes}</span>
        </div>
        <div>
          <b>{$week.pomodoros}</b><span>{$t.focus.week_pomodoros}</span>
        </div>
      </div>
      <div class="chart-section">
        <div class="chart-heading">
          <span>{$t.focus.last_seven_days}</span>
        </div>
        <div class:empty={!$week.focusMs} class="chart" aria-label={$t.focus.week_focus}>
          <div class="chart-scale" aria-hidden="true">
            <span>{minutes(highestDailyFocus === 1 && !$week.focusMs ? 0 : highestDailyFocus)}</span>
            <span>{minutes(highestDailyFocus === 1 && !$week.focusMs ? 0 : highestDailyFocus * 0.66)}</span>
            <span>{minutes(highestDailyFocus === 1 && !$week.focusMs ? 0 : highestDailyFocus * 0.33)}</span>
            <span>0</span>
          </div>
          {#each $weekDays as day}
            <div class="chart-day" data-tooltip={`${minutes(day.focusMs)} ${$t.focus.minutes}`}>
              <div
                class="chart-bar"
                class:has-focus={day.focusMs > 0}
                style={`height:${day.focusMs > 0 ? Math.max(8, (day.focusMs / highestDailyFocus) * 100) : 2}%`}
              ></div>
              <span>{weekday.format(day.date)}</span>
            </div>
          {/each}
          {#if !$week.focusMs}
            <p>{$t.focus.no_focus_data}</p>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  .timer {
    position: relative;
    width: min(480px, 80vw);
    padding: 34px 28px 28px;
    box-sizing: border-box;
    border: 1px solid #ffffff32;
    border-radius: 20px;
    background: #101010dc;
    backdrop-filter: blur(18px);
    text-align: center;
    pointer-events: none;
  }
  .timer.break {
    filter: saturate(0.72) brightness(0.9);
  }
  .close {
    position: absolute;
    top: 12px;
    right: 8px;
    display: grid;
    width: 24px;
    height: 24px;
    place-items: center;
    padding: 0;
    background: transparent;
    border: 0;
    pointer-events: auto;
  }
  .phase {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 4px 0;
    background: transparent;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .phase i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #e06565;
    box-shadow: 0 0 8px #e06565;
  }
  .phase i.running {
    background: #71c98b;
    box-shadow: 0 0 8px #71c98b;
  }
  .clock {
    font:
      300 clamp(62px, 12vw, 132px) / 1 ui-monospace,
      SFMono-Regular,
      Menlo,
      monospace;
    letter-spacing: -0.06em;
    margin: 10px 0;
  }
  .progress {
    height: 6px;
    margin: 14px 0;
    border-radius: 999px;
    overflow: hidden;
    background: #ffffff42;
  }
  .progress i {
    display: block;
    height: 100%;
    background: #fff;
    transition: width 0.25s linear;
  }
  .task {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 0;
    margin: 14px 0;
    color: rgba(255, 255, 255, 0.58);
    font-size: 13px;
  }
  .task :global(svg) {
    flex: 0 0 auto;
    color: #71c98b;
  }
  .task b {
    min-width: 0;
    overflow: hidden;
    color: #fff;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .actions {
    display: flex;
    justify-content: center;
    gap: 8px;
    pointer-events: auto;
  }
  .actions button {
    color: #fff;
    background: #1010108c;
    border: 0;
    border-radius: 999px;
    padding: 8px 13px;
    font-size: 12px;
  }
  .actions .primary {
    background: #fff;
    color: #111;
    font-weight: 700;
  }
  .accordions {
    margin-top: 15px;
    pointer-events: auto;
  }
  .accordions button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 2px;
    color: #ffffffaa;
    background: transparent;
    border: 0;
    text-align: left;
    font-size: 12px;
    transition: color 180ms ease;
  }
  .accordions button.open {
    color: #fff;
  }
  .chevron {
    display: inline-flex;
    transition: transform 220ms ease;
  }
  .chevron.rotated {
    transform: rotate(180deg);
  }
  .settings,
  .stats {
    animation: expand 180ms ease-out;
  }
  .settings {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px 12px;
    margin-top: 12px;
    text-align: left;
    pointer-events: auto;
  }
  .settings label {
    display: grid;
    grid-template-rows: auto auto;
    gap: 4px;
    color: #ffffffaa;
  }
  .settings label > span:first-child {
    font-size: 11px;
    line-height: 14px;
    font-weight: 400;
  }
  .input-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 4px;
  }
  .input-row small {
    font-size: 10px;
    opacity: 0.7;
  }
  .settings input {
    width: 100%;
    box-sizing: border-box;
    color: #fff;
    background: #0005;
    border: 1px solid #ffffff38;
    border-radius: 6px;
    padding: 5px;
  }
  .settings .notify {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    color: #fff;
  }
  .settings .notify input {
    width: auto;
  }
  .stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 5px;
    margin-top: 12px;
    pointer-events: auto;
  }
  .stats div {
    min-width: 0;
    padding: 8px 3px;
    border-radius: 8px;
    background: #ffffff0d;
    text-align: center;
  }
  .stats b {
    display: block;
    overflow: hidden;
    font-size: clamp(15px, 4vw, 21px);
    line-height: 1.1;
    text-overflow: ellipsis;
  }
  .stats span {
    display: block;
    overflow: hidden;
    margin-top: 3px;
    font-size: clamp(8px, 2.1vw, 10px);
    letter-spacing: -0.03em;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 0.7;
  }
  .chart-section {
    margin-top: 14px;
  }
  .chart-heading {
    display: flex;
    justify-content: flex-start;
    margin: 0 5px 6px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 10px;
  }
  .chart {
    position: relative;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    align-items: end;
    gap: 5px;
    height: 152px;
    min-height: 152px;
    padding: 0 5px 0 32px;
    isolation: isolate;
  }
  .chart::before {
    position: absolute;
    z-index: -1;
    top: 0;
    right: 5px;
    left: 32px;
    height: 130px;
    background: repeating-linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.13) 0,
      rgba(255, 255, 255, 0.13) 1px,
      transparent 1px,
      transparent 43px
    );
    content: "";
  }
  .chart-scale {
    position: absolute;
    top: -4px;
    bottom: 18px;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 27px;
    color: rgba(255, 255, 255, 0.45);
    font-size: 8px;
    line-height: 1;
    text-align: right;
  }
  .chart.empty .chart-day {
    opacity: 0.35;
  }
  .chart p {
    position: absolute;
    top: 56px;
    right: 0;
    left: 0;
    margin: 0;
    color: rgba(255, 255, 255, 0.62);
    font-size: 11px;
    text-align: center;
  }
  .chart-day {
    display: grid;
    grid-template-rows: 130px auto;
    align-items: end;
    gap: 5px;
    height: 100%;
    cursor: default;
  }
  .chart-bar {
    display: block;
    width: 100%;
    min-height: 2px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.18);
    transition: height 220ms ease;
  }
  .chart-bar.has-focus {
    border-radius: 8px;
    background: rgba(113, 201, 139, 0.9);
  }
  .chart-day > span {
    color: rgba(255, 255, 255, 0.55);
    font-size: 10px;
    text-align: center;
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
  .phase {
    position: absolute;
    top: 10px;
    left: 20px;
    gap: 7px;
    letter-spacing: 0;
    text-transform: none;
  }

  .timer {
    border: 0;
    background: var(--glass-background);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
  }

  .rounds {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    margin-left: 3px;
  }

  .rounds i {
    width: 14px;
    height: 4px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.25);
    box-shadow: none;
  }

  .rounds i.done {
    background: #71c98b;
  }

  @media only screen and (max-width: 600px) {
    .timer {
      width: calc(80vw + 40px);
    }
  }
</style>
