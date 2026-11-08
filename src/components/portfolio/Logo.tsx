'use client';

import Image from 'next/image';
import { LocaleLink as Link, useLocale } from '@/components/links/Locale';
import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';

const NAME = 'Links Tam';

/**
 * Solid wordmark. Letters rise out of a mask when the preloader lifts; on hover each
 * letter rolls up to reveal a gradient copy underneath, and the accent dot pops.
 */
export function Logo({
  ready,
  onClick,
}: {
  ready: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  const { locale } = useLocale();
  const root = useRef<HTMLAnchorElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ delay: 0.4 })
          .from('.logo-char', { yPercent: 110, stagger: 0.04, duration: 0.9, ease: 'expo.out' })
          .from('.logo-dot', { scale: 0, duration: 0.6, ease: 'back.out(3)' }, '-=0.4');
      });
    },
    { scope: root, dependencies: [ready] },
  );

  const roll = contextSafe((up: boolean) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.to('.logo-roll', {
      yPercent: up ? -100 : 0,
      stagger: { each: 0.025, from: up ? 'start' : 'end' },
      duration: 0.5,
      ease: 'power3.inOut',
      overwrite: true,
    });
    gsap.to('.logo-dot', {
      scale: up ? 1.6 : 1,
      rotate: up ? 180 : 0,
      duration: 0.5,
      ease: 'back.out(3)',
    });
  });

  return (
    <div className="home-brand">
      <a
        ref={root}
        href="#top"
        onClick={onClick}
        onPointerEnter={() => roll(true)}
        onPointerLeave={() => roll(false)}
        onFocus={() => roll(true)}
        onBlur={() => roll(false)}
        aria-label="Links Tam — back to top"
        className="flex items-center gap-1 text-2xl font-bold leading-none tracking-tight md:text-[1.7rem]"
      >
        <span className="flex" aria-hidden="true">
          {NAME.split('').map((char, i) => (
            <span key={i} className="block h-[1em] overflow-hidden leading-none">
              <span className="logo-char block h-[1em]">
                <span className="logo-roll relative block h-[1em]">
                  <span className="block h-[1em]">{char === ' ' ? ' ' : char}</span>
                  <span className="logo-color-copy absolute left-0 top-full block h-[1em] bg-clip-text text-transparent">
                    {char === ' ' ? ' ' : char}
                  </span>
                </span>
              </span>
            </span>
          ))}
        </span>
        <span className="logo-dot mb-[0.1em] inline-block h-2 w-2 self-end rounded-full" />
      </a>
      <Link
        href="/craft"
        className="brand-craft"
        aria-label={locale === 'en' ? 'Discover Craft' : '发现 Craft 制作细节'}
        style={{ visibility: ready ? 'visible' : 'hidden' }}
      >
        <span className="brand-signature" data-brand-signature>
          <Image src="/assets/brand/Links-signature.png" width={500} height={328} alt="" />
        </span>
        <span className="brand-craft-hint">Craft ↗</span>
      </Link>
    </div>
  );
}
