<script lang="ts">
  import { IconArrowLeft, IconArrowRight, IconPlus, IconTrash } from "@tabler/icons-svelte";
  import { onMount } from "svelte";
  import localDB from "../../../localDB"
  
  // get id from localstorage
  let id: any = localStorage.getItem("bg-id") || 1;
  let bgType = localStorage.getItem("bg-type") || "default";
  let customBgId = localStorage.getItem("custom-bg-id");
  
  let customBackgrounds = [];
  let allBackgrounds = [];
  let isUploading = false;
  
  onMount(async () => {
    await loadCustomBackgrounds();
    buildAllBackgrounds();
    applyCurrentBackground();
  });

  async function loadCustomBackgrounds() {
    const saved =  await localDB.getItem("custom-backgrounds");
    if (saved) {
      customBackgrounds = JSON.parse(saved);
    }
  }

  function buildAllBackgrounds() {
    allBackgrounds = [];
    
    for (let i = 1; i <= 10; i++) {
      allBackgrounds.push({
        id: `default_${i}`,
        type: 'default',
        name: `Background ${i}`,
        url: `assets/background/bg${i}.jpg`
      });
    }
    
    customBackgrounds.forEach(bg => {
      allBackgrounds.push({
        id: bg.id,
        type: 'custom',
        name: bg.name,
        url: bg.dataUrl
      });
    });
  }

  function saveCustomBackgrounds() {
    localDB.setItem("custom-backgrounds", JSON.stringify(customBackgrounds));
  }

  function selectCustomBackground(bg: any) {
    applyBackground({
      id: bg.id,
      type: 'custom',
      name: bg.name,
      url: bg.dataUrl
    });
  }

  function deleteCustomBackground(bg: any) {
    customBackgrounds = customBackgrounds.filter(b => b.id !== bg.id);
    saveCustomBackgrounds();
    buildAllBackgrounds();
    
    window.dispatchEvent(new CustomEvent('backgroundsUpdated'));
    
    if (bgType === "custom" && customBgId === bg.id) {
      const currentIndex = allBackgrounds.findIndex(b => b.id === bg.id);
      let nextIndex = (currentIndex + 1) % allBackgrounds.length;
      
      if (nextIndex === 0 && allBackgrounds.length > 1) {
        nextIndex = allBackgrounds.length - 1;
      }
      
      if (allBackgrounds.length > 1) {
        applyBackground(allBackgrounds[nextIndex]);
      } else {
        localStorage.setItem("bg-type", "default");
        localStorage.removeItem("custom-bg-id");
        const defaultId = localStorage.getItem("bg-id") || 1;
        const bgElement = document.getElementById("bg");
        if (bgElement) {
          bgElement.style.backgroundImage = `url('assets/background/bg${defaultId}.jpg')`;
        }
      }
    }
  }

  function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    
    if (files && files.length > 0) {
      isUploading = true;
      
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            const customBg = {
              id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              dataUrl: dataUrl,
              size: file.size,
              type: file.type
            };
            
            customBackgrounds.push(customBg);
            saveCustomBackgrounds();
            buildAllBackgrounds();
            
            window.dispatchEvent(new CustomEvent('backgroundsUpdated'));
            
            selectCustomBackground(customBg);
          };
          reader.readAsDataURL(file);
        }
      });
      
      isUploading = false;
      target.value = '';
    }
  }


  function applyCurrentBackground() {
    const bg = document.getElementById("bg");
    if (!bg) return;

    if (bgType === "custom" && customBgId) {
      const customBg = customBackgrounds.find(bg => bg.id === customBgId);
      if (customBg) {
        bg.style.backgroundImage = `url('${customBg.dataUrl}')`;
        return;
      } else {
        bgType = "default";
        localStorage.setItem("bg-type", "default");
        localStorage.removeItem("custom-bg-id");
      }
    }
    bg.style.backgroundImage = `url('assets/background/bg${id}.jpg')`;
  }

  function nextBg() {
    buildAllBackgrounds();
    
    let currentIndex = 0;
    
    if (bgType === "custom" && customBgId) {
      currentIndex = allBackgrounds.findIndex(bg => bg.id === customBgId);
    } else {
      currentIndex = allBackgrounds.findIndex(bg => bg.id === `default_${id}`);
    }
    const nextIndex = (currentIndex + 1) % allBackgrounds.length;
    const nextBg = allBackgrounds[nextIndex];
    
    applyBackground(nextBg);
  }

  function prevBg() {
    buildAllBackgrounds();
    
    let currentIndex = 0;
    
    if (bgType === "custom" && customBgId) {
      currentIndex = allBackgrounds.findIndex(bg => bg.id === customBgId);
    } else {
      currentIndex = allBackgrounds.findIndex(bg => bg.id === `default_${id}`);
    }
    const prevIndex = currentIndex === 0 ? allBackgrounds.length - 1 : currentIndex - 1;
    const prevBg = allBackgrounds[prevIndex];
    
    applyBackground(prevBg);
  }

  function applyBackground(background: any) {
    const bg = document.getElementById("bg");
    if (bg) {
      bg.style.backgroundImage = `url('${background.url}')`;
      
      if (background.type === 'default') {
        const defaultId = background.id.replace('default_', '');
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
  }

  function applyDefaultBackground() {
    const bg = document.getElementById("bg");
    if (bg) {
      bg.style.backgroundImage = `url('assets/background/bg${id}.jpg')`;
      localStorage.setItem("bg-id", id.toString());
      bgType = "default";
      localStorage.setItem("bg-type", "default");
    }
  }

  window.addEventListener('customBackgroundSelected', (event: CustomEvent) => {
    bgType = "custom";
    customBgId = event.detail.id;
    localStorage.setItem("bg-type", "custom");
    localStorage.setItem("custom-bg-id", customBgId);
  });

  window.addEventListener('backgroundsUpdated', () => {
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
    <h4>Background</h4>
    <label title="Add Custom Images" for="bg-upload" class="upload-btn" class:uploading={isUploading}>
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
      {@const currentBg = allBackgrounds.find(bg => 
        (bgType === "custom" && bg.id === customBgId) || 
        (bgType === "default" && bg.id === `default_${id}`)
      )}
      {#if currentBg}
        <div class="preview-container">
          <img id="bg-preview" src={currentBg.url} alt={currentBg.name} />
          {#if bgType === "custom" && customBgId}
            <button 
              class="delete-current-btn" 
              on:click={() => deleteCustomBackground(customBackgrounds.find(bg => bg.id === customBgId))}
              title="Delete this background"
            >
              <IconTrash size={16} />
            </button>
          {/if}
        </div>
      {:else}
        <img id="bg-preview" src="assets/background/bg{id}.jpg" alt="" />
      {/if}
    {:else}
      <img id="bg-preview" src="assets/background/bg{id}.jpg" alt="" />
    {/if}
    <button on:click={nextBg}>
      <IconArrowRight size={20} />
    </button>
  </div>


  {#if isUploading}
    <div class="uploading-indicator">
      <div class="spinner"></div>
      <span>Processing images...</span>
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
    transition: opacity 0.2s ease, background-color 0.2s ease;
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
