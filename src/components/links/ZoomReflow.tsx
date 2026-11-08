'use client';

import { useEffect } from 'react';
import { gsap, ScrollSmoother, ScrollTrigger } from '@/lib/gsap';

type Place = {
  selector: string;
  ratio: number;
  pin?: { selector: string; progress: number; project?: string; dpr: number };
};
const anchors = [
  '#memory-keys',
  '.work-bridge',
  '.about-copy',
  '.creator-study',
  '.process',
  '#skills',
  '#contact',
  '#top',
  '#projects',
  '#about',
];

/** Preserve the reading place when native browser zoom changes pin geometry.
 * Uses the existing Smoother; it never creates a second scroller or edits a timeline.
 */
export function ZoomReflow({ ready }: { ready: boolean }) {
  useEffect(() => {
    if (!ready) return;
    let dpr = devicePixelRatio,
      viewportWidth = innerWidth,
      viewportHeight = innerHeight,
      place: Place | null = null,
      zoomAnchor: Place | null = null,
      locked = false,
      generation = 0;
    let frame = 0,
      timer: ReturnType<typeof setTimeout> | undefined,
      settle: ReturnType<typeof setTimeout> | undefined;
    const capture = () => {
      // A zoom-related scroll event can precede resize. Keep the last pre-zoom sample.
      if (locked || devicePixelRatio !== dpr) return;
      const y = ScrollSmoother.get()?.scrollTop() ?? scrollY;
      const pin = ScrollTrigger.getAll().find(
        (t) =>
          t.pin && t.trigger?.matches('.about-scene,.projects-pin') && y > t.start && y < t.end,
      );
      if (pin) {
        const projects = pin.trigger!.matches('.projects-pin'),
          progress = (y - pin.start) / (pin.end - pin.start);
        const cards = [...document.querySelectorAll<HTMLElement>('.project-card')];
        const centeredCard = projects
          ? cards.reduce<HTMLElement | undefined>((best, card) => {
              const distance = (el: HTMLElement) => {
                const rect = el.getBoundingClientRect();
                return Math.abs(rect.left + rect.width / 2 - innerWidth / 2);
              };
              return !best || distance(card) < distance(best) ? card : best;
            }, undefined)
          : undefined;
        place = {
          selector: projects ? '#projects' : '#about',
          ratio: 0.12,
          pin: {
            selector: projects ? '.projects-pin' : '.about-scene',
            progress,
            project: centeredCard?.dataset.projectSlug,
            dpr,
          },
        };
        return;
      }
      const visible = anchors
        .map((selector) => ({ selector, el: document.querySelector<HTMLElement>(selector) }))
        .filter((v) => v.el && v.el.getBoundingClientRect().height > 0);
      const hit = visible.find((v) => {
        const r = v.el!.getBoundingClientRect();
        return r.top < innerHeight * 0.7 && r.bottom > innerHeight * 0.25;
      });
      if (hit) {
        const r = hit.el!.getBoundingClientRect();
        place = { selector: hit.selector, ratio: r.top / innerHeight };
      }
    };
    const sample = () => {
      if (locked) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(capture);
      clearTimeout(settle);
      settle = setTimeout(capture, 1600);
    };
    const restore = (saved: Place) => {
      const smoother = ScrollSmoother.get();
      const pin =
        saved.pin &&
        ScrollTrigger.getAll().find(
          (t) => t.pin && t.end - t.start > 2 && t.trigger?.matches(saved.pin!.selector),
        );
      const project = saved.pin?.project
        ? document.querySelector<HTMLElement>(`[data-project-slug="${saved.pin.project}"]`)
        : null;
      if (pin && saved.pin) {
        let distance = (pin.end - pin.start) * saved.pin.progress;
        const track = project?.closest<HTMLElement>('.projects-track');
        if (project && track && Math.abs(saved.pin.dpr - devicePixelRatio) > 0.001) {
          const origin = track.getBoundingClientRect().left - Number(gsap.getProperty(track, 'x'));
          // On a different viewport keep the same card in view. At the original zoom
          // restore the precise scroll fraction rather than snapping to a card center.
          distance = gsap.utils.clamp(
            0,
            pin.end - pin.start,
            origin + project.offsetLeft + project.offsetWidth / 2 - innerWidth / 2,
          );
        }
        const y = pin.start + distance;
        if (smoother) smoother.scrollTop(y);
        else window.scrollTo(0, y);
      } else {
        const el = project ?? document.querySelector<HTMLElement>(saved.selector);
        if (el) {
          const offset = Math.max(85, Math.min(innerHeight * 0.65, saved.ratio * innerHeight));
          if (smoother) smoother.scrollTo(el, false, `top ${offset}px`);
          else window.scrollTo(0, scrollY + el.getBoundingClientRect().top - offset);
        }
      }
      ScrollTrigger.update();
    };
    const resize = () => {
      if (
        Math.abs(devicePixelRatio - dpr) < 0.001 &&
        innerWidth === viewportWidth &&
        innerHeight === viewportHeight
      )
        return;
      dpr = devicePixelRatio;
      viewportWidth = innerWidth;
      viewportHeight = innerHeight;
      // Keep the desktop Pin fraction across several zoom steps, including a temporary
      // switch to the stacked layout. Actual user input starts a new reading anchor.
      const saved = (zoomAnchor ??= place);
      locked = true;
      const task = ++generation;
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      // Native zoom changes both DPR and the CSS viewport. Fluid Hero height also changes
      // upstream pin starts, so restore relative progress only after matchMedia + refresh.
      // Keep the input-cancel path: restoration must never fight a fresh wheel/touch gesture.
      timer = setTimeout(() => {
        if (task !== generation) return;
        ScrollTrigger.refresh();
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => {
            if (task !== generation) return;
            if (saved) restore(saved);
            locked = false;
            capture();
          });
        });
      }, 350);
    };
    const cancel = () => {
      zoomAnchor = null;
      if (!locked) return;
      generation++;
      locked = false;
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      capture();
    };
    const key = (e: KeyboardEvent) => {
      if (
        !e.ctrlKey &&
        !e.metaKey &&
        ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)
      )
        cancel();
    };
    capture();
    sample();
    window.addEventListener('scroll', sample, { passive: true });
    window.addEventListener('resize', resize);
    window.visualViewport?.addEventListener('resize', resize);
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('pointerdown', cancel, { passive: true });
    window.addEventListener('keydown', key);
    ScrollTrigger.addEventListener('scrollEnd', capture);
    return () => {
      generation++;
      clearTimeout(timer);
      clearTimeout(settle);
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', sample);
      window.removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('resize', resize);
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('pointerdown', cancel);
      window.removeEventListener('keydown', key);
      ScrollTrigger.removeEventListener('scrollEnd', capture);
    };
  }, [ready]);
  return null;
}
