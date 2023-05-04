<script lang="ts">
  import {
    IconArrowDown,
    IconArrowLeft,
    IconArrowRight,
    IconArrowUp,
  } from "@tabler/icons-svelte";
  let ambientTracks = [1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<div class="shortcuts">
  <h4>Shortcuts</h4>
  <!-- General Shortcuts -->
  <h5 style="margin-left: 10px;">General</h5>
  <div class="shortcut">
    <div class="shortcut-key">Esc</div>
    <div class="shortcut-desc">Show/hide This Box</div>
  </div>
  <div class="shortcut">
    <div class="shortcut-key">J</div>
    <div class="shortcut-desc">Open/close Settings</div>
  </div>
  <div class="shortcut">
    <div class="shortcut-key"><IconArrowRight size={15} /></div>
    <div class="shortcut-desc">Next Background Image</div>
  </div>
  <div class="shortcut">
    <div class="shortcut-key"><IconArrowLeft size={15} /></div>
    <div class="shortcut-desc">Previous Background Image</div>
  </div>
  <div class="shortcut">
    <div class="shortcut-key">CTRL + R</div>
    <div class="shortcut-desc">Restart</div>
  </div>

  <h5 style="margin-left: 10px;">Main Track</h5>
  <div class="shortcut">
    <div class="shortcut-key">SPACEBAR</div>
    <div class="shortcut-desc">Play/Pause Main Track</div>
  </div>
  <!-- Effects Shortcuts -->
  <h5 style="margin-left: 10px;">Effects</h5>
  <div class="shortcut">
    <div class="shortcut-key">A</div>
    <div class="shortcut-desc">Control The Rain</div>
  </div>
  <div class="shortcut">
    <div class="shortcut-key">S</div>
    <div class="shortcut-desc">Control The Thunder Storm</div>
  </div>
  <div class="shortcut">
    <div class="shortcut-key">D</div>
    <div class="shortcut-desc">Control The Nature Sounds</div>
  </div>
  <div class="shortcut">
    <div class="shortcut-key">F</div>
    <div class="shortcut-desc">Control The Campfire</div>
  </div>
  <!-- Ambient Tracks Shortcuts -->
  <h5 style="margin-left: 10px;">Ambient Tracks</h5>
  <div class="shortcut">
    <div class="shortcut-key"><IconArrowUp size={15} /></div>
    <div class="shortcut-desc">Navigate To Next Track</div>
  </div>
  <div class="shortcut">
    <div class="shortcut-key"><IconArrowDown size={15} /></div>
    <div class="shortcut-desc">Navigate To Previous Track</div>
  </div>
  <div class="shortcut">
    <div class="shortcut-key">K</div>
    <div class="shortcut-desc">Stop All Ambient Sounds</div>
  </div>
  {#each ambientTracks as track}
    <div class="shortcut">
      <div class="shortcut-key">{track}</div>
      <div class="shortcut-desc">
        Play/Pause Ambient Track {track}
      </div>
    </div>
  {/each}
</div>

<style>
  .shortcuts {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0 10px;
  }
  h4,
  h5 {
    margin: 0;
  }
  .shortcut {
    display: flex;
    gap: 1rem;
    font-size: small;
    margin-left: 20px;
  }

  .shortcut-key {
    min-width: 30px;
    background-color: #fff;
    color: #000;
    padding: 5px 10px;
    border-radius: 10px;
    text-align: center;
  }

  .shortcut-desc {
    color: #fff;
  }
</style>
