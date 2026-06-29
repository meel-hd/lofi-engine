# LoFi Engine — Improvement Tracker

A prioritized backlog from a comprehensive code analysis (engine + app shell).
Each item lists **severity**, **evidence** (`file:line`), a **suggested fix**, and a
**verification** note. Check items off as they are addressed.

Severity: 🔴 high (crash / hang / accumulating leak) · 🟡 medium (quality / robustness) · 🟢 low (polish / docs)

**Verification:** Initial analysis on 2026-06-29, then cross-checked by three
parallel read-only audits (engine, tracks/effects, shell/i18n/robustness). Verdicts
below reflect that consensus — a few original claims were corrected or downgraded
(see BUG-3) and several new issues were found (CRIT-1 most importantly).

---

## Wave 1 — implementation status (branch `improvements/wave-1-fixes`)

Implemented by four file-disjoint agents and centrally verified:
**`svelte-check` → 0 errors** (1 pre-existing A11y warning in ContextMenu, out of scope),
**Vitest → 17/17 passing**, **`vite build` → success** (6011 modules). Diff: 29 files, +853/−353, plus Vitest config + 3 specs + `melodyHelpers.ts`.

- **DONE (this wave):** CRIT-1 · BUG-1 · BUG-2 · BUG-3 · BUG-4 · BUG-6 · BUG-7 · BUG-8 · BUG-9 · BUG-10 ·
  GEN-1 · GEN-3 · GEN-4 · GEN-6 · GEN-8 · PERF-1 · PERF-2 · PERF-4 · PERF-5 · PERF-6 ·
  ROBUST-1 · ROBUST-2 · ROBUST-3 · ROBUST-4 · SEC-2 · MISC-1 · MISC-2 · MISC-3 · MISC-4 · MISC-5 · MISC-6 · MISC-7 · MISC-8.
  - Also extended BUG-2/MISC-8 to the instrument classes (`Hat`/`Kick`/`Snare`/`Piano`): removed the dead
    `sampler()` methods that shadowed the field and declared the fields — this fixed **pre-existing** `svelte-check` failures.
- **DONE (Wave 2 — the cross-cutting refactors, built on shared stores):**
  - **PERF-3** — `src/lib/stores/volumes.ts` is now the single source of truth; the 200 ms/100 ms localStorage
    polling in Controls/PlayButton is gone, and `Volume.svelte` writes the store directly.
  - **BUG-5** — `src/lib/stores/effects.ts` holds effect on/off state; buttons, shortcuts, the context menu, and the
    Auto-DJ all write it (no more stateless `lofi-toggle-*` events). The Auto-DJ tracks the effects it enabled and
    turns only those off when leaving ATMOSPHERE/WORLD — it no longer fights manual toggles or gets stuck on.
- **DONE but needs runtime check:** **SEC-1** — an explicit CSP was added to `tauri.conf.json`, but it must be
  validated in a real `tauri build` (Tone.js may use blob/AudioWorklet workers; user images render as data-URLs).
- **DONE (Wave 3 — the roadmap musical features, built as tested engine modules + a single PlayButton integration):**
  - **GEN-2** — `engine/Bass/` adds a soft synth bass that outlines the chord root an octave below the comping.
  - **GEN-5** — `engine/Drums/patterns.ts` is a library of groove variations; the drum sequences now iterate step
    indices and look up the current pattern, so each section swaps to a new groove (the original groove is set 0).
  - **GEN-7** — `Chord.generateVoicing` gained opt-in inversions/extensions and a `pickVelocity()` for per-chord
    dynamics; `playChord` uses them so the comping isn't mechanically uniform.

---

## 0. Critical — fix first

- [ ] **CRIT-1 🔴 Spacebar bypasses all load/generation guards → crash + freeze.**
  `handleKeydown` calls `toggle()` directly, skipping the `allSamplesLoaded` /
  `contextStarted` / `genChordsOnce` checks that the play button enforces in
  `handleButtonAction`. The page is interactive during the multi-hundred-KB sample
  load, so pressing **Space** (the natural play key) before generation runs starts
  the Transport with `progression = []` and `scale = []`:
  `playChord` → `progression[0].semitoneDist` throws a TypeError, and `playMelody`
  hits the empty-scale infinite loop (see BUG-1) → main-thread freeze.
  — `src/lib/PlayButton.svelte:152-157` (handler), `:273-275` / `:286-332` (crash sites)
  *Fix:* route the spacebar through `handleButtonAction()`, or guard
  `toggle()` with `if (!genChordsOnce) return;`.
  *Verification:* CONFIRMED (EngineAudit). New finding; combines BUG-1 + BUG-6.

