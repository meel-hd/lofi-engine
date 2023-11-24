<script lang="ts">
    const STORAGE_KEY = "Effects-volume";
    const DEFFAULT_VOLUMES = {
        rain: 1,
        thunder: 1,
        campfire: 1,
        jungle: 1,
    };
    // Load previous vols or defualt
    let effectsVol =
        JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFFAULT_VOLUMES;

    // Save current volumes to local storage
    function SaveVolume() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(effectsVol));
    }

    // Updater functions for each volume knob
    function updateRainVolume(e) {
        effectsVol.rain = parseFloat(e.target.value);
        SaveVolume();
    }
    function updateThunderVolume(e) {
        effectsVol.thunder = parseFloat(e.target.value);
        SaveVolume();
    }
    function updateJungleVolume(e) {
        effectsVol.jungle = parseFloat(e.target.value);
        SaveVolume();
    }
    function updateFireVolume(e) {
        effectsVol.campfire = parseFloat(e.target.value);
        SaveVolume();
    }
</script>

<div>
    <h4>Effects Volume</h4>
    <section id="rain-volume">
        <p>{Math.round(effectsVol.rain * 100)}</p>
        <h5>Rain</h5>
        <input
            id="volume-slider"
            type="range"
            bind:value={effectsVol.rain}
            min="0.01"
            max="1"
            step="0.01"
            on:input={updateRainVolume}
        />
    </section>
    <section id="thunder-volume">
        <p>{Math.round(effectsVol.thunder * 100)}</p>
        <h5>Thunder</h5>
        <input
            id="volume-slider"
            type="range"
            bind:value={effectsVol.thunder}
            min="0.01"
            max="1"
            step="0.01"
            on:input={updateThunderVolume}
        />
    </section>
    <section id="jungle-volume">
        <p>{Math.round(effectsVol.jungle * 100)}</p>
        <h5>Jungle</h5>
        <input
            id="volume-slider"
            type="range"
            bind:value={effectsVol.jungle}
            min="0.01"
            max="1"
            step="0.01"
            on:input={updateJungleVolume}
        />
    </section>
    <section id="fire-volume">
        <p>{Math.round(effectsVol.campfire * 100)}</p>
        <h5>Campfire</h5>
        <input
            id="volume-slider"
            type="range"
            bind:value={effectsVol.campfire}
            min="0.01"
            max="1"
            step="0.01"
            on:input={updateFireVolume}
        />
    </section>
</div>

<style>
    section {
        margin-bottom: 30px;
    }
    h5 {
        margin-left: 10px;
    }
    p {
        text-align: right;
        font-size: 12px;
        margin-bottom: -65px;
        margin-right: 7%;
    }
    #volume-slider {
        width: 90%;
        margin-left: 10px;
    }
</style>
