'use client';
import type { ReactNode } from 'react';
import { Cursor } from '@/components/portfolio/Cursor';
import { ThemeToggle } from '@/components/portfolio/ThemeToggle';
import { LanguageSwitch, LocaleLink as Link, useLocale } from '../Locale';

/** Craft has its own navigation boundary, like Community; portfolio links stay outside it. */
export function CraftShell({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const en = locale === 'en';
  return (
    <div className="craft-site">
      <Cursor />
      <header className="reading-header craft-header">
        <Link href="/craft" className="community-wordmark">
          Links <span>Craft</span>
        </Link>
        <nav className="reading-navigation" aria-label={en ? 'Craft navigation' : 'Craft 导航'}>
          <Link href="/">
            {en ? 'Return to Links Tam official site' : '返回 Links Tam 个人官网'} ↗
          </Link>
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
        Links Tam / Craft
        <span>Based on Sazzad Ali · MIT</span>
      </footer>
    </div>
  );
}
