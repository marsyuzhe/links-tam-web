import { NextResponse } from 'next/server';
import {
  RESUME_COOKIE,
  SESSION_SECONDS,
  PRIVATE_HEADERS,
  hasResumeAccess,
  checkResumePassword,
  createResumeSession,
  sameOrigin,
  allowResumeAttempt,
} from '@/lib/server/resume-access';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
function json(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: PRIVATE_HEADERS });
}
export async function GET() {
  return json({ authorized: await hasResumeAccess() });
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'forbidden' }, 403);
  if (!allowResumeAttempt())
    return NextResponse.json(
      { error: 'too_many_attempts' },
      { status: 429, headers: { ...PRIVATE_HEADERS, 'Retry-After': '60' } },
    );
  if (
    !request.headers.get('content-type')?.startsWith('application/json') ||
    Number(request.headers.get('content-length') ?? 0) > 512
  )
    return json({ error: 'invalid_request' }, 400);
  let password: unknown;
  try {
    const text = await request.text();
    if (text.length > 512) return json({ error: 'invalid_request' }, 400);
    password = JSON.parse(text).password;
  } catch {
    return json({ error: 'invalid_request' }, 400);
  }
  if (typeof password !== 'string' || password.length > 128 || password.length === 0)
    return json({ error: 'invalid_password' }, 401);
  try {
    if (!(await checkResumePassword(password))) return json({ error: 'invalid_password' }, 401);
    const response = json({ authorized: true });
    response.cookies.set(RESUME_COOKIE, await createResumeSession(), {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.SITE_MODE === 'production' || new URL(request.url).protocol === 'https:',
      path: '/',
      maxAge: SESSION_SECONDS,
    });
    return response;
  } catch {
    return json({ error: 'unavailable' }, 503);
  }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'forbidden' }, 403);
  const response = json({ authorized: false });
  response.cookies.set(RESUME_COOKIE, '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.SITE_MODE === 'production' || new URL(request.url).protocol === 'https:',
    path: '/',
    maxAge: 0,
  });
  return response;
}
