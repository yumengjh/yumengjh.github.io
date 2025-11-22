export async function loadLocale(lang: 'en' | 'zh') {
  if (lang === 'zh') {
    const mod = await import('./locales/zh');
    return mod.default;
  }
  const mod = await import('./locales/en');
  return mod.default;
}
