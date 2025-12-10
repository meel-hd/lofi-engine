import type { Translations } from './types';

export const fr: Translations = {
    settings: {
        title: 'Paramètres',
        background: {
            title: 'Arrière-plan',
            add_custom: 'Ajouter des images personnalisées',
            delete_tooltip: 'Supprimer cet arrière-plan',
            processing: 'Traitement des images...',
        },
        volume: {
            title: 'Volume',
            rain: 'Pluie',
            thunder: 'Tonnerre',
            jungle: 'Jungle',
            campfire: 'Feu de camp',
            main_track: 'Piste principale',
        },
        autodj: {
            title: 'Immersion',
            modes: {
                music: {
                    label: 'Musique',
                    desc: 'Juste le rythme et les accords. Pas d\'effets d\'ambiance ou de monde.',
                },
                atmosphere: {
                    label: 'Atmosphère',
                    desc: 'Ajoute les effets météorologiques et naturels de base',
                },
                world: {
                    label: 'Monde',
                    desc: 'Ajoute des textures spécifiques comme la ville, le vent, etc.',
                },
                manual: {
                    label: 'Manuel',
                    desc: 'Aucun changement automatique. Contrôle total de l\'utilisateur.',
                },
            },
        },
        language: {
            title: 'Langue',
            select: 'Sélectionner la langue',
        },
    },
    info: {
        title: 'Lofi Engine',
        tagline: 'Créez votre propre atmosphère, Lofi Engine met l\'ambiance.',
        buttons: {
            show_next_time: 'Afficher au prochain démarrage',
        },
        shortcuts: {
            title: 'Raccourcis',
            general: {
                title: 'Général',
                esc: 'Afficher/masquer cette boîte',
                j: 'Ouvrir/fermer les paramètres',
                next_bg: 'Image d\'arrière-plan suivante',
                prev_bg: 'Image d\'arrière-plan précédente',
                restart: 'Redémarrer',
            },
            main_track: {
                title: 'Piste principale',
                play_pause: 'Lire/Pause Piste principale',
            },
            effects: {
                title: 'Effets',
                rain: 'Contrôler la pluie',
                thunder: 'Contrôler l\'orage',
                nature: 'Contrôler les sons de la nature',
                campfire: 'Contrôler le feu de camp',
            },
            ambient: {
                title: 'Pistes ambiantes',
                next: 'Naviguer vers la piste suivante',
                prev: 'Naviguer vers la piste précédente',
                stop_all: 'Arrêter tous les sons ambiants',
                play_pause_specific: 'Lire/Pause Piste ambiante',
            },
        },
    },
    context_menu: {
        play: 'Lire',
        pause: 'Pause',
        toggle_rain: 'Basculer la pluie',
        toggle_thunder: 'Basculer le tonnerre',
        toggle_jungle: 'Basculer la jungle',
        toggle_campfire: 'Basculer le feu de camp',
        reload: 'Recharger',
        about: 'À propos',
    },
    tracks: {
        1: { quote: "Nous ne pouvons pas diriger le vent, mais nous pouvons ajuster les voiles." },
        2: { quote: "La mer est l'émotion incarnée. Elle aime, hait et pleure." },
        3: { quote: "La nuit révèle les étoiles comme l'obscurité révèle le soi." },
        4: { quote: "Le ciel au coucher du soleil parle de mille couleurs." },
        5: { quote: "Travaillez dur en silence, laissez votre succès faire du bruit." },
        6: { quote: "La ville n'est pas une jungle de béton, c'est un zoo humain." },
        7: { quote: "Le passé est un lieu de référence, pas un lieu de résidence." },
        8: { quote: "Les voyages ne durent pas éternellement, mais les souvenirs si." },
        9: { quote: "Aidez-moi s'il vous plaît, je suis sous l'eau." },
    },
};
