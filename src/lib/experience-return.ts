'use client';
import { ScrollSmoother } from '@/lib/gsap';
export type ExperienceReturn = {
  experienceId: string;
  y: number;
  focusTarget: string;
  sourceRoute: string;
  time: number;
};
export const EXPERIENCE_PENDING = 'links-experience-navigation';
const RETURN_STATE = 'links-experience-return';
const RESTORE = 'links-experience-restore';
export function rememberExperience(id: string) {
  const state: ExperienceReturn = {
    experienceId: id,
    y: ScrollSmoother.get()?.scrollTop() ?? scrollY,
    focusTarget: `memory-key-${id}`,
    sourceRoute: location.pathname + location.search,
    time: Date.now(),
  };
  try {
    history.replaceState({ ...history.state, linksMemory: state }, '');
    sessionStorage.setItem(EXPERIENCE_PENDING, JSON.stringify(state));
    sessionStorage.setItem(RETURN_STATE, JSON.stringify(state));
  } catch {}
  return state;
}
export function requestExperienceRestore() {
  try {
    sessionStorage.setItem(RESTORE, '1');
  } catch {}
}
export function finishExperienceRestore() {
  try {
    sessionStorage.removeItem(RESTORE);
  } catch {}
}
export function readExperienceReturn(): ExperienceReturn | null {
  try {
    const own = history.state?.linksMemory;
    if (own) return own;
    if (sessionStorage.getItem(RESTORE) === '1') {
      const saved = JSON.parse(sessionStorage.getItem(RETURN_STATE) || 'null');
      if (saved && Date.now() - saved.time < 7200000) return saved;
    }
    return null;
  } catch {
    return null;
  }
}