---

## A. Music generation quality

- [ ] **GEN-1 🟡 Melody ignores the current chord (no chord-tone awareness).**
  `playMelody()` random-walks the *key's* major scale and never references
  `progression[progress]`. — `src/lib/PlayButton.svelte:286-332`
  *Nuance (confirmed):* chords (`key+"3"`) and melody (scale on `key+"5"`) share the
  same key, so output is always **in-key** — not atonal. The defect is no chord-tone
  *targeting*, allowing diatonic "avoid notes" on strong beats.
  *Fix:* bias selection toward the active chord's tones on strong beats.
  *Verification:* CONFIRMED (EngineAudit).

- [ ] **GEN-2 🟡 No bassline.** Arrangement is chords (oct 3) + melody (oct 5) +
  drums; lofi almost always has bass. — `src/lib/PlayButton.svelte`
  *Fix:* add a bass sequence following chord roots (oct 1–2).

- [ ] **GEN-3 🟡 Tempo/swing hardcoded and atypical.** `bpm = 156`, `swing = 1`
  (max), never varied. — `src/lib/PlayButton.svelte:47-48`
  *Fix:* lower/vary BPM (or half-time feel), reduce swing to ~0.3–0.6.
  *Verification:* CONFIRMED (EngineAudit — only those two lines touch bpm/swing).

- [ ] **GEN-4 🟡 Biased shuffle + no voice-leading in voicings.**
  `generateVoicing()` uses `sort(() => Math.random()-0.5)` (non-uniform) and is
  re-run fresh per chord with no reference to the previous voicing.
  — `src/lib/engine/Chords/Chord.ts:31-43`; called at `PlayButton.svelte:277`
  *Nuance:* the octave-stacking loop forces a monotonic spread, so the shuffle
  randomizes *spread*, not pitch content.
  *Fix:* Fisher–Yates shuffle; keep common tones between consecutive chords.
  *Verification:* CONFIRMED (EngineAudit).

- [ ] **GEN-5 🟡 Drum patterns are static.** Sections only flip drums on/off and
  tweak per-hit probability; the kick/snare/hat arrays never change.
  — `src/lib/PlayButton.svelte:102-143, 192-223`
  *Fix:* small pattern library + occasional fills, swapped on section boundaries.

- [ ] **GEN-6 🟡 Progressions wander; no cadence.** `nextChordIdx()` picks
  uniformly among allowed nexts; progression starts on a random chord and never
  targets a resolving cadence to I; `IntervalWeights` is melody-only.
  — `engine/Chords/Chord.ts:28`, `ChordProgression.ts:10`, `Chords.ts`
  *Fix:* weight transitions and force a cadence (V→I / ii–V–I) at phrase ends.
  *Verification:* CONFIRMED (EngineAudit — IntervalWeights never imported under `Chords/`).

- [ ] **GEN-7 🟢 Narrow harmonic palette.** Same extended-7th voicing template
  every chord, root pinned to oct 3, no inversions/sus/9ths, no velocity dynamics.
  — `engine/Chords/Chords.ts`, `PlayButton.svelte:273-284`
  *Fix:* inversions, occasional extensions, humanized velocity.

- [ ] **GEN-8 🟡 Master low-pass filter settles at 1200 Hz, not its initial 2000 Hz.**
  `autoDJTransition` ramps the master LPF 2000→300→**1200** and never restores
  2000, so the whole mix is permanently darker after the first section change.
  — `src/lib/PlayButton.svelte:44, 264-267`
  *Fix:* ramp back to the original cutoff (2000) after the transition.
  *Verification:* CONFIRMED (EngineAudit); likely unintended.

---

## B. Logic / correctness bugs

