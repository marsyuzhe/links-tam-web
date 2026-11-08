'use client';
import type { ReactNode } from 'react';
import { useLocale } from '../Locale';

export function HowItWorks({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  return (
    <details className="craft-how">
      <summary>
        {locale === 'en' ? 'How it works' : '实现方式'} <span aria-hidden="true">+</span>
      </summary>
      <div>{children}</div>
    </details>
  );
}
