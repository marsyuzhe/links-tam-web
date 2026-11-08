'use client';
import { useEffect } from 'react';
export function rememberReadingReturn(kind: string, id: string) {
  history.replaceState(
    { ...history.state, readingReturn: { kind, id, y: scrollY, time: Date.now() } },
    '',
  );
}
export function useReadingReturn(kind: string) {
  useEffect(() => {
    const state = history.state?.readingReturn;
    if (state?.kind !== kind || Date.now() - state.time > 7200000) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        window.scrollTo(0, state.y);
        document.getElementById(state.id)?.focus({ preventScroll: true });
      });
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [kind]);
}
