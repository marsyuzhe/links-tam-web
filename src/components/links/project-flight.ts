'use client';

import { gsap } from '@/lib/gsap';

let pending: { slug: string; image: HTMLImageElement; clear: () => void } | undefined;

export function startProjectFlight(event: React.MouseEvent, slug: string) {
  if (
    event.button ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  )
    return;
  const source = event.currentTarget
    .closest('article')
    ?.querySelector<HTMLImageElement>('.project-real-preview, .archive-preview img');
  if (!source?.complete || !source.naturalWidth || Number(getComputedStyle(source).opacity) < 0.5)
    return;
  const r = source.getBoundingClientRect();
  if (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) return;
  pending?.clear();
  const image = source.cloneNode() as HTMLImageElement;
  image.className = 'project-flight';
  image.alt = '';
  image.setAttribute('aria-hidden', 'true');
  Object.assign(image.style, {
    left: `${r.left}px`,
    top: `${r.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
  });
  document.body.append(image);
  const clear = () => {
    clearTimeout(expiry);
    window.removeEventListener('resize', clear);
    gsap.killTweensOf(image);
    image.remove();
    if (pending?.image === image) pending = undefined;
  };
  const expiry = setTimeout(clear, 1600);
  window.addEventListener('resize', clear, { once: true });
  pending = { slug, image, clear };
}

export function finishProjectFlight(slug: string, target: HTMLImageElement) {
  const flight = pending;
  if (!flight || flight.slug !== slug) return;
  // Next commits the destination before measuring. Only bridge two views of the same image.
  if (flight.image.src !== target.src) {
    flight.clear();
    return;
  }
  const r = target.getBoundingClientRect();
  gsap.to(flight.image, {
    left: r.left,
    top: r.top,
    width: r.width,
    height: r.height,
    opacity: 0.92,
    duration: 0.46,
    ease: 'power3.inOut',
    onComplete: flight.clear,
  });
  return flight.clear;
}
