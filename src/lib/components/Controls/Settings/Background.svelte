<script lang="ts">
  import {
    IconArrowLeft,
    IconArrowRight,
    IconPlus,
    IconTrash,
  } from "@tabler/icons-svelte";
  import { onMount } from "svelte";
  import localDB from "../../../localDB";
  import { t } from "../../../locales/store";

  const MAX_DIMENSION = 1920;
  const WEBP_QUALITY  = 0.85;
  const MAX_FILE_MB   = 20;

  // get id from localstorage
  let id: any = localStorage.getItem("bg-id") || 1;
  let bgType = localStorage.getItem("bg-type") || "default";
  let customBgId = localStorage.getItem("custom-bg-id");

  let customBackgrounds = [];
  let allBackgrounds = [];
  let isUploading = false;
  let isTransitioning = false;

  onMount(async () => {
    await loadCustomBackgrounds();
    buildAllBackgrounds();
    applyCurrentBackground();
  });

  /**
   * Resize + compress an image File to a WebP DataURL.
   * - Caps the longest side at MAX_DIMENSION
   * - Encodes as WebP at WEBP_QUALITY
   * Typical savings: 60–80 % vs. a raw 4 K JPEG.
   */
  function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        let { width, height } = img;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width >= height) {
            height = Math.round((height / width) * MAX_DIMENSION);
            width  = MAX_DIMENSION;
          } else {
            width  = Math.round((width / height) * MAX_DIMENSION);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width  = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas context unavailable")); return; }

        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/webp", WEBP_QUALITY));
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Failed to load image"));
      };

      img.src = objectUrl;
    });
  }

  async function loadCustomBackgrounds() {
    const saved = await localDB.getItem("custom-backgrounds");
    if (saved) {
      customBackgrounds = JSON.parse(saved);
    }
  }

  function buildAllBackgrounds() {
    allBackgrounds = [];

    for (let i = 1; i <= 10; i++) {
      allBackgrounds.push({
        id: `default_${i}`,
        type: "default",
        name: `Background ${i}`,
        url: `assets/background/bg${i}.webp`,
      });
    }

    customBackgrounds.forEach((bg) => {
      allBackgrounds.push({
        id: bg.id,
        type: "custom",
        name: bg.name,
        url: bg.dataUrl,
      });
    });
  }

  function saveCustomBackgrounds() {
    localDB.setItem("custom-backgrounds", JSON.stringify(customBackgrounds));
  }

  function selectCustomBackground(bg: any) {
    applyBackground({
      id: bg.id,
      type: "custom",
      name: bg.name,
      url: bg.dataUrl,
    });
  }

  function deleteCustomBackground(bg: any) {
    customBackgrounds = customBackgrounds.filter((b) => b.id !== bg.id);
    saveCustomBackgrounds();
    buildAllBackgrounds();

    window.dispatchEvent(new CustomEvent("backgroundsUpdated"));

    if (bgType === "custom" && customBgId === bg.id) {
      if (allBackgrounds.length > 0) {
        applyBackground(allBackgrounds[0]);
      } else {
        localStorage.setItem("bg-type", "default");
        localStorage.removeItem("custom-bg-id");
        const bgElement = document.getElementById("bg");
        if (bgElement) bgElement.style.backgroundImage = `url('assets/background/bg${id}.webp')`;
      }
    }
  }

  async function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) return;

    isUploading = true;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;

      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        console.warn(`Skipping ${file.name}: exceeds ${MAX_FILE_MB} MB`);
        continue;
      }

      try {
        const dataUrl = await compressImage(file);

        const customBg = {
          id:      `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name:    file.name,
          dataUrl,
          type:    "image/webp",
        };

        customBackgrounds.push(customBg);
        saveCustomBackgrounds();
        buildAllBackgrounds();

        window.dispatchEvent(new CustomEvent("backgroundsUpdated"));
        selectCustomBackground(customBg);
      } catch (err) {
        console.error(`Failed to process ${file.name}:`, err);
      }
    }

      isUploading = false;
      target.value = "";
  }

  function applyCurrentBackground() {
    const bg = document.getElementById("bg");
    if (!bg) return;

    if (bgType === "custom" && customBgId) {
      const customBg = customBackgrounds.find((bg) => bg.id === customBgId);
      if (customBg) {
        bg.style.backgroundImage = `url('${customBg.dataUrl}')`;
        return;
      } else {
        bgType = "default";
        localStorage.setItem("bg-type", "default");
        localStorage.removeItem("custom-bg-id");
      }
    }
    bg.style.backgroundImage = `url('assets/background/bg${id}.webp')`;
  }

  function nextBg() {
    buildAllBackgrounds();
    const currentIndex = getCurrentIndex();
    applyBackground(allBackgrounds[(currentIndex + 1) % allBackgrounds.length]);
  }

  function prevBg() {
    buildAllBackgrounds();
    const currentIndex = getCurrentIndex();
    const prevIndex = currentIndex === 0 ? allBackgrounds.length - 1 : currentIndex - 1;
    applyBackground(allBackgrounds[prevIndex]);
  }

  function getCurrentIndex(): number {
    if (bgType === "custom" && customBgId)
      return allBackgrounds.findIndex((bg) => bg.id === customBgId);
    return allBackgrounds.findIndex((bg) => bg.id === `default_${id}`);
  }

  function applyBackground(background: any) {
    const bg = document.getElementById("bg");
    if (!bg) return;

    isTransitioning = true;

    const img = new Image();
    img.onload = () => {
      bg.style.backgroundImage = `url('${background.url}')`;
      isTransitioning = false;
    };
    img.onerror = () => { isTransitioning = false; };
    img.src = background.url;

    if (background.type === "default") {
      const defaultId = background.id.replace("default_", "");
      id = parseInt(defaultId);
      bgType = "default";
      localStorage.setItem("bg-id", id.toString());
      localStorage.setItem("bg-type", "default");
      localStorage.removeItem("custom-bg-id");
    } else {
      customBgId = background.id;
      bgType = "custom";
      localStorage.setItem("bg-type", "custom");
      localStorage.setItem("custom-bg-id", customBgId);
    }
  }

  window.addEventListener("customBackgroundSelected", (event: CustomEvent) => {
    bgType = "custom";
    customBgId = event.detail.id;
    localStorage.setItem("bg-type", "custom");
    localStorage.setItem("custom-bg-id", customBgId);
  });

  window.addEventListener("backgroundsUpdated", () => {
    loadCustomBackgrounds();
    buildAllBackgrounds();
  });

  window.addEventListener("keydown", (e: KeyboardEvent) => {
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
  <div class="header">
    <h4>{$t.settings.background.title}</h4>
    <label
      data-tooltip={$t.settings.background.add_custom}
      for="bg-upload"
      class="upload-btn"
      class:uploading={isUploading}
    >
      <IconPlus size={16} />
    </label>
    <input
      id="bg-upload"
      type="file"
      accept="image/*"
      multiple
      on:change={handleFileUpload}
      style="display: none;"
    />
  </div>

  <div class="container">
    <button on:click={prevBg}>
      <IconArrowLeft size={20} />
    </button>
    {#if allBackgrounds.length > 0}
      {@const currentBg = allBackgrounds.find(
        (bg) =>
          (bgType === "custom" && bg.id === customBgId) ||
          (bgType === "default" && bg.id === `default_${id}`),
      )}
      {#if currentBg}
        <div class="preview-container" class:transitioning={isTransitioning}>
          <img id="bg-preview" src={currentBg.url} alt={currentBg.name} loading="lazy" />
          {#if bgType === "custom" && customBgId}
            <button
              class="delete-current-btn"
              on:click={() =>
                deleteCustomBackground(
                  customBackgrounds.find((bg) => bg.id === customBgId),
                )}
              data-tooltip={$t.settings.background.delete_tooltip}
            >
              <IconTrash size={16} />
            </button>
          {/if}
        </div>
      {:else}
        <img id="bg-preview" src="assets/background/bg{id}.webp" alt="" loading="lazy" />
      {/if}
    {:else}
      <img id="bg-preview" src="assets/background/bg{id}.webp" alt="" loading="lazy" />
    {/if}
    <button on:click={nextBg}>
      <IconArrowRight size={20} />
    </button>
  </div>

  {#if isUploading}
    <div class="uploading-indicator">
      <div class="spinner"></div>
      <span>{$t.settings.background.processing}</span>
    </div>
  {/if}
</div>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .header h4 {
    margin: 0;
    color: white;
    font-size: 1.1em;
  }

  .upload-btn {
    display: flex;
    align-items: center;
    padding: 6px 10px;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .upload-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .upload-btn.uploading {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    justify-content: center;
  }
  .preview-container {
    position: relative;
    display: inline-block;
  }

  #bg-preview {
    width: 200px;
    height: 120px;
    border-radius: 7px;
    margin: 0 10px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .delete-current-btn {
    position: absolute;
    bottom: 18px;
    right: 18px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: rgba(255, 0, 0, 0.9);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    transition:
      opacity 0.2s ease,
      background-color 0.2s ease;
    backdrop-filter: blur(5px);
    z-index: 10;
  }

  .preview-container:hover .delete-current-btn {
    opacity: 1;
  }

  .delete-current-btn:hover {
    background-color: rgba(255, 0, 0, 1);
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

  .uploading-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9em;
    margin-top: 10px;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @media only screen and (max-width: 600px) {
    #bg-preview {
      width: 90px;
      height: 150px;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      background-size: cover;
      background-position: center;
    }
  }
</style>