- [ ] **BUG-1 🔴 Unbounded `while(!found)` in the melody weighted picker → hang.**
  The loop has no bounds guard; if `scaleDist` runs past the array end,
  `weights[scaleDist]` is `undefined` and `randomWeight <= undefined` is always
  false → infinite loop on the audio thread.
  — `src/lib/PlayButton.svelte:315-324`
  *Verification (EngineAudit):* CONFIRMED. The float-rounding path is real but
  vanishingly rare (~1e-16/note). The **reachable** trigger is an empty `scale`
  (`weights = []` → `weights[0] === undefined`), which is exactly the pre-generation
  state reached via the spacebar path (CRIT-1).
  *Fix:* clamp `scaleDist` to `weights.length - 1` and bail if `weights` is empty.
  (The random-walk index itself is NOT otherwise out of bounds — REFUTED for normal
  operation; `scale.length` is always 15 and the step math stays in `[0,14]`.)

- [ ] **BUG-2 🟡 Dead / shadowed methods in `Chord`.** Constructor assigns
  `degree/semitoneDist/intervals/nextChordIdxs` as instance properties that shadow
  the same-named prototype methods, making them uncallable; `generateMode()` is
  never called. — `engine/Chords/Chord.ts:5-25, 45-52`
  *Fix:* delete the four dead accessors + `generateMode()`; keep properties +
  `nextChordIdx()` / `generateVoicing()`.
  *Verification:* CONFIRMED (EngineAudit — zero call sites of the four as functions).

- [ ] **BUG-3 🟡 `pauseTrack` leaks audio entries (NOT overlapping playback).**
  `TrackListItem.pauseTrack()` pauses the audio but never removes it from
  `activeAudios` (parent `toggleTrack` *does* filter), so repeated play/pause
  accumulates `Audio` objects. — `TrackListItem.svelte:58-65` vs `TrackList/index.svelte:152-160`
  *Verification (TracksAudit):* leak CONFIRMED; **"overlapping playback" REFUTED** —
  `pauseTrack` pauses *every* entry with the matching id, so duplicates never play
  simultaneously. (Severity downgraded from 🔴 to 🟡.)
  *Fix:* remove the entry from `activeAudios` on pause (single source of truth).

- [ ] **BUG-4 🟡 Three desynced code paths control the same track state.**
  `TrackListItem.play/pauseTrack`, parent `toggleTrack()`, and the number-key (1–9)
  handlers each mutate state independently. `toggleTrack` ends with `tracks = tracks`
  (re-renders children); the number-key and "k" handlers do **not**, so the child UI
  goes stale (e.g. start a track by click, then press its number → audio stops but
  the item still shows "playing" with its slider).
  — `TrackList/index.svelte:73-101, 140-163`; `TrackListItem.svelte:45-65`
  *Verification (TracksAudit):* CONFIRMED as **visual/state desync + leak**, not audio
  overlap.
  *Fix:* consolidate all start/stop into one function or a shared store.

- [ ] **BUG-5 🟡 Auto-DJ toggles effects/tracks statelessly.** It dispatches
  `lofi-toggle-*` (a flip, not a set), so effects fight manual toggles and are **not**
  turned off when switching back to MUSIC mode (nothing resets them on mode change).
  — `PlayButton.svelte:225-261`, `AutoDJ.svelte:18-24`, `handleAutoDJModeChange :163-165`
  *Fix:* use explicit set-on/off events and reset effects/tracks on mode change.
  *Verification:* CONFIRMED (TracksAudit).

- [ ] **BUG-6 🟡 Unreachable "Initialize Audio" state + `Tone.start()` outside a
  gesture.** The reactive block runs `startAudioContext()` + `generateProgression()`
  the instant samples load, so `contextStarted`/`genChordsOnce` are already true
  before any click — the "Initialize Audio" branch and the `!contextStarted` /
  `!genChordsOnce` branches are unreachable, and that `Tone.start()` is outside a
  user gesture (the real unlock is `toggle()`).
  — `PlayButton.svelte:387-390, 396-406, 418-420`
  *Fix:* simplify the state machine; unlock the context only from a user gesture.
  *Verification:* CONFIRMED both parts (ShellAudit).

- [ ] **BUG-7 🟢 Hardcoded progression length in the live-index calc.**
  `activeProgressionIndex = (progress + 7) % 8` hardcodes 8 while `nextChord` wraps
  on `progression.length`; the `progress===4`/`===0` section logic also assumes 8.
  — `PlayButton.svelte:200, 205, 377` (gen length set at `:340`)
  *Fix:* derive from `progression.length`.
  *Verification:* CONFIRMED latent (EngineAudit); no current misbehavior.

