// Compatibility adapter; current and legacy routes share one world registry.
import { worlds } from '@/content/worlds';
export const games = worlds.map((w) => ({
  slug: w.id,
  name: w.name,
  intro: w.intro[0],
  mods: w.lanes.map((l) => l.title[0]).join(' / '),
  theme: w.title[1],
  color: w.accent,
}));
export type ServerStatus = {
  connected: boolean;
  online: number | null;
  version: string | null;
  updatedAt: string | null;
};
export async function getServerStatus(): Promise<ServerStatus> {
  return { connected: false, online: null, version: null, updatedAt: null };
}
