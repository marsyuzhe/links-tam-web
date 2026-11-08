'use client';
import { T } from '@/components/links/Locale';

import { profile } from '@/content/profile';
import { LocaleLink as Link } from '@/components/links/Locale';
import { useRef } from 'react';
import { ChevronDown, Download, Github, FileUser, Gamepad2 } from 'lucide-react';
import { gsap, useGSAP, SplitText, MOTION_OK, scrollToTarget } from '@/lib/gsap';
import { roles } from '@/data/portfolio';
import { CvLink } from './CvLink';
import { Magnetic } from './Magnetic';

const socialLinks = [
  { id: 'resume', href: '/resume', label: 'Resume', caption: '个人简历', Icon: FileUser },
  {
    id: 'github',
    href: 'https://github.com/marsyuzhe',
    label: 'GitHub',
    caption: '开源项目',
    Icon: Github,
  },
  { id: 'servers', href: '/community', label: 'Servers', caption: '游戏服务器', Icon: Gamepad2 },
];

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);

  // Everything — including the text splitting — is prepared on mount while the preloader
  // still covers the page. When the curtain lifts, the intro only has to play.
  useGSAP(
    () => {
      gsap.set('.hero-content', { autoAlpha: 1 });
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const greeting = SplitText.create('.hero-greeting', { type: 'chars', mask: 'chars' });
        const sub = SplitText.create('.hero-sub', { type: 'words', mask: 'words' });

        const tl = (intro.current = gsap
          .timeline({ paused: true, defaults: { ease: 'expo.out' } })
          .from(greeting.chars, { yPercent: 120, rotate: 8, stagger: 0.035, duration: 1.2 })
          .from(
            '.hero-name',
            // clearProps: a lingering clip-path breaks background-clip:text in Chromium.
            {
              clipPath: 'inset(0% 100% 0% 0%)',
              duration: 1.4,
              ease: 'expo.inOut',
              clearProps: 'clipPath',
            },
            '-=0.9',
          )
          .from('.hero-role', { autoAlpha: 0, y: 20, duration: 0.8 }, '-=0.6')
          .from(sub.words, { yPercent: 100, stagger: 0.03, duration: 0.9 }, '-=0.6')
          .from('.hero-cta > *', { y: 40, autoAlpha: 0, stagger: 0.1, duration: 0.9 }, '-=0.6')
          .from(
            '.hero-social',
            { scale: 0, autoAlpha: 0, stagger: 0.08, duration: 0.8, ease: 'back.out(2)' },
            '-=0.7',
          )
          .from('.hero-scroll', { autoAlpha: 0, y: -20, duration: 0.8 }, '-=0.4'));

        // Rotating roles, decoded with ScrambleText; starts near the end of the intro.
        const roleTl = gsap.timeline({ paused: true, repeat: -1 });
        tl.call(() => roleTl.play(), undefined, tl.duration() - 1);
        [...roles.slice(1), roles[0]].forEach((role) => {
          roleTl.to({}, { duration: 3.25 }).to('.hero-role-text', {
            duration: 0.48,
            scrambleText: {
              text: role,
              chars: 'upperAndLowerCase',
              speed: 0.5,
              revealDelay: 0,
            },
            ease: 'none',
          });
        });

        // Shimmer across the gradient name.
        gsap.to('.hero-name', {
          backgroundPosition: '200% center',
          duration: 6,
          ease: 'none',
          repeat: -1,
        });

        gsap.to('.hero-scroll svg', {
          y: 10,
          duration: 1,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

        // Scroll-out: content lifts, fades and softens as the hero leaves.
        gsap.to('.hero-content', {
          yPercent: -25,
          autoAlpha: 0,
          scale: 0.94,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
        gsap.to('.hero-marquee', {
          xPercent: -30,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.hero-role-text', { textContent: roles[0] });
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (ready) intro.current?.play();
    },
    { dependencies: [ready] },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative flex items-center justify-center overflow-hidden px-6 pb-20 pt-24 md:min-h-[100svh]"
    >
      <p
        className="hero-marquee pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[18vw] font-black uppercase leading-none text-transparent opacity-[0.06] [-webkit-text-stroke:1px_var(--color-white)]"
        aria-hidden="true"
      >
        Creative Developer · Creative Developer
      </p>

      <div className="hero-content invisible relative z-10 mx-auto max-w-[1600px] w-full text-center">
        <h1 className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
          <span className="hero-greeting block text-sm md:text-base font-mono uppercase tracking-[0.25em] mb-5 align-top [&>div]:align-top">
            Hi, I&apos;m
          </span>{' '}
          <span className="hero-name inline-block text-[clamp(4.5rem,11vw,11rem)] align-top bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-[length:200%_auto] bg-clip-text pb-2 text-transparent">
            Links Tam
          </span>
        </h1>

        <p
          className="hero-role mb-6 h-12 font-mono text-2xl font-bold text-blue-400 md:text-4xl"
          aria-hidden="true"
        >
          <span className="hero-role-text">{roles[0]}</span>
          <span className="ml-1 animate-pulse text-purple-400">_</span>
        </p>

        {/* Scramble characters are visual only; assistive technology gets a stable identity. */}
        <p className="sr-only">Links Tam · Creative Technologist</p>

        <p className="hero-sub mx-auto mb-3 max-w-2xl text-lg text-gray-300 [text-wrap:balance] md:text-2xl">
          <T value={profile.headline} />
        </p>
        <p className="hero-sub mb-12 text-base italic text-gray-500 md:text-lg">
          &ldquo;Technology should adapt to people&rdquo;
        </p>

        <div className="hero-cta mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Magnetic>
            <button
              onClick={() => scrollToTarget('#contact')}
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 font-semibold text-[#fff] shadow-lg shadow-purple-500/20 transition-shadow hover:shadow-purple-500/40"
            >
              <T value="聊聊想法" />
            </button>
          </Magnetic>
          <Magnetic>
            <CvLink className="flex items-center gap-2 rounded-full border border-blue-500/60 px-8 py-4 font-semibold transition-colors hover:bg-blue-500/10">
              <Download className="h-4 w-4" />
              <T value="查看简历" />
            </CvLink>
          </Magnetic>
        </div>

        <nav className="hero-shortcuts flex justify-center gap-8" aria-label="快捷入口">
          {socialLinks.map(({ id, href, label, caption, Icon }) => (
            <Magnetic key={label} strength={0.5}>
              <Link
                id={`dock-key-${id}`}
                href={href}
                target={id === 'github' ? '_blank' : undefined}
                rel={id === 'github' ? 'noopener noreferrer' : undefined}
                aria-label={label}
                className="hero-social group flex flex-col items-center text-center"
              >
                <span className="rounded-full border border-gray-700 p-3 transition-colors group-hover:border-blue-400 group-hover:bg-blue-400/10">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="mt-2 text-[11px] font-medium">{label}</span>
                <span className="mt-1 text-xs text-gray-400">
                  <T value={caption} />
                </span>
              </Link>
            </Magnetic>
          ))}
        </nav>
      </div>

      <button
        onClick={() => scrollToTarget('#about')}
        className="hero-scroll absolute bottom-6 left-1/2 -ml-4 text-gray-400"
        aria-label="Scroll to About"
      >
        <ChevronDown className="h-8 w-8" />
      </button>
    </section>
  );
}
