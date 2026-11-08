'use client';

import Image from 'next/image';
import { useSignatureHandoff } from './useSignatureHandoff';
import { useLocale } from '@/components/links/Locale';
import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, SplitText, MOTION_OK } from '@/lib/gsap';

/**
 * Intro curtain: split-text name reveal, signature flight and a two-layer wipe.
 * Calls `onReveal` as the curtain starts lifting so the hero can animate in underneath.
 */
export function Preloader({ onReveal }: { onReveal: () => void }) {
  const { locale } = useLocale();
  const en = locale === 'en';
  const handoff = useSignatureHandoff();
  const cancelHandoff = handoff.cancel;
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const skip = useRef(() => {});
  const revealed = useRef(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      cancelHandoff();
      onReveal();
      setDone(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, [onReveal, cancelHandoff]);

  useGSAP(
    () => {
      if (done) return;
      const reveal = () => {
        if (revealed.current) return;
        revealed.current = true;
        onReveal();
        try {
          sessionStorage.setItem('links-signature-intro-v1', '1');
        } catch {}
      };
      try {
        const url = new URL(location.href);
        const replay = url.searchParams.get('intro') === 'replay';
        if (sessionStorage.getItem('links-signature-intro-v1') && !replay) {
          reveal();
          setDone(true);
          return;
        }
        if (replay) {
          url.searchParams.delete('intro');
          history.replaceState(history.state, '', url);
        }
      } catch {}
      const mm = gsap.matchMedia();

      mm.add({ motion: MOTION_OK, reduced: '(prefers-reduced-motion: reduce)' }, (ctx) => {
        if (ctx.conditions?.reduced) {
          reveal();
          gsap.to(root.current, { autoAlpha: 0, duration: 0.3, onComplete: () => setDone(true) });
          return;
        }

        const split = SplitText.create('.preloader-name', { type: 'chars', mask: 'chars' });
        // Begin after paint. The intro doesn't wait for below-the-fold media or fonts.
        const tl = gsap
          .timeline({ paused: true, onComplete: () => setDone(true) })
          .from(split.chars, { yPercent: 110, stagger: 0.04, duration: 0.8, ease: 'expo.out' })
          .to('.preloader-bar', { scaleX: 1, duration: 1.35, ease: 'power2.inOut' }, 0)
          .fromTo(
            '.preloader-signature',
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 0.95, ease: 'power2.inOut' },
            0.18,
          )
          .to(
            split.chars,
            { yPercent: -110, stagger: 0.02, duration: 0.5, ease: 'power3.in' },
            1.15,
          )
          .to('.preloader-bar-wrap', { autoAlpha: 0, duration: 0.3 }, 1.2)
          .add(reveal, 1.16)
          .call(
            () => handoff.launch(root.current?.querySelector('.preloader-signature') ?? null),
            undefined,
            1.3,
          )
          .to(
            '.preloader-panel',
            { yPercent: -100, duration: 0.75, ease: 'expo.inOut', stagger: 0.12 },
            1.3,
          );

        skip.current = () => {
          tl.kill();
          handoff.cancel();
          reveal();
          setDone(true);
        };
        let paintFrame = requestAnimationFrame(() => {
          paintFrame = requestAnimationFrame(() => tl.play());
        });

        return () => {
          cancelAnimationFrame(paintFrame);
          skip.current = () => {};
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [done], revertOnUpdate: true },
  );

  useEffect(() => {
    if (done) return;
    const nodes = [
      ...document.querySelectorAll<HTMLElement>('#smooth-wrapper,.site-nav,.skip-link'),
    ];
    const introNode = root.current;
    const saved = nodes.map((el) => el.inert);
    nodes.forEach((el) => {
      el.inert = true;
    });
    root.current?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
    return () => {
      const introHadFocus = introNode?.contains(document.activeElement);
      nodes.forEach((el, i) => {
        el.inert = saved[i];
      });
      if (introHadFocus)
        document.querySelector<HTMLElement>('.home-brand > a')?.focus({ preventScroll: true });
    };
  }, [done]);
  if (done) return null;

  return (
    <div
      ref={root}
      className="signature-intro fixed inset-0 z-[100] pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-label={en ? 'Links introduction' : 'Links 开场'}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          skip.current();
          onReveal();
          setDone(true);
        }
        if (e.key === 'Tab') {
          e.preventDefault();
          root.current?.querySelector<HTMLButtonElement>('button')?.focus();
        }
      }}
    >
      <button
        type="button"
        className="skip-intro absolute right-6 top-6 z-10 pointer-events-auto rounded-full border border-white/30 px-5 py-2 text-sm"
        onClick={() => {
          skip.current();
          onReveal();
          setDone(true);
        }}
      >
        {en ? 'Skip intro ↗' : '跳过开场 ↗'}
      </button>
      <div className="preloader-panel absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500" />
      <div className="preloader-panel absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 pointer-events-auto">
        <p className="preloader-name text-5xl md:text-7xl font-bold tracking-tight">Links Tam</p>
        <div className="preloader-signature" aria-hidden="true">
          <Image src="/assets/brand/Links-signature.png" width={500} height={328} alt="" priority />
        </div>
        <div
          className="preloader-bar-wrap mt-8 h-px w-48 bg-white/10 overflow-hidden"
          aria-hidden="true"
        >
          <div className="preloader-bar h-full w-full origin-left scale-x-0 bg-gradient-to-r from-blue-400 to-purple-400" />
        </div>
      </div>
    </div>
  );
}
