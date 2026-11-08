'use client';

import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';
// Original wire fragments: small echoes of the site's keys, code and creative tools.
const FLOATERS = [
  'M9 7 4 12l5 5m6-10 5 5-5 5M13 4l-2 16',
  'M4 8h7v8h9M4 8V4h4m12 12v4h-4M11 8h9v4',
  'm12 3 9 9-9 9-9-9 9-9Zm0 0v18M3 12h18',
  'M6 4h9l4 4v12H6V4Zm9 0v5h4M9 13h7m-7 4h5',
  'M4 15c3-12 13 12 16-5M4 9c3 12 13-12 16 5',
  'M5 5h14v14H5zM5 10h14m-9 0v9',
  'M4 12h5l3-7 3 14 2-7h3',
  'M5 8h5V3m4 18v-5h5M5 8l14 8M10 3l4 18',
];

/**
 * Fixed background: drifting gradient orbs that react to the pointer, a subtle grid and
 * original wire fragments rising with scoped GSAP tweens.
 */
export function Background() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // Rising logos — endless loops. fromTo pins the start below the viewport on every
        // repeat, each lap picks a new column/spin, and each loop starts at a random point
        // so the screen is populated from the first frame instead of waiting for delays.
        gsap.utils.toArray<HTMLElement>('.floater').forEach((el) => {
          const newLane = () =>
            gsap.set(el, {
              left: `${gsap.utils.random(0, 95)}%`,
              scale: gsap.utils.random(0.6, 1.3),
            });
          newLane();
          const rise = gsap.fromTo(
            el,
            { y: () => window.innerHeight + 80 },
            {
              y: -120,
              rotation: 'random(-180, 180)',
              duration: gsap.utils.random(18, 32),
              ease: 'none',
              repeat: -1,
              repeatRefresh: true,
              onRepeat: newLane,
            },
          );
          rise.time(gsap.utils.random(0, rise.duration()));
          gsap.to(el, {
            x: 'random(-60, 60)',
            duration: 'random(3, 6)',
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
          });
        });

        // Orbs wander on their own…
        gsap.utils.toArray<HTMLElement>('.orb').forEach((orb) => {
          gsap.to(orb, {
            xPercent: 'random(-40, 40)',
            yPercent: 'random(-40, 40)',
            duration: 'random(8, 14)',
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
          });
        });

        // …and lean towards the pointer.
        const layer = root.current!.querySelector('.orb-layer');
        const toX = gsap.quickTo(layer, 'x', { duration: 2, ease: 'power2' });
        const toY = gsap.quickTo(layer, 'y', { duration: 2, ease: 'power2' });
        const onMove = (e: PointerEvent) => {
          toX((e.clientX / window.innerWidth - 0.5) * 80);
          toY((e.clientY / window.innerHeight - 0.5) * 80);
        };
        window.addEventListener('pointermove', onMove);
        const visibility = () => {
          root.current?.classList.toggle('ambient-suspended', document.hidden);
          const pieces = root.current?.querySelectorAll('.floater,.orb,.orb-layer');
          if (pieces) gsap.getTweensOf(pieces).forEach((t) => t.paused(document.hidden));
        };
        document.addEventListener('visibilitychange', visibility);
        return () => {
          window.removeEventListener('pointermove', onMove);
          document.removeEventListener('visibilitychange', visibility);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="ambient-field fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="orb-layer absolute inset-0">
        {/* Soft glows drawn with radial gradients: same look as a heavy blur filter, but
            they composite as plain textures instead of re-running the blur every frame. */}
        <div className="orb ambient-orb ambient-orb-silver absolute left-[-5%] top-[-12%] h-[75vmax] w-[75vmax] rounded-full will-change-transform" />
        <div className="orb ambient-orb ambient-orb-pearl absolute right-[-20%] top-[10%] h-[70vmax] w-[70vmax] rounded-full will-change-transform" />
        <div className="orb ambient-orb ambient-orb-smoke absolute bottom-[-35%] left-[15%] h-[65vmax] w-[65vmax] rounded-full will-change-transform" />
      </div>
      <div className="bg-grid ambient-grid absolute -inset-[72px]" />
      {FLOATERS.map((path, index) => (
        <svg
          key={path}
          className="floater ambient-fragment absolute top-0"
          width={index % 3 === 0 ? 35 : 25}
          height={index % 3 === 0 ? 35 : 25}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: 'translateY(110vh)' }}
        >
          <path d={path} />
        </svg>
      ))}
    </div>
  );
}
