import 'server-only';
import { readFile } from 'node:fs/promises';
import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import { cookies } from 'next/headers';

type AccessConfig = { salt: string; passwordHash: string; sessionSecret: string };
export const RESUME_COOKIE = 'links_resume_access';
export const SESSION_SECONDS = 2 * 60 * 60;
export const PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
};
async function config(): Promise<AccessConfig> {
  const c = JSON.parse(
    await readFile(path.join(process.cwd(), 'private/resume/access.private.json'), 'utf8'),
  );
  if (
    !/^[a-f0-9]{32}$/.test(c.salt) ||
    !/^[a-f0-9]{128}$/.test(c.passwordHash) ||
    !/^[a-f0-9]{64}$/.test(c.sessionSecret)
  )
    throw Error('Resume access is not configured');
  return c;
}
function digest(secret: string, payload: string) {
  return createHmac('sha256', secret).update(payload).digest('hex');
}
function equal(a: string, b: string) {
  return a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
export async function checkResumePassword(password: string) {
  const c = await config();
  const derived = await new Promise<Buffer>((resolve, reject) =>
    scrypt(password, c.salt, 64, (err, key) => (err ? reject(err) : resolve(key))),
  );
  return equal(derived.toString('hex'), c.passwordHash);
}
export async function createResumeSession() {
  const c = await config(),
    payload = `${Math.floor(Date.now() / 1000) + SESSION_SECONDS}.${randomBytes(16).toString('hex')}`;
  return `${payload}.${digest(c.sessionSecret, payload)}`;
}
export async function hasResumeAccess() {
  const token = (await cookies()).get(RESUME_COOKIE)?.value;
  if (!token || token.length > 180) return false;
  const [expires, nonce, signature, ...extra] = token.split('.');
  if (
    extra.length ||
    !/^\d{10}$/.test(expires) ||
    !/^[a-f0-9]{32}$/.test(nonce ?? '') ||
    !/^[a-f0-9]{64}$/.test(signature ?? '')
  )
    return false;
  const now = Math.floor(Date.now() / 1000),
    expiry = Number(expires);
  if (expiry <= now || expiry > now + SESSION_SECONDS) return false;
  try {
    return equal(signature, digest((await config()).sessionSecret, `${expires}.${nonce}`));
  } catch {
    return false;
  }
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false;
  if (!origin) return true;
  // Next's internal request URL can use localhost while the browser uses 127.0.0.1.
  // Host is the incoming authority; comparing it keeps the port part of the check.
  try {
    const source = new URL(origin);
    return (
      ['http:', 'https:'].includes(source.protocol) &&
      source.host === (request.headers.get('host') ?? new URL(request.url).host)
    );
  } catch {
    return false;
  }
}
// Small single-process personal-site limit, applied before password hashing.
let windowStart = 0,
  attempts = 0;
export function allowResumeAttempt() {
  const now = Date.now();
  if (now - windowStart >= 60000) {
    windowStart = now;
    attempts = 0;
  }
  return ++attempts <= 12;
}
