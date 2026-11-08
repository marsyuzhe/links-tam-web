'use client';
import { useEffect, useCallback, type RefObject } from 'react';
import { gsap } from '@/lib/gsap';
export function useResumeMediaDialog(
  selected: string | null,
  dialog: RefObject<HTMLDialogElement | null>,
  trigger: RefObject<HTMLElement | null>,
  clear: () => void,
) {
  // Media owns only the dialog transform; useResumeMotion owns the page ScrollTriggers.
  // Store the real trigger so closing never jumps to the first item after a selection update.
  useEffect(() => {
    const el = dialog.current;
    if (!selected || !el) return;
    el.showModal();
    const from = trigger.current?.getBoundingClientRect(),
      to = el.getBoundingClientRect();
    if (from && !matchMedia('(prefers-reduced-motion: reduce)').matches)
      gsap.fromTo(
        el,
        {
          x: from.x + from.width / 2 - to.x - to.width / 2,
          y: from.y + from.height / 2 - to.y - to.height / 2,
          scaleX: from.width / to.width,
          scaleY: from.height / to.height,
          opacity: 0.2,
        },
        {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          duration: 0.35,
          ease: 'power3.out',
          clearProps: 'all',
        },
      );
    return () => {
      gsap.killTweensOf(el);
    };
  }, [selected, dialog, trigger]);
  return useCallback(() => {
    dialog.current?.close();
    clear();
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  }, [dialog, trigger, clear]);
}
