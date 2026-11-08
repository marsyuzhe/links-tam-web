'use client';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { ThemeToggle } from '@/components/portfolio/ThemeToggle';
import { Cursor } from '@/components/portfolio/Cursor';
import { LocaleLink as Link, LanguageSwitch, useLocale } from './Locale';
export function ReadingShell({ children }: { children: ReactNode }) {
  const { locale, href } = useLocale();
  const router = useRouter();
  return (
    <>
      <Cursor />
      <header className="reading-header">
        <Link
          className="reading-wordmark"
          href="/"
          aria-label="Links Tam — Home"
          onClick={(e) => {
            if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            sessionStorage.removeItem('links-home-return');
            router.push(href('/'));
          }}
        >
          Links Tam
          <span aria-hidden="true" />
        </Link>
        <nav
          className="reading-navigation"
          aria-label={locale === 'en' ? 'Page navigation' : '页面导航'}
        >
          <Link href="/projects">{locale === 'en' ? 'Projects' : '项目'}</Link>
          <Link href="/resume">{locale === 'en' ? 'Resume' : '简历'}</Link>
        </nav>
        <div className="reading-controls">
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </header>
      <main id="main" className="reading-main">
        {children}
      </main>
      <footer className="reading-footer">
        Links Tam / {locale === 'en' ? 'Tan Wenrui' : '谭文睿'} · Technology should adapt to people.
        <span>Based on Sazzad Ali · MIT</span>
      </footer>
    </>
  );
}
export function ReturnToWork() {
  const router = useRouter();
  const { locale, href } = useLocale();
  return (
    <button
      className="reading-button"
      onClick={() => {
        if (history.length > 1 && sessionStorage.getItem('links-home-return')) router.back();
        else router.push(href('/#projects'));
      }}
    >
      {locale === 'en' ? '↖ Back to selected work' : '↖ 返回作品展览'}
    </button>
  );
}
