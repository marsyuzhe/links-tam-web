'use client';
import { createContext, useContext, useEffect, useMemo, type ReactNode, forwardRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';
import { translateText } from '@/content/translations';
type Locale = 'zh' | 'en';
const Context = createContext<{
  locale: Locale;
  t: (s: string) => string;
  href: (s: string) => string;
}>({ locale: 'zh', t: (s) => s, href: (s) => s });
export function localizedHref(s: string, locale: Locale) {
  return locale === 'en' && s.startsWith('/') && !/^\/(en|assets|_next)(\/|$)/.test(s)
    ? '/en' + (s === '/' ? '' : s)
    : s;
}
export function LocaleProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale: Locale = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh';
  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN';
  }, [locale]);
  const value = useMemo(
    () => ({
      locale,
      t: (s: string) => (locale === 'en' ? translateText(s) : s),
      href: (s: string) => localizedHref(s, locale),
    }),
    [locale],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useLocale = () => useContext(Context);
export function T({ value }: { value: string }) {
  return useLocale().t(value);
}
export function SkipLink() {
  const { locale } = useLocale();
  return (
    <a className="skip-link" href="#main">
      {locale === 'en' ? 'Skip to content' : '跳至内容'}
    </a>
  );
}
export function LanguageSwitch() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const chinese = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  return (
    <nav className="language-switch" aria-label="Language">
      <Link href={chinese} lang="zh-CN" aria-current={locale === 'zh' ? 'page' : undefined}>
        简中
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href={'/en' + (chinese === '/' ? '' : chinese)}
        lang="en"
        aria-current={locale === 'en' ? 'page' : undefined}
      >
        EN
      </Link>
    </nav>
  );
}
export const LocaleLink = forwardRef<HTMLAnchorElement, ComponentProps<typeof Link>>(
  function LocaleLink({ href, ...props }, ref) {
    const { href: localHref } = useLocale();
    return <Link ref={ref} href={typeof href === 'string' ? localHref(href) : href} {...props} />;
  },
);