- [ ] **BUG-8 🟡 Per-track volume shares one localStorage key.**
  `TrackListItem` writes/reads a single `"audioVolume"` key, so on reload all 9
  tracks restore the last-adjusted value; the value is also stored as a string.
  — `TrackListItem.svelte:35-43, 67-72`
  *Verification (TracksAudit):* CONFIRMED with nuance — live sliders keep per-instance
  values; the shared effect is on **persistence/restore**.
  *Fix:* persist per-track (`audioVolume:<id>`) and coerce to a number.

- [ ] **BUG-9 🟡 No `onDestroy` cleanup of audio / Tone resources.** TrackList has
  no `onDestroy` to stop `activeAudios`; effect components never stop their `Audio`
  on destroy; PlayButton's `onDestroy` stops `noise`/`Transport` but never
  `.dispose()`s the 5 `Tone.Sequence`s, samplers, or effect nodes. With the leaked
  intervals (PERF-2) holding references, audio can keep playing after unmount.
  — `PlayButton.svelte:181-186`; effect components; `TrackList/index.svelte`
  *Fix:* stop/dispose audio and Tone nodes in `onDestroy`.
  *Verification:* CONFIRMED (Engine + Tracks audits).

- [ ] **BUG-10 🟢 `activeAudios` reference split between parent and children.**
  The "k" and number-key handlers reassign `activeAudios = …filter/[]` without
  `tracks = tracks`, so children keep the *old* array reference while the parent
  holds a new one. A child `playTrack` then pushes into the stale array → that audio
  can't be stopped by "k". — `TrackList/index.svelte:64, 93-95` vs `toggleTrack:162`
  *Fix:* single source of truth (store / consistent reassignment).
  *Verification:* CONFIRMED (TracksAudit).

---

## C. Resource leaks / performance

- [ ] **PERF-1 🟡 Event listeners registered at top-of-script with no removal.**
  Many components add `window`/`document` listeners outside `onMount` and never
  remove them. — effect components (`Rain:24`, `Thunder:23`, `Jungle:23`,
  `CampFire:23`), `Settings/index.svelte:18,42`, `Background.svelte:246,253,258`,
  `TrackList/index.svelte:58,74(×9),105`
  *Verification (ShellAudit) — important nuance:* most of these components mount
  once at app start and never unmount, so they don't *accumulate*. The genuine
  **accumulating** leak is **`Background.svelte`**, which is `{#if isActive}`-gated
  and re-mounts (re-registering 3 listeners) on every settings open — and MISC-6's
  startup double-toggle adds an extra cycle. TrackList's `onMount` cleanup also
  omits `settings-open-changed` (`:177` added, `:179` only removes `lofi-toggle-track`).
  *Fix:* move all listeners into `onMount` with cleanup; fix the TrackList cleanup.

- [ ] **PERF-2 🟡 Uncleared `setInterval` polling.** Volume timers never cleared:
  `PlayButton.svelte:379-385` (100 ms), `Controls/index.svelte:21-24` (200 ms, also a
  `volumes = volumes = …` double-write), and each effect component (`Rain:33`,
  `Thunder:32`, `Jungle:31`, `CampFire:32`, 100 ms).
  *Fix:* clear in `onDestroy`, or remove via PERF-3.
  *Verification:* CONFIRMED (Shell + Tracks audits).

- [ ] **PERF-3 🟡 Volume sync via localStorage polling instead of a store.**
  `Volume.svelte` writes localStorage → `Controls` polls every 200 ms → prop-drills →
  each effect polls every 100 ms to apply. Poll-driven prop drilling.
  *Fix:* replace with a shared Svelte `writable` store.
  *Verification:* CONFIRMED (ShellAudit).

- [ ] **PERF-4 🟡 Tooltip cleanup removes the wrong listener (no-op).**
  An anonymous `mouseout` handler is registered but cleanup calls
  `removeEventListener("mouseout", hide)` with a function that was never registered,
  so removal does nothing (despite a `// Fix listener removal` comment).
  — `src/lib/components/Tooltip.svelte:64-74, 84`
  *Fix:* store the handler in a named const and remove that reference.
  *Verification:* CONFIRMED new finding (ShellAudit).

