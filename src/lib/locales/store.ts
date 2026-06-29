import { writable, derived } from 'svelte/store';
import type { Translations } from './types';
import { en } from './en';
import { ja } from './ja';
import { zh } from './zh';
import { hi } from './hi';
import { fr } from './fr';
import { nl } from './nl';
import { ru } from './ru';

const locales: Record<string, Translations> = {
    en,
    ja,
    zh,
    hi,
    fr,
    nl,
    ru,
};

// Locales that render right-to-left. None ship today, but keeping the set
// here means adding an RTL locale "just works" without touching the layout.
const rtlLocales = new Set(['ar', 'he', 'fa', 'ur']);

const dirFor = (lang: string): 'ltr' | 'rtl' =>
    rtlLocales.has(lang) ? 'rtl' : 'ltr';

const initialLocale = localStorage.getItem('locale') || 'en';

export const locale = writable<string>(initialLocale);

export const t = derived(locale, ($locale) => {
    return locales[$locale] || locales['en'];
});

export const dir = derived(locale, ($locale) => {
    return dirFor($locale);
});

export const setLocale = (lang: string) => {
    if (locales[lang]) {
        locale.set(lang);
        localStorage.setItem('locale', lang);
        // Update document direction immediately for better UX
        document.documentElement.dir = dirFor(lang);
        document.documentElement.lang = lang;
    }
};
