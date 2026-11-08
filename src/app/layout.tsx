import { profile } from '@/content/profile';
import { siteUrl } from '@/lib/site-config';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { themeInitScript } from '@/lib/theme';
import './globals.css';
import '@/styles/craft-refinement.css';
import '@/styles/tokens.css';
import '@/components/links/signature-polish.css';
import '@/components/links/rebuild/rebuild.css';
import '@/components/links/memory-keys/memory-keys.css';
import '@/components/links/atmosphere.css';
import '@/styles/v11-polish.css';
import '@/styles/v12-layout.css';
import { LocaleProvider, SkipLink } from '@/components/links/Locale';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: 'Links Tam — Creative Technologist',
  description: profile.short,
  robots: { index: false, follow: false },
  icons: { icon: '/assets/links-mark.svg' },
  openGraph: {
    title: 'Links Tam',
    description: 'Technology should adapt to people.',
    images: ['/assets/og.svg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the head script may set data-theme before React hydrates.
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <noscript>
          <style>
            {
              '[aria-label="Links 开场"]{display:none!important}.hero-content,.site-nav{visibility:visible!important;opacity:1!important}'
            }
          </style>
        </noscript>
        <LocaleProvider>
          <SkipLink />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
