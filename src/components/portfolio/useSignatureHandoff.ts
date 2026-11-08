'use client';
import { useCallback, useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

/** The proxy lives above the curtain. It owns its geometry; the real brand never moves. */
export function useSignatureHandoff() {
  const flight = useRef<HTMLElement | null>(null),
    destination = useRef<HTMLElement | null>(null);
  const cancel = useCallback(() => {
    if (flight.current) {
      gsap.killTweensOf(flight.current);
      flight.current.remove();
      flight.current = null;
    }
    if (destination.current) destination.current.style.removeProperty('opacity');
  }, []);
  useEffect(() => cancel, [cancel]);
  useEffect(() => {
    // A resize/font reflow invalidates the measured endpoint; reveal the real link rather
    // than flying to an obsolete rectangle. The proxy never owns navigation or focus.
    const hide = () => {
      if (document.hidden) cancel();
    };
    window.addEventListener('resize', cancel);
    document.addEventListener('visibilitychange', hide);
    return () => {
      window.removeEventListener('resize', cancel);
      document.removeEventListener('visibilitychange', hide);
    };
  }, [cancel]);
  const launch = useCallback(
    (source: HTMLElement | null) => {
      cancel();
      const target = document.querySelector<HTMLElement>('[data-brand-signature]');
      const sourceImage = source?.querySelector('img');
      if (
        !source ||
        !target ||
        !sourceImage?.complete ||
        !sourceImage.naturalWidth ||
        matchMedia('(prefers-reduced-motion: reduce)').matches
      )
        return;
      const start = source.getBoundingClientRect(),
        end = target.getBoundingClientRect();
      const proxy = document.createElement('div');
      proxy.className = 'signature-flight';
      proxy.setAttribute('aria-hidden', 'true');
      if (!start.width || !end.width) return;
      const image = sourceImage.cloneNode() as HTMLImageElement;
      image.removeAttribute('fetchpriority');
      image.alt = '';
      proxy.append(image);
      // The curtain and masthead use the same crop. Transfer visibility in one frame.
      source.style.visibility = 'hidden';
      target.style.opacity = '0';
      document.body.append(proxy);
      flight.current = proxy;
      destination.current = target;
      gsap.fromTo(
        proxy,
        { left: start.left, top: start.top, width: start.width, height: start.height },
        {
          x: end.left - start.left,
          y: end.top - start.top,
          scale: end.width / start.width,
          transformOrigin: 'top left',
          duration: 0.62,
          ease: 'power3.inOut',
          onComplete: cancel,
        },
      );
    },
    [cancel],
  );
  return { launch, cancel };
}
