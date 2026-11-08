import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { hasResumeAccess, PRIVATE_HEADERS } from '@/lib/server/resume-access';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
async function serve(request: Request, head = false) {
  if (!(await hasResumeAccess()))
    return Response.json({ error: 'password_required' }, { status: 401, headers: PRIVATE_HEADERS });
  let bytes: Buffer;
  try {
    bytes = await readFile(path.join(process.cwd(), 'private/resume/official.pdf'));
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503, headers: PRIVATE_HEADERS });
  }
  const download = new URL(request.url).searchParams.get('download') === '1';
  const headers: Record<string, string> = {
    ...PRIVATE_HEADERS,
    'Content-Type': 'application/pdf',
    'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="Links-Tam-Official-Resume.pdf"; filename*=UTF-8''${encodeURIComponent('谭文睿_Links_个人简历_最终更新版.pdf')}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': String(bytes.length),
  };
  let start = 0,
    end = bytes.length - 1,
    status = 200;
  const range = request.headers.get('range');
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!m || (!m[1] && !m[2]))
      return new Response(null, {
        status: 416,
        headers: { ...headers, 'Content-Range': `bytes */${bytes.length}`, 'Content-Length': '0' },
      });
    if (!m[1]) start = Math.max(0, bytes.length - Number(m[2]));
    else {
      start = Number(m[1]);
      if (m[2]) end = Math.min(end, Number(m[2]));
    }
    if (
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(end) ||
      start > end ||
      start >= bytes.length
    )
      return new Response(null, {
        status: 416,
        headers: { ...headers, 'Content-Range': `bytes */${bytes.length}`, 'Content-Length': '0' },
      });
    status = 206;
    headers['Content-Range'] = `bytes ${start}-${end}/${bytes.length}`;
    headers['Content-Length'] = String(end - start + 1);
  }
  return new Response(head ? null : new Uint8Array(bytes.subarray(start, end + 1)), {
    status,
    headers,
  });
}
export async function GET(request: Request) {
  return serve(request);
}
export async function HEAD(request: Request) {
  return serve(request, true);
}
