<script lang="ts">
    import { t } from "../../../locales/store";
    import { volumes, setVolume } from "../../../stores/volumes";
</script>

<div>
    <h4>{$t.settings.volume.title}</h4>
    <section id="rain-volume">
        <h5>{$t.settings.volume.rain}</h5>
        <p>{Math.round($volumes.rain * 100)}</p>
        <input
            id="volume-slider"
            type="range"
            value={$volumes.rain}
            min="0.01"
            max="1"
            step="0.01"
            on:input={(e) => setVolume("rain", parseFloat(e.currentTarget.value))}
        />
    </section>
    <section id="thunder-volume">
        <h5>{$t.settings.volume.thunder}</h5>
        <p>{Math.round($volumes.thunder * 100)}</p>
        <input
            id="volume-slider"
            type="range"
            value={$volumes.thunder}
            min="0.01"
            max="1"
            step="0.01"
            on:input={(e) => setVolume("thunder", parseFloat(e.currentTarget.value))}
        />
    </section>
    <section id="jungle-volume">
        <h5>{$t.settings.volume.jungle}</h5>
        <p>{Math.round($volumes.jungle * 100)}</p>
        <input
            id="volume-slider"
            type="range"
            value={$volumes.jungle}
            min="0.01"
            max="1"
            step="0.01"
            on:input={(e) => setVolume("jungle", parseFloat(e.currentTarget.value))}
        />
    </section>
    <section id="fire-volume">
        <h5>{$t.settings.volume.campfire}</h5>
        <p>{Math.round($volumes.campfire * 100)}</p>
        <input
            id="volume-slider"
            type="range"
            value={$volumes.campfire}
            min="0.01"
            max="1"
            step="0.01"
            on:input={(e) => setVolume("campfire", parseFloat(e.currentTarget.value))}
        />
    </section>
    <section id="main-track-volume">
        <h5>{$t.settings.volume.main_track}</h5>
        <p>{Math.round($volumes.main_track * 100)}</p>
        <input
            id="volume-slider"
            type="range"
            value={$volumes.main_track}
            min="0.01"
            max="1"
            step="0.01"
            on:input={(e) => setVolume("main_track", parseFloat(e.currentTarget.value))}
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