- [ ] **PERF-5 🟢 Window-control polling + imperative listeners never cleaned.**
  `MacControls.svelte:33-43` and `GenericControls.svelte:34-44` poll
  `appWindow.isMaximized()` every 300 ms with no cleanup, and attach click listeners
  via `getElementById(...).addEventListener` (`:13-29` / `:15-30`) that are never
  removed (and bypass Svelte's `on:click`).
  *Fix:* use Tauri window events + `on:click`; clear the interval in `onDestroy`.
  *Verification:* CONFIRMED new finding (ShellAudit).

- [ ] **PERF-6 🟢 Redundant/uncleaned global side effects.**
  `Config.svelte:7-13` adds a `document` contextmenu `preventDefault` at script-eval
  time, never removed and redundant with `ContextMenu.svelte:20-21`.
  *Fix:* consolidate into the ContextMenu component with cleanup.
  *Verification:* CONFIRMED new finding (ShellAudit).

---

## D. Robustness / error handling

- [ ] **ROBUST-1 🟡 Unguarded `JSON.parse(localStorage…)` at init.** Corrupt storage
  throws synchronously and breaks init. — `PlayButton.svelte:31-32`,
  `Controls/index.svelte:17-18` (re-parsed every 200 ms), `Volume.svelte:12-13`,
  `Background.svelte:82`, `App.svelte:28`
  *Fix:* `try/catch` with the default fallback. (Absent-key is safe: `JSON.parse(null)`→null.)
  *Verification:* CONFIRMED (ShellAudit).

- [ ] **ROBUST-2 🟡 Unhandled `audio.play()` rejections.** No `.catch`/await on any
  `play()`; rapid toggling yields unhandled `AbortError`. — all effect/track callers
  (`Rain:15`, `Thunder:13`, `Jungle:13`, `CampFire:13`, `TrackListItem.svelte:48`,
  `TrackList:144, 81`)
  *Fix:* `.catch()` and ignore `AbortError`.
  *Verification:* CONFIRMED (TracksAudit).

- [ ] **ROBUST-3 🟡 Shortcuts fire while typing in inputs.** Only the two arrow
  handlers guard `e.target.closest("input")`; effect letters (a/s/d/f), Settings 'j',
  TrackList 'k' and 1–9 do not. Also PlayButton's spacebar always `preventDefault()`s
  Space even when an input is focused. — effect components, `Settings/index.svelte:19`,
  `TrackList:59,73-101`, `PlayButton.svelte:152-157`
  *Verification (Shell + Tracks):* CONFIRMED; practical impact currently **low** (no
  free-text inputs — only range sliders + a file input), but the pattern is fragile.
  *Fix:* shared guard that ignores inputs/textareas/contenteditable.

- [ ] **ROBUST-4 🟡 `ru.ts` is not type-checked + unguarded locale lookup.**
  `ru.ts` declares `export const ru = {` with no `: Translations` annotation (unlike
  ja/zh/hi/fr/nl), so `svelte-check` won't catch key drift in the Russian locale; and
  `TrackListItem.svelte:100` does unguarded `$t.tracks[track.id].quote`, which throws
  at render if any locale's `tracks` map drifts. — `src/lib/locales/ru.ts:1`
  *Fix:* annotate `export const ru: Translations`; guard the lookup.
  *Verification:* CONFIRMED new finding (ShellAudit).

---

## E. Security (Tauri)

- [ ] **SEC-1 🟡 No Content Security Policy.** `security.csp` is `null`, disabling a
  defense-in-depth layer flagged by Tauri's own guidance. Risk is moderated (local
  assets; user images rendered as `background-image`/`<img>` data-URLs, not script).
  — `src-tauri/tauri.conf.json:39-41`
  *Fix:* set an explicit restrictive CSP.
  *Verification:* CONFIRMED new finding (ShellAudit).

- [ ] **SEC-2 🟢 External link missing `rel="noopener noreferrer"`.**
  `<a target="_blank">` to GitHub without `rel`. — `InfoBox/SocialLinks.svelte:21`
  *Fix:* add `rel="noopener noreferrer"`.
  *Verification:* CONFIRMED new finding (ShellAudit).

---

## F. UX / docs / maintenance

- [ ] **MISC-1 🟡 No automated tests.** No runner configured. The pure generation
  logic (`ChordProgression`, `generateVoicing`, melody walk, weighted picker) is
  highly testable and would catch BUG-1/CRIT-1.
  *Fix:* add Vitest + unit tests for `engine/`.

