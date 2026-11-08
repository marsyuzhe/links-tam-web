'use client';
import { memoryKeys } from '@/content/keycaps';
import { KeyDevice } from './KeyDevice';
import { LocaleLink as Link, T, useLocale } from '../Locale';
export function LinksMemoryKeys() {
  const { locale } = useLocale();
  return (
    <section
      id="memory-keys"
      className="memory-keys"
      aria-label={locale === 'en' ? 'Career memory keys' : '职业记忆键帽'}
    >
      <p className="memory-invitation">
        <T value="按下，看看我走过的地方。" />
      </p>
      <KeyDevice items={memoryKeys} />
      <Link href="/resume" className="memory-resume">
        <T value="完整个人简历 ↗" />
      </Link>
    </section>
  );
}
