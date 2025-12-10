import type { Translations } from './types';

export const ja: Translations = {
    settings: {
        title: '設定',
        background: {
            title: '背景',
            add_custom: 'カスタム画像を追加',
            delete_tooltip: 'この背景を削除',
            processing: '画像を処理中...',
        },
        volume: {
            title: '音量',
            rain: '雨',
            thunder: '雷',
            jungle: 'ジャングル',
            campfire: '焚き火',
            main_track: 'メイントラック',
        },
        autodj: {
            title: '没入感',
            modes: {
                music: {
                    label: '音楽',
                    desc: 'ビートとコードのみ。雰囲気や世界の効果はありません。',
                },
                atmosphere: {
                    label: '雰囲気',
                    desc: '主要な天候と自然の効果を追加します',
                },
                world: {
                    label: '世界',
                    desc: '都市、風などの特定のテクスチャを追加します。',
                },
                manual: {
                    label: '手動',
                    desc: '自動変更なし。ユーザーが完全に制御します。',
                },
            },
        },
        language: {
            title: '言語',
            select: '言語を選択',
        },
    },
    info: {
        title: 'Lofi Engine',
        tagline: 'あなただけの雰囲気を作り出す、Lofi Engineがムードを演出します。',
        buttons: {
            show_next_time: '次回起動時に表示する',
        },
        shortcuts: {
            title: 'ショートカット',
            general: {
                title: '一般',
                esc: 'このボックスを表示/非表示',
                j: '設定を開く/閉じる',
                next_bg: '次の背景画像',
                prev_bg: '前の背景画像',
                restart: '再起動',
            },
            main_track: {
                title: 'メイントラック',
                play_pause: 'メイントラックの再生/一時停止',
            },
            effects: {
                title: '効果',
                rain: '雨を制御',
                thunder: '雷雨を制御',
                nature: '自然音を制御',
                campfire: '焚き火を制御',
            },
            ambient: {
                title: 'アンビエントトラック',
                next: '次のトラックへ移動',
                prev: '前のトラックへ移動',
                stop_all: 'すべてのアンビエント音を停止',
                play_pause_specific: 'アンビエントトラックの再生/一時停止',
            },
        },
    },
    context_menu: {
        play: '再生',
        pause: '一時停止',
        toggle_rain: '雨を切り替え',
        toggle_thunder: '雷を切り替え',
        toggle_jungle: 'ジャングルを切り替え',
        toggle_campfire: '焚き火を切り替え',
        reload: 'リロード',
        about: 'について',
    },
    tracks: {
        1: { quote: "風の向きを変えることはできないが、帆の向きを変えることはできる。" },
        2: { quote: "海は感情の化身だ。愛し、憎み、そして泣く。" },
        3: { quote: "闇が自己を明らかにするように、夜は星を明らかにする。" },
        4: { quote: "夕焼け空は千の色を語る。" },
        5: { quote: "沈黙の中で懸命に働け、成功をあなたの音にせよ。" },
        6: { quote: "都市はコンクリートジャングルではなく、人間の動物園だ。" },
        7: { quote: "過去は参照する場所であり、居住する場所ではない。" },
        8: { quote: "旅は永遠には続かないが、思い出は続く。" },
        9: { quote: "助けて、水の中にいるの。" },
    },
};
