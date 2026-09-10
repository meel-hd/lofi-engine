import type { Translations } from './types';

export const hi: Translations = {
    settings: {
        title: 'सेटिंग्स',
        background: {
            title: 'पृष्ठभूमि',
            add_custom: 'कस्टम चित्र जोड़ें',
            delete_tooltip: 'इस पृष्ठभूमि को हटाएं',
            processing: 'छवियों को प्रोसेस किया जा रहा है...',
        },
        volume: {
            title: 'वॉल्यूम',
            rain: 'बारिश',
            thunder: 'तूफान',
            jungle: 'जंगल',
            campfire: 'कैम्प फायर',
            main_track: 'मुख्य ट्रैक',
        },
        autodj: {
            title: 'इमर्शन',
            description: 'चुनें कि Lofi Engine अपने आप कितना माहौल जोड़े।',
            modes: {
                music: {
                    label: 'संगीत',
                    desc: 'बस बीट और कॉर्ड्स। कोई माहौल या दुनिया के प्रभाव नहीं।',
                },
                atmosphere: {
                    label: 'माहौल',
                    desc: 'मुख्य मौसम और प्रकृति प्रभाव जोड़ता है',
                },
                world: {
                    label: 'दुनिया',
                    desc: 'शहर, हवा आदि जैसे विशिष्ट बनावट जोड़ता है।',
                },
                manual: {
                    label: 'मैनुअल',
                    desc: 'कोई स्वचालित परिवर्तन नहीं। पूर्ण उपयोगकर्ता नियंत्रण।',
                },
            },
        },
        language: {
            title: 'भाषा',
            select: 'भाषा चुनें',
        },
    },
    info: {
        title: 'Lofi Engine',
        tagline: 'अपना खुद का माहौल बनाएं, Lofi Engine मूड सेट करता है।',
        buttons: {
            show_next_time: 'अगली बार शुरू होने पर दिखाएं',
        },
        shortcuts: {
            title: 'शॉर्टकट',
            general: {
                title: 'सामान्य',
                esc: 'इस बॉक्स को दिखाएं/छिपाएं',
                j: 'सेटिंग्स खोलें/बंद करें',
                next_bg: 'अगली पृष्ठभूमि छवि',
                prev_bg: 'पिछली पृष्ठभूमि छवि',
                restart: 'पुनः आरंभ करें',
            },
            main_track: {
                title: 'मुख्य ट्रैक',
                play_pause: 'मुख्य ट्रैक चलाएं/रोकें',
            },
            effects: {
                title: 'प्रभाव',
                rain: 'बारिश को नियंत्रित करें',
                thunder: 'तूफान को नियंत्रित करें',
                nature: 'प्रकृति की आवाज़ को नियंत्रित करें',
                campfire: 'कैम्प फायर को नियंत्रित करें',
            },
            ambient: {
                title: 'एम्बिएंट ट्रैक्स',
                next: 'अगले ट्रैक पर जाएं',
                prev: 'पिछले ट्रैक पर जाएं',
                stop_all: 'सभी एम्बिएंट ध्वनियाँ रोकें',
                play_pause_specific: 'एम्बिएंट ट्रैक चलाएं/रोकें',
            },
        },
    },
    context_menu: {
        play: 'चलाएं',
        pause: 'रोकें',
        toggle_rain: 'बारिश टॉगल करें',
        toggle_thunder: 'तूफान टॉगल करें',
        toggle_jungle: 'जंगल टॉगल करें',
        toggle_campfire: 'कैम्प फायर टॉगल करें',
        reload: 'रीलोड',
        about: 'के बारे में',
    },
    tracks: {
        1: { quote: "हम हवा को निर्देशित नहीं कर सकते, लेकिन हम पाल को समायोजित कर सकते हैं।" },
        2: { quote: "समुद्र भावना का अवतार है। यह प्यार करता है, नफरत करता है, और रोता है।" },
        3: { quote: "रात सितारों को वैसे ही प्रकट करती है जैसे अंधेरा स्वयं को प्रकट करता है।" },
        4: { quote: "सूर्यास्त का आकाश हजारों रंगों की बात करता है।" },
        5: { quote: "मौन में कड़ी मेहनत करें, अपनी सफलता को अपना शोर बनने दें।" },
        6: { quote: "शहर कंक्रीट का जंगल नहीं है, यह एक मानव चिड़ियाघर है।" },
        7: { quote: "अतीत संदर्भ का स्थान है, निवास का स्थान नहीं।" },
        8: { quote: "यात्राएं हमेशा के लिए नहीं रहतीं, लेकिन यादें रहती हैं।" },
        9: { quote: "कृपया मेरी मदद करें, मैं पानी के नीचे हूँ।" },
    },
    focus: {
        focus: 'फोकस', tasks: 'कार्य', mini: 'मिनी', normal: 'सामान्य',
        zen: 'ज़ेन मोड', exit_zen: 'ज़ेन मोड से बाहर निकलें',
        paused: 'रुका हुआ', short_break: 'छोटा विराम', long_break: 'लंबा विराम',
        start: 'शुरू', pause: 'रोकें', resume: 'जारी रखें', skip: 'छोड़ें', end: 'समाप्त',
        settings: 'सेटिंग्स', stats: 'आँकड़े', close_timer: 'टाइमर बंद करें', close_tasks: 'कार्य बंद करें',
        placeholder: 'आप किस पर ध्यान दे रहे हैं?', add: 'जोड़ें', completed: 'पूर्ण',
        active: 'सक्रिय फोकस कार्य', inactive: 'निष्क्रिय कार्य', select: 'फोकस कार्य चुनें',
        unselect: 'फोकस कार्य का चयन हटाएँ', complete: 'पूर्ण चिह्नित करें', incomplete: 'अपूर्ण चिह्नित करें',
        remove: 'कार्य हटाएँ', completed_task: 'पूर्ण कार्य',
        task_actions: 'कार्य विकल्प',
        empty: 'अपने Pomodoro से जोड़ने के लिए एक कार्य जोड़ें।', working_on: 'इस पर काम कर रहे हैं',
        pomodoros_completed: 'पूर्ण Pomodoro', rounds: 'राउंड', rounds_complete: 'राउंड पूर्ण',
        minutes: 'मिनट', notifications: 'डेस्कटॉप सूचनाएँ', today_minutes: 'आज मिनट',
        today_pomodoros: 'आज Pomo', week_minutes: 'सप्ताह मिनट', week_pomodoros: 'सप्ताह Pomo',
        week_focus: 'पिछले सात दिनों का फोकस समय',
        last_seven_days: 'पिछले 7 दिन', no_focus_data: 'अभी तक कोई फोकस समय दर्ज नहीं है',
        focus_time: 'फोकस समय', break_time: 'विराम समय',
        break_over: 'आपका विराम समाप्त हो गया है।', take_break: 'बहुत बढ़िया। ऊर्जा पाने के लिए एक क्षण लें।',
    },
};
