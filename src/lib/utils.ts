import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Prefix a /public asset path with the deploy base path (needed for GitHub Pages). */
export function asset(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return base && !path.startsWith(base + '/') ? `${base}${path}` : path;
}
