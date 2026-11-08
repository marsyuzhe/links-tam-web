import { NextResponse } from 'next/server';
import { worlds } from '@/content/worlds';
import { queryStatus } from '@/lib/server-status';
let cache: { at: number; data: Awaited<ReturnType<typeof queryStatus>>[] } | undefined;
let windowStart = 0,
  requests = 0;
export async function GET() {
  const now = Date.now();
  if (now - windowStart > 60000) {
    windowStart = now;
    requests = 0;
  }
  if (++requests > 120)
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  if (!cache || now - cache.at > 10000)
    cache = { at: now, data: await Promise.all(worlds.map((w) => queryStatus(w.id))) };
  return NextResponse.json({ servers: cache.data }, { headers: { 'Cache-Control': 'no-store' } });
}
