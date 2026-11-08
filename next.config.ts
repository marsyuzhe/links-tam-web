import type { NextConfig } from 'next';
import { siteUrl } from './src/lib/site-config';
siteUrl(); // Fail before building an explicitly configured release with a missing/invalid origin.
const development = process.env.NODE_ENV === 'development';
const config: NextConfig = {
  poweredByHeader: false,
  outputFileTracingExcludes: { '/*': ['./private/**/*'] },
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: '', NEXT_PUBLIC_DEPLOY_TARGET: 'FULL_NODE' },
  experimental: { cpus: 2 },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline'${development ? " 'unsafe-eval'" : ''}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'${development ? ' ws://127.0.0.1:3006 ws://localhost:3006' : ''}; worker-src 'self' blob:; frame-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`,
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          // Only opt in after HTTPS is verified. Do not pin subdomains owned by other services.
          ...(process.env.ENABLE_HSTS === '1'
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000' }]
            : []),
        ],
      },
      {
        // The official PDF is intentionally framed by our CV reader. Keep other pages
        // unframeable, but permit this authenticated endpoint only to same-origin parents.
        source: '/api/resume/file',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; frame-ancestors 'self'; base-uri 'none'; object-src 'none'",
          },
        ],
      },
    ];
  },
};
export default config;
