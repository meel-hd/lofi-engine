<script lang="ts">
  import { IconArrowLeft, IconArrowRight } from "@tabler/icons-svelte";

  // get id from localstorage
  let id: any = localStorage.getItem("bg-id") || 1;
  const bg = document.getElementById("bg");
  bg.style.backgroundImage = `url('assets/background/bg${id}.jpg')`;

  function nextBg() {
    if (id < 10) {
      // @ts-ignore
      id = new Number(id) + 1;
    } else {
      id = 1;
    }
    bg.style.backgroundImage = `url('assets/background/bg${id}.jpg')`;
    localStorage.setItem("bg-id", id.toString());
  }

  function prevBg() {
    const bg = document.getElementById("bg");
    if (id > 1) {
      id = id - 1;
    } else {
      id = 10;
    }
    bg.style.backgroundImage = `url('assets/background/bg${id}.jpg')`;
    localStorage.setItem("bg-id", id.toString());
  }

  // Shortcuts to change background using arrow keys
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    // Prevent bg change when targeting inputs
    if (e.target instanceof HTMLElement && !e.target.closest("input")) {
      if (e.key === "ArrowRight") {
        nextBg();
      } else if (e.key === "ArrowLeft") {
        prevBg();
      }
    }
  });
</script>

<div>
  <h4>Background</h4>
  <div class="container">
    <button on:click={prevBg}>
      <IconArrowLeft size={20} />
    </button>
    <img id="bg-preview" src="assets/background/bg{id}.jpg" alt="" />
    <button on:click={nextBg}>
      <IconArrowRight size={20} />
    </button>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    justify-content: center;
  }
  #bg-preview {
    width: 200px;
    height: 120px;
    border-radius: 7px;
    margin: 0 10px;
  }
  button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: white;
    overflow: hidden;
  }
  button:hover {
    backdrop-filter: blur(10px);
    background-color: rgba(0, 0, 0, 10%);
  }
</style>
