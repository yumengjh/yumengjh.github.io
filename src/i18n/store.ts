// i18n store - 动态加载语言包并管理当前语言
import { writable } from 'svelte/store';
import { loadLocale } from './loader';

export type Language = 'en' | 'zh';

// 从 localStorage 读取保存的语言，默认为英语
function getInitialLanguage(): Language {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('language');
    if (saved === 'zh' || saved === 'en') return saved;
    const browserLang = navigator.language?.toLowerCase?.() || 'en';
    if (browserLang.startsWith('zh')) return 'zh';
  }
  return 'en';
}

// 当前语言
export const language = writable<Language>(getInitialLanguage());

// 当前语言对应的文案字典（异步加载）
export const messages = writable<Record<string, any>>({});

// 加载状态（可选）
export const i18nLoading = writable<boolean>(true);

// 内部：根据语言加载并设置 messages
async function applyLanguage(lang: Language) {
  i18nLoading.set(true);
  const dict = await loadLocale(lang);
  messages.set(dict);
  i18nLoading.set(false);
}

// 初始化加载
applyLanguage(getInitialLanguage());

// 订阅语言变化，保存到 localStorage 并动态加载
language.subscribe((lang) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
  applyLanguage(lang);
});

// 切换语言
export function toggleLanguage() {
  language.update((current) => (current === 'en' ? 'zh' : 'en'));
}

// 设置特定语言
export function setLanguage(lang: Language) {
  language.set(lang);
}
