import { writable, derived } from 'svelte/store';
import type { Translations } from './types';
import { en } from './en';
import { ja } from './ja';
import { zh } from './zh';
import { hi } from './hi';
import { fr } from './fr';
import { nl } from './nl';

const locales: Record<string, Translations> = {
    en,
    ja,
    zh,
    hi,
    fr,
    nl,
};

const initialLocale = localStorage.getItem('locale') || 'en';

export const locale = writable<string>(initialLocale);

export const t = derived(locale, ($locale) => {
    return locales[$locale] || locales['en'];
});

export const dir = derived(locale, () => {
    return 'ltr';
});

export const setLocale = (lang: string) => {
    if (locales[lang]) {
        locale.set(lang);
        localStorage.setItem('locale', lang);
        // Update document direction immediately for better UX
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = lang;
    }
};
