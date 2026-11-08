'use client';
import type { RefObject } from 'react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';
/** Scoped context owns all resume ScrollTriggers; media-dialog transforms are separate. */
export function useResumeMotion(root: RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '.resume-opening h1',
          { clipPath: 'inset(0 0 100% 0)', y: 20 },
          { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 0.8, clearProps: 'all' },
        );
        gsap.utils.toArray<HTMLElement>('.evidence-project').forEach((el, i) =>
          gsap.from(el, {
            y: 45,
            rotation: i % 2 ? 0.8 : -0.8,
            transformOrigin: 'center bottom',
            duration: 0.8,
            scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 65%', scrub: 0.5 },
            clearProps: 'all',
          }),
        );
        gsap.utils.toArray<HTMLElement>('.resume-reveal').forEach((el) =>
          gsap.from(el, {
            y: 25,
            opacity: 0,
            duration: 0.7,
            scrollTrigger: { trigger: el, start: 'top 93%', once: true },
            clearProps: 'all',
          }),
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );
}
