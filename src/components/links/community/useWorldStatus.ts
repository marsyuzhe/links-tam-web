'use client';
import { useEffect, useRef, useState } from 'react';
import { worlds } from '@/content/worlds';
import { projectStatus, type PublicStatus } from '@/lib/server-status';

/** Abort on unmount and ignore stale responses; a failed query never invents a player count. */
export function useWorldStatus() {
  const [statuses, setStatuses] = useState<PublicStatus[]>(() =>
    worlds.map((world) => projectStatus(world.id, { status: 'planned' })),
  );
  const [isChecking, setIsChecking] = useState(false);
  const controller = useRef<AbortController | null>(null),
    generation = useRef(0);
  useEffect(
    () => () => {
      generation.current++;
      controller.current?.abort();
    },
    [],
  );
  async function refreshServerStatus() {
    if (process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'PAGES_PUBLIC') return;
    controller.current?.abort();
    // Abort is advisory: generation also rejects a response which completed before cancellation.
    const current = ++generation.current,
      request = new AbortController();
    controller.current = request;
    setIsChecking(true);
    const timeout = setTimeout(() => request.abort(), 3000);
    try {
      const response = await fetch('/api/community/status', { signal: request.signal });
      if (!response.ok) throw Error('Status unavailable');
      const data: unknown = await response.json();
      if (!data || typeof data !== 'object' || !('servers' in data) || !Array.isArray(data.servers))
        throw Error('Invalid status');
      const servers = data.servers as PublicStatus[];
      if (
        !worlds.every((world) =>
          servers.some(
            (server) =>
              server?.id === world.id &&
              [
                'planned',
                'not_configured',
                'checking',
                'online',
                'offline',
                'degraded',
                'stale',
              ].includes(server.status),
          ),
        )
      )
        throw Error('Invalid world status');
      if (current === generation.current)
        setStatuses(
          worlds.map((world) => {
            const server = servers.find((server) => server.id === world.id)!;
            return projectStatus(world.id, { ...server, verified: server.status === 'online' });
          }),
        );
    } catch {
      if (current === generation.current)
        setStatuses((previous) =>
          previous.map((status) => ({
            ...status,
            status: status.status === 'online' ? 'stale' : 'degraded',
            playersOnline: null,
            playersMax: null,
            statusReason: 'request_failed',
          })),
        );
    } finally {
      clearTimeout(timeout);
      if (current === generation.current) setIsChecking(false);
    }
  }
  return { statuses, isChecking, refreshServerStatus };
}
