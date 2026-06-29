<!-- 
    Global Customization and Configuration
 -->

<script lang="ts">
  import { onMount } from "svelte";

  // Disable Right Click
  onMount(() => {
    const preventContextMenu = (e: Event) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", preventContextMenu, false);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu, false);
    };
  });
</script>
