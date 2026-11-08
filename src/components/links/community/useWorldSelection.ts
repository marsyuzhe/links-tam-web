'use client';
import { useEffect, useState } from 'react';
import { worlds, type WorldId } from '@/content/worlds';
/** A direct game route wins over session selection; lane/clipboard feedback never cross worlds. */
export function useWorldSelection(game?: WorldId) {
  const [activeWorldId, setActiveWorldId] = useState<WorldId>(game ?? 'minecraft');
  const [lane, setLane] = useState(0),
    [notice, setNotice] = useState('');
  const choose = (id: WorldId) => {
    setActiveWorldId(id);
    setLane(0);
    setNotice('');
    try {
      sessionStorage.setItem('links-world-selection', id);
    } catch {
      /* Storage is optional. */
    }
  };
  useEffect(() => {
    if (game) {
      setActiveWorldId(game);
      setLane(0);
      return;
    }
    try {
      const saved = sessionStorage.getItem('links-world-selection');
      const world = worlds.find((w) => w.id === saved);
      if (world) setActiveWorldId(world.id);
    } catch {
      /* Sandboxed/private browsing must still show the default world. */
    }
  }, [game]);
  return { activeWorldId, choose, lane, setLane, notice, setNotice };
}
