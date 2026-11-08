export type Status =
  | 'planned'
  | 'not_configured'
  | 'checking'
  | 'online'
  | 'offline'
  | 'degraded'
  | 'stale';
export type PublicStatus = {
  id: string;
  status: Status;
  statusReason: string;
  version: string | null;
  modloader: string | null;
  playersOnline: number | null;
  playersMax: number | null;
  checkedAt: string | null;
  staleAfter: number;
  serverAddress: string | null;
  publicJoinEnabled: boolean;
};
export type Adapter = (
  signal: AbortSignal,
) => Promise<Partial<PublicStatus> & { verified?: boolean }>;
export function projectStatus(
  id: string,
  data: Partial<PublicStatus> & { verified?: boolean },
  now = Date.now(),
): PublicStatus {
  let status = data.status ?? 'not_configured';
  if (status === 'online' && !data.verified) status = 'degraded';
  if (data.checkedAt && now - Date.parse(data.checkedAt) > (data.staleAfter ?? 60000))
    status = 'stale';
  const confirmed = data.verified === true && status === 'online';
  return {
    id,
    status,
    statusReason: data.statusReason ?? 'no_public_source',
    version: data.version ?? null,
    modloader: data.modloader ?? null,
    playersOnline:
      confirmed && Number.isInteger(data.playersOnline) && data.playersOnline! >= 0
        ? data.playersOnline!
        : null,
    playersMax:
      confirmed && Number.isInteger(data.playersMax) && data.playersMax! >= 0
        ? data.playersMax!
        : null,
    checkedAt: data.checkedAt ?? null,
    staleAfter: data.staleAfter ?? 60000,
    serverAddress: data.publicJoinEnabled && data.verified ? (data.serverAddress ?? null) : null,
    publicJoinEnabled: !!(data.publicJoinEnabled && data.verified && data.serverAddress),
  };
}
export async function queryStatus(
  id: string,
  adapter?: Adapter,
  timeout = 2500,
): Promise<PublicStatus> {
  if (!adapter) return projectStatus(id, { status: 'planned' });
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return projectStatus(
      id,
      await Promise.race([
        adapter(controller.signal),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => {
            controller.abort();
            reject(new Error('timeout'));
          }, timeout);
        }),
      ]),
    );
  } catch {
    return projectStatus(id, { status: 'degraded', statusReason: 'query_failed' });
  } finally {
    clearTimeout(timer);
  }
}
