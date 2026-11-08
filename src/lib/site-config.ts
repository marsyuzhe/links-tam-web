/** Build-time configuration: local review stays usable; an explicit release cannot use localhost. */
export function siteUrl(env: NodeJS.ProcessEnv = process.env): URL {
  const release = env.SITE_MODE === 'production';
  if (!env.SITE_URL) {
    if (release) throw new Error('SITE_URL is required when SITE_MODE=production');
    return new URL('http://127.0.0.1:3006');
  }
  const url = new URL(env.SITE_URL);
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== '/'
  )
    throw new Error(
      'SITE_URL must be an HTTP(S) origin without credentials, path, query or fragment',
    );
  if (
    release &&
    (url.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))
  )
    throw new Error('Production SITE_URL requires a public HTTPS origin');
  return url;
}
