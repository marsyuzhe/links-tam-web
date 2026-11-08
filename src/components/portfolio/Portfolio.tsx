'use client';

import { useCallback, useRef, useState } from 'react';
import { gsap, useGSAP, ScrollSmoother, ScrollTrigger, MOTION_OK } from '@/lib/gsap';
import { readHome, rememberHome } from '@/lib/return-home';
import { finishExperienceRestore } from '@/lib/experience-return';
import { ENABLE_IDENTITY_ATMOSPHERE } from '@/lib/feature-flags';
import { IdentityAtmosphere } from '@/components/links/IdentityAtmosphere';
import { ZoomReflow } from '@/components/links/ZoomReflow';
import { Preloader } from './Preloader';
import { Cursor } from './Cursor';
import { Background } from './Background';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { About } from './About';
import { Projects } from './Projects';
import { Skills } from './Skills';
import { BackToTop, Contact, Footer } from './Contact';

/**
 * Creates ScrollSmoother. It is rendered before every other component, so its layout
 * effect runs first and all later ScrollTriggers (including pins) see the smoothed scroller.
 */
function SmoothScroller({ ready }: { ready: boolean }) {
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const saved = useRef<ReturnType<typeof readHome>>(null);
  useGSAP(() => {
    saved.current = readHome();
    const oldRestoration = history.scrollRestoration;
    const save = () => rememberHome();
    window.addEventListener('pagehide', save);
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const mm = gsap.matchMedia();
    mm.add(`(min-width: 600px) and ${MOTION_OK}`, () => {
      const smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.4, // seconds the content takes to catch up with the scroll position
        effects: true,
        smoothTouch: 0.2, // lighter on touch, so swipes still feel direct
      });
      smoother.paused(!readyRef.current);
      return () => smoother.kill();
    });
    return () => {
      window.removeEventListener('pagehide', save);
      mm.revert();
      history.scrollRestoration = oldRestoration;
    };
  });

  useGSAP(
    () => {
      if (!ready) return;
      ScrollSmoother.get()?.paused(false);
      let id = requestAnimationFrame(() => {
        // Refresh when the curtain starts lifting, then restore against the new Pin geometry.
        id = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          const state = saved.current;
          const hash = location.hash;
          if (hash && document.getElementById(hash.slice(1))) {
            const sm = ScrollSmoother.get();
            if (sm) sm.scrollTo(hash, false, 'top 80px');
            else document.getElementById(hash.slice(1))?.scrollIntoView();
          } else if (state?.y) {
            const smoother = ScrollSmoother.get();
            if (smoother) smoother.scrollTop(state.y);
            else window.scrollTo(0, state.y);
            ScrollTrigger.update();
            if (state.focusTarget) {
              document.getElementById(state.focusTarget)?.focus({ preventScroll: true });
              finishExperienceRestore();
            }
            if (state.project)
              document
                .querySelector<HTMLElement>(`[data-project-slug="${state.project}"] h3 a`)
                ?.focus({ preventScroll: true });
          }
        });
      });
      return () => cancelAnimationFrame(id);
    },
    { dependencies: [ready] },
  );

  return null;
}

export function Portfolio() {
  const [ready, setReady] = useState(false);
  const reveal = useCallback(() => setReady(true), []);

  return (
    <>
      <SmoothScroller ready={ready} />
      <ZoomReflow ready={ready} />
      <Preloader onReveal={reveal} />
      <Cursor />
      <Background />
      {ENABLE_IDENTITY_ATMOSPHERE && <IdentityAtmosphere />}
      <Nav ready={ready} />
      <BackToTop />

      <div id="smooth-wrapper" className="relative z-10">
        <div id="smooth-content">
          <main id="main">
            <Hero ready={ready} />
            <About />
            <Projects />
            <Skills />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
