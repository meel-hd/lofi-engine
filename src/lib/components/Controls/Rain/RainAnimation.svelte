<script lang="ts">
  export let isRaining = false;
</script>

<div>
  {#if isRaining}
    <div class="rain" />
  {/if}
</div>

<style>
  .rain {
    position: absolute;
    top: -30px;
    left: -100vw;
    width: 300vw;
    height: 110vh;
    z-index: -1; /* behind the content */
    background: url("/rain.png");
    animation: rain 0.3s linear infinite;
  }

  @keyframes rain {
    0% {
      background-position: 0px 0px;
    }
    100% {
      background-position: 150px 400px;
    }
  }
</style>
