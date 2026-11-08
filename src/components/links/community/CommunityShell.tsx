'use client';
import type { ReactNode } from 'react';
import { Cursor } from '@/components/portfolio/Cursor';
import { ThemeToggle } from '@/components/portfolio/ThemeToggle';
import { LanguageSwitch, LocaleLink as Link, useLocale } from '../Locale';
export function CommunityShell({ children }: { children: ReactNode }) {
  const { locale } = useLocale(),
    en = locale === 'en';
  return (
    <div className="community-site">
      <Cursor />
      <header className="reading-header community-header">
        <Link href="/community" className="community-wordmark">
          Links <span>Game Worlds</span>
        </Link>
        <nav className="reading-navigation" aria-label={en ? 'Worlds' : '游戏世界'}>
          <Link href="/community/minecraft">Minecraft</Link>
          <Link href="/community/terraria">Terraria</Link>
          <Link href="/community/project-zomboid">Project Zomboid</Link>
        </nav>
        <div className="reading-controls">
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </header>
      <main id="main" className="reading-main">
        {children}
      </main>
      <footer className="community-footer">
        <p>
          Links Game Worlds <span>{en ? 'Explore · Build · Survive' : '探索 · 建造 · 生存'}</span>
        </p>
        <Link href="/" className="reading-button">
          {en ? 'Return to Links Tam official site' : '返回 Links Tam 个人官网'} ↗
        </Link>
      </footer>
    </div>
  );
}
