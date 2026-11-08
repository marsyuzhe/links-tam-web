'use client';
import { gsap } from '@/lib/gsap';
import type { KeyStyle } from '@/content/keycaps';
export function startExperienceTransition(
  rect: DOMRect,
  style: KeyStyle,
  targetSelector = '[data-experience-anchor]',
) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelector('.experience-flight')?.remove();
  const proxy = document.createElement('div');
  proxy.className = `experience-flight key-look key-${style}`;
  proxy.setAttribute('aria-hidden', 'true');
  const image = document.createElement('img');
  image.src = `/assets/keycaps/${style}.svg`;
  image.alt = '';
  proxy.append(image);
  document.body.append(proxy);
  Object.assign(proxy.style, {
    left: rect.left + 'px',
    top: rect.top + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px',
  });
  gsap.to(proxy, {
    scale: 0.94,
    duration: 0.09,
    onComplete: () => {
      let attempts = 0;
      const arrive = () => {
        const target = document.querySelector<HTMLElement>(targetSelector);
        const destination = target?.getBoundingClientRect();
        const waiting =
          !destination ||
          (targetSelector.startsWith('#memory') &&
            (destination.top < 0 || destination.bottom > innerHeight));
        if (waiting && attempts++ < 90) {
          requestAnimationFrame(arrive);
          return;
        }
        gsap.to(proxy, {
          left: destination?.left ?? innerWidth * 0.7,
          top: destination?.top ?? 140,
          width: destination?.width ?? 160,
          height: destination?.height ?? 160,
          scale: 1,
          rotate: 0,
          duration: 0.34,
          ease: 'power3.inOut',
          onComplete: () => {
            gsap.to(proxy, { opacity: 0, duration: 0.13, onComplete: () => proxy.remove() });
          },
        });
      };
      arrive();
    },
  });
  setTimeout(() => proxy.remove(), 2500);
}
