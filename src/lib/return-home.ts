'use client';
import { ScrollSmoother } from '@/lib/gsap';
import { readExperienceReturn } from '@/lib/experience-return';
export const HOME_KEY = 'links-home-return';
export function rememberHome(project?: string) {
  try {
    const y = ScrollSmoother.get()?.scrollTop() ?? scrollY;
    sessionStorage.setItem(HOME_KEY, JSON.stringify({ y, project }));
    history.replaceState(
      { ...history.state, linksHome: { y, project }, ...(project ? { linksMemory: null } : {}) },
      '',
    );
  } catch {}
}
export function readHome() {
  try {
    const memory = readExperienceReturn();
    if (memory) return { y: memory.y, focusTarget: memory.focusTarget };
    return JSON.parse(sessionStorage.getItem(HOME_KEY) || 'null') as {
      y: number;
      project?: string;
      focusTarget?: string;
    } | null;
  } catch {
    return null;
  }
}
