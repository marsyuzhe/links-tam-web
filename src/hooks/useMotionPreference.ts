'use client';
import { useEffect, useState } from 'react';

export function useMotionPreference() {
  // Conservative SSR value prevents a first-frame animation for reduced-motion users.
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}
