import type { Translations } from './types';

export const zh: Translations = {
    settings: {
        title: '设置',
        background: {
            title: '背景',
            add_custom: '添加自定义图片',
            delete_tooltip: '删除此背景',
            processing: '正在处理图片...',
        },
        volume: {
            title: '音量',
            rain: '雨声',
            thunder: '雷声',
            jungle: '丛林',
            campfire: '篝火',
            main_track: '主音轨',
        },
        autodj: {
            title: '沉浸感',
            modes: {
                music: {
                    label: '音乐',
                    desc: '仅节奏和和弦。无氛围或世界效果。',
                },
                atmosphere: {
                    label: '氛围',
                    desc: '添加核心天气和自然效果',
                },
                world: {
                    label: '世界',
                    desc: '添加特定纹理，如城市、风等。',
                },
                manual: {
                    label: '手动',
                    desc: '无自动更改。完全由用户控制。',
                },
            },
        },
        language: {
            title: '语言',
            select: '选择语言',
        },
    },
    info: {
        title: 'Lofi Engine',
        tagline: '创造属于你的氛围，Lofi Engine 设定心情。',
        buttons: {
            show_next_time: '下次启动时显示',
        },
        shortcuts: {
            title: '快捷键',
            general: {
                title: '常规',
                esc: '显示/隐藏此框',
                j: '打开/关闭设置',
                next_bg: '下一张背景图片',
                prev_bg: '上一张背景图片',
                restart: '重新开始',
            },
            main_track: {
                title: '主音轨',
                play_pause: '播放/暂停主音轨',
            },
            effects: {
                title: '效果',
                rain: '控制雨声',
                thunder: '控制雷暴',
                nature: '控制自然声音',
                campfire: '控制篝火',
            },
            ambient: {
                title: '环境音轨',
                next: '导航至下一首',
                prev: '导航至上一首',
                stop_all: '停止所有环境音',
                play_pause_specific: '播放/暂停环境音轨',
            },
        },
    },
    context_menu: {
        play: '播放',
        pause: '暂停',
        toggle_rain: '切换雨声',
        toggle_thunder: '切换雷声',
        toggle_jungle: '切换丛林',
        toggle_campfire: '切换篝火',
        reload: '重新加载',
        about: '关于',
    },
    tracks: {
        1: { quote: "我们无法引导风向，但我们可以调整风帆。" },
        2: { quote: "大海是情感的化身。它爱，它恨，它哭泣。" },
        3: { quote: "黑夜揭示星辰，正如黑暗揭示自我。" },
        4: { quote: "夕阳的天空诉说着千种色彩。" },
        5: { quote: "在沉默中努力工作，让成功成为你的喧嚣。" },
        6: { quote: "城市不是水泥森林，它是人类动物园。" },
        7: { quote: "过去是参考之地，而非居住之所。" },
        8: { quote: "旅程不会永远持续，但记忆会。" },
        9: { quote: "请帮帮我，我在水下。" },
    },
};
