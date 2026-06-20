import en from '../i18n/en.json';
import zh from '../i18n/zh.json';
import ja from '../i18n/ja.json';
import ko from '../i18n/ko.json';
import es from '../i18n/es.json';

const messages: Record<string, any> = { en, zh, ja, ko, es };

export type Locale = 'en' | 'zh' | 'ja' | 'ko' | 'es';
export const defaultLocale: Locale = 'en';
export const supportedLocales: Locale[] = ['en', 'zh', 'ja', 'ko', 'es'];

export function getLocale(url: URL): Locale {
  const pathLang = url.pathname.split('/')[1];
  if (supportedLocales.includes(pathLang as Locale)) return pathLang as Locale;
  const cookieLang = url.searchParams.get('lang');
  if (cookieLang && supportedLocales.includes(cookieLang as Locale)) return cookieLang as Locale;
  return defaultLocale;
}

export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value = messages[locale] || messages[defaultLocale];
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }
  return typeof value === 'string' ? value : key;
}

export function getMessages(locale: Locale) {
  return messages[locale] || messages[defaultLocale];
}
