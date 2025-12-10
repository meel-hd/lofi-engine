<script lang="ts">
    import { t } from "../../../locales/store";
    const STORAGE_KEY = "Volumes";
    const DEFFAULT_VOLUMES = {
        rain: 1,
        thunder: 1,
        campfire: 1,
        jungle: 1,
        main_track: 1,
    };
    // Load previous vols or defualt
    let volumes =
        JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFFAULT_VOLUMES;

    // Save current volumes to local storage
    function SaveVolume() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(volumes));
    }

    // Updater functions for each volume knob
    function updateRainVolume(e) {
        volumes.rain = parseFloat(e.target.value);
        SaveVolume();
    }
    function updateThunderVolume(e) {
        volumes.thunder = parseFloat(e.target.value);
        SaveVolume();
    }
    function updateJungleVolume(e) {
        volumes.jungle = parseFloat(e.target.value);
        SaveVolume();
    }
    function updateFireVolume(e) {
        volumes.campfire = parseFloat(e.target.value);
        SaveVolume();
    }
    function updateMainTrackVolume(e) {
        volumes.main_track = parseFloat(e.target.value);
        SaveVolume();
    }
</script>

<div>
    <h4>{$t.settings.volume.title}</h4>
    <section id="rain-volume">
        <h5>{$t.settings.volume.rain}</h5>
        <p>{Math.round(volumes.rain * 100)}</p>
        <input
            id="volume-slider"
            type="range"
            bind:value={volumes.rain}
            min="0.01"
            max="1"
            step="0.01"
            on:input={updateRainVolume}
        />
    </section>
    <section id="thunder-volume">
        <h5>{$t.settings.volume.thunder}</h5>
        <p>{Math.round(volumes.thunder * 100)}</p>
        <input
            id="volume-slider"
            type="range"
            bind:value={volumes.thunder}
            min="0.01"
            max="1"
            step="0.01"
            on:input={updateThunderVolume}
        />
    </section>
    <section id="jungle-volume">
        <h5>{$t.settings.volume.jungle}</h5>
        <p>{Math.round(volumes.jungle * 100)}</p>
        <input
            id="volume-slider"
            type="range"
            bind:value={volumes.jungle}
            min="0.01"
            max="1"
            step="0.01"
            on:input={updateJungleVolume}
        />
    </section>
    <section id="fire-volume">
        <h5>{$t.settings.volume.campfire}</h5>
        <p>{Math.round(volumes.campfire * 100)}</p>
        <input
            id="volume-slider"
            type="range"
            bind:value={volumes.campfire}
            min="0.01"
            max="1"
            step="0.01"
            on:input={updateFireVolume}
        />
    </section>
    <section id="main-track-volume">
        <h5>{$t.settings.volume.main_track}</h5>
        <p>{Math.round(volumes.main_track * 100)}</p>
        <input
            id="volume-slider"
            type="range"
            bind:value={volumes.main_track}
            min="0.01"
            max="1"
            step="0.01"
            on:input={updateMainTrackVolume}
        />
    </section>
</div>

<style>
    h5 {
        margin-left: 10px;
        margin-bottom: -35px;
    }
    p {
        text-align: right;
        font-size: 12px;
        margin-right: 7%;
    }
    #volume-slider {
        width: 90%;
        margin-left: 10px;
    }
</style>
