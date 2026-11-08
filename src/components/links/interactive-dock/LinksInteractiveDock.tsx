'use client';
import { dockKeys } from '@/content/keycaps';
import { KeyDevice } from '../memory-keys/KeyDevice';
export function LinksInteractiveDock() {
  return (
    <nav className="hero-social interactive-dock" aria-label="快捷入口">
      <KeyDevice items={dockKeys} compact />
    </nav>
  );
}