- [ ] **MISC-2 🟢 README localization list is inaccurate.** Claims Spanish/Korean/
  Indonesian (absent), omits Chinese/Hindi/Dutch (present). Actual: en, ja, zh, hi,
  fr, nl, ru. — `README.md:74-80` vs `locales/store.ts:11-19`
  *Fix:* sync the README.
  *Verification:* CONFIRMED (ShellAudit).

- [ ] **MISC-3 🟢 Deprecated `Tone.Master`.** Used in `PlayButton.svelte:46,447`,
  `Piano.ts:11`, `Noise.ts:5`, `Snare.ts:14`, `Kick.ts:12`, `Hat.ts:14`. Deprecated in
  Tone 14 for `getDestination()`.
  *Fix:* migrate to `getDestination()`.
  *Verification:* CONFIRMED (ShellAudit).

- [ ] **MISC-4 🟢 `dir` store ignores locale.** Derived `dir` always returns `'ltr'`
  and `setLocale` hardcodes `'ltr'`; no live bug (all locales LTR) but silently breaks
  any future RTL locale. — `locales/store.ts:29-31, 38`
  *Fix:* map known RTL locales to `'rtl'`.
  *Verification:* CONFIRMED (ShellAudit).

- [ ] **MISC-5 🟢 Leftover debug log.** `console.log("activeAudios", …)` in the
  "stop all" handler. — `TrackList/index.svelte:63`
  *Fix:* remove.
  *Verification:* CONFIRMED.

- [ ] **MISC-6 🟢 Fragile settings-init hack.** `Settings` toggles open then closed
  after 10 ms on mount to force-mount children so saved settings apply; this
  double-dispatches `settings-open-changed` (flips TrackList `isMobileHidden` at
  startup), causes a spurious Background mount/unmount (feeds PERF-1), and duplicates
  App's background init. — `Settings/index.svelte:26-31`
  *Fix:* apply saved settings explicitly (shared stores).
  *Verification:* CONFIRMED (ShellAudit).

- [ ] **MISC-7 🟡 ESC only closes the info box — contradicts help text + README.**
  The Escape handler is gated on `&& visible`, so ESC can only hide; nothing opens
  the box via keyboard, yet ShortCuts shows esc = "Show/hide This Box" and the README
  says info is "accessible via the ESC key". (Also a top-level, never-removed
  `document` listener.) — `InfoBox/Info.svelte:21-29`, `en.ts:55`, `README.md:86`
  *Fix:* make ESC toggle (open + close) or correct the docs/help.
  *Verification:* CONFIRMED new finding (ShellAudit).

- [ ] **MISC-8 🟢 Dead code / unused assets.** `Chord.generateMode()` never called;
  `generateVoicing`'s `if(size<3)` branch dead (callers always pass `size=4`); the
  `…v3` piano velocity samples on disk are never loaded (`Samples.ts` hardcodes
  `velocity=1`, requesting only `v1`). — `Chord.ts:45-52, 32-33`, `Piano/Samples.ts:4`
  *Fix:* remove dead code; either use the v3 velocity layer or drop the files.
  *Verification:* CONFIRMED (EngineAudit); sample→file mapping otherwise verified correct.

---

### Suggested first pass (revised after verification)
1. **CRIT-1 + BUG-1** — the spacebar-during-load crash/freeze and the unbounded melody
   loop are one defect chain; fix together. Highest priority.
2. **BUG-3 / BUG-4 / BUG-9 / BUG-10** — collapse track playback onto a single source of
   truth (store) and add `onDestroy` cleanup; resolves the leaks + UI desync at once.
3. **PERF-1 (Background) / PERF-2 / PERF-3 / PERF-4** — fix the real accumulating leaks
   (Background re-mount, Tooltip cleanup) and replace volume polling with a store.
4. **GEN-1 + GEN-3 + GEN-8** — the changes that most improve perceived musical quality
   (chord-tone targeting, sane tempo/swing, restore the master filter).
5. **MISC-1** — add tests to lock in generation behavior and prevent regressions.

### Notes (verified non-issues)
- Chord/melody harmony is **in-key and consonant** — the engine builds correct diatonic
  7th chords and the melody scale shares the key root. (GEN-1 is about refinement, not wrong notes.)
- Piano sample → filename mapping (`#`→`sharp`, A/C/D#/F# × oct 1–6) is **correct**; all v1 files exist.
- `generateProgression()` running mid-playback is **not** a true race (JS single-threaded; state is set atomically).
- BUG-3 does **not** cause overlapping audio (duplicates are all paused together).
