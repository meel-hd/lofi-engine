<script lang="ts">
  import { onMount } from "svelte";

  let visible = false;
  let text = "";
  let x = 0;
  let y = 0;
  let tooltipWidth = 0;
  let tooltipHeight = 0;

  let targetElement: HTMLElement | null = null;

  function updatePosition() {
    if (!targetElement || !visible) return;

    const rect = targetElement.getBoundingClientRect();
    const gap = 8;

    // Default: Top Center
    let top = rect.top - tooltipHeight - gap;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    // Check top overflow
    if (top < 0) {
      // Flip to bottom
      top = rect.bottom + gap;
    }

    // Check left/right overflow
    if (left < 0) left = gap;
    if (left + tooltipWidth > window.innerWidth) {
      left = window.innerWidth - tooltipWidth - gap;
    }

    x = left;
    y = top;
  }

  function show(e: MouseEvent) {
    const target = (e.target as HTMLElement).closest("[data-tooltip]");
    if (target) {
      text = target.getAttribute("data-tooltip") || "";
      targetElement = target as HTMLElement;
      visible = true;
      // Wait for DOM update to get dimensions
      setTimeout(() => {
        const el = document.getElementById("global-tooltip");
        if (el) {
          tooltipWidth = el.offsetWidth;
          tooltipHeight = el.offsetHeight;
          updatePosition();
        }
      }, 0);
    }
  }

  function hide() {
    visible = false;
    targetElement = null;
  }

  onMount(() => {
    window.addEventListener("mouseover", show);
    window.addEventListener("mouseout", (e) => {
      // Only hide if we mouse out of the target
      const target = (e.target as HTMLElement).closest("[data-tooltip]");
      if (target) {
         // Check if we moved to a child? No, mouseout bubbles.
         // Simpler: just check if relatedTarget is not inside the target
         if (!target.contains(e.relatedTarget as Node)) {
             hide();
         }
      }
    });
    
    // Also hide on click usually? Or keep it?
    // Let's keep it simple.
    
    window.addEventListener("scroll", updatePosition, true); // Capture scroll to update pos
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("mouseover", show);
      window.removeEventListener("mouseout", hide); // Fix listener removal
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  });
</script>

{#if visible}
  <div
    id="global-tooltip"
    class="glass"
    style="top: {y}px; left: {x}px;"
  >
    {text}
  </div>
{/if}

<style>
  #global-tooltip {
    position: fixed;
    color: white;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
    pointer-events: none;
    z-index: 9999;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    transition: left 0.1s ease-out, opacity 0.3s;
  }
</style>
