'use client';
import Image from 'next/image';
import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';
export function IdentityAtmosphere() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          root.current,
          { yPercent: 5, scale: 1, opacity: () => (window.innerWidth < 760 ? 0.18 : 0.34) },
          {
            yPercent: -14,
            scale: 0.85,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: document.getElementById('about'),
              start: 'top bottom',
              end: 'top 20%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className="identity-atmosphere" aria-hidden="true">
      <Image src="/assets/links-character.webp" alt="" width={1000} height={1500} priority />
    </div>
  );
}
