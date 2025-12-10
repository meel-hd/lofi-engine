import type { Translations } from './types';

export const nl: Translations = {
    settings: {
        title: 'Instellingen',
        background: {
            title: 'Achtergrond',
            add_custom: 'Aangepaste afbeeldingen toevoegen',
            delete_tooltip: 'Deze achtergrond verwijderen',
            processing: 'Afbeeldingen verwerken...',
        },
        volume: {
            title: 'Volume',
            rain: 'Regen',
            thunder: 'Onweer',
            jungle: 'Jungle',
            campfire: 'Kampvuur',
            main_track: 'Hoofdtrack',
        },
        autodj: {
            title: 'Immersie',
            modes: {
                music: {
                    label: 'Muziek',
                    desc: 'Alleen de beat en akkoorden. Geen sfeer- of wereldeffecten.',
                },
                atmosphere: {
                    label: 'Sfeer',
                    desc: 'Voegt de kernweer- en natuureffecten toe',
                },
                world: {
                    label: 'Wereld',
                    desc: 'Voegt specifieke texturen toe zoals stad, wind, enz.',
                },
                manual: {
                    label: 'Handmatig',
                    desc: 'Geen automatische wijzigingen. Volledige gebruikerscontrole.',
                },
            },
        },
        language: {
            title: 'Taal',
            select: 'Selecteer taal',
        },
    },
    info: {
        title: 'Lofi Engine',
        tagline: 'Creëer je eigen sfeer, Lofi Engine bepaalt de stemming.',
        buttons: {
            show_next_time: 'Toon bij volgende start',
        },
        shortcuts: {
            title: 'Sneltoetsen',
            general: {
                title: 'Algemeen',
                esc: 'Toon/verberg dit vak',
                j: 'Open/sluit instellingen',
                next_bg: 'Volgende achtergrondafbeelding',
                prev_bg: 'Vorige achtergrondafbeelding',
                restart: 'Herstarten',
            },
            main_track: {
                title: 'Hoofdtrack',
                play_pause: 'Afspelen/Pauzeren Hoofdtrack',
            },
            effects: {
                title: 'Effecten',
                rain: 'Regen bedienen',
                thunder: 'Onweer bedienen',
                nature: 'Natuurgeluiden bedienen',
                campfire: 'Kampvuur bedienen',
            },
            ambient: {
                title: 'Ambient Tracks',
                next: 'Navigeer naar volgende track',
                prev: 'Navigeer naar vorige track',
                stop_all: 'Stop alle ambient geluiden',
                play_pause_specific: 'Afspelen/Pauzeren Ambient Track',
            },
        },
    },
    context_menu: {
        play: 'Afspelen',
        pause: 'Pauzeren',
        toggle_rain: 'Regen schakelen',
        toggle_thunder: 'Onweer schakelen',
        toggle_jungle: 'Jungle schakelen',
        toggle_campfire: 'Kampvuur schakelen',
        reload: 'Herladen',
        about: 'Over',
    },
    tracks: {
        1: { quote: "We kunnen de wind niet sturen, maar we kunnen de zeilen bijstellen." },
        2: { quote: "De zee is emotie in vlees en bloed. Ze heeft lief, haat en huilt." },
        3: { quote: "De nacht onthult de sterren zoals de duisternis het zelf onthult." },
        4: { quote: "De zonsondergang spreekt van duizend kleuren." },
        5: { quote: "Werk hard in stilte, laat je succes je lawaai zijn." },
        6: { quote: "De stad is geen betonnen jungle, het is een menselijke dierentuin." },
        7: { quote: "Het verleden is een plaats van referentie, geen plaats van verblijf." },
        8: { quote: "Reizen duren niet eeuwig, maar herinneringen wel." },
        9: { quote: "Help me alsjeblieft, ik ben onder water." },
    },
};
