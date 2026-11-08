'use client';
import { T, useLocale } from '@/components/links/Locale';

import { LocaleLink as Link } from '@/components/links/Locale';
import { useRef } from 'react';
import { ArrowUp, Mail } from 'lucide-react';
import { gsap, useGSAP, SplitText, ScrollTrigger, MOTION_OK, scrollToTarget } from '@/lib/gsap';

import { Magnetic } from './Magnetic';

export function Contact() {
  const { href } = useLocale();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const title = SplitText.create('.contact-title', { type: 'chars', mask: 'chars' });

        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: 'top 65%' } })
          .from(title.chars, {
            yPercent: 120,
            rotate: 10,
            stagger: { each: 0.035, from: 'center' },
            duration: 1.1,
            ease: 'expo.out',
          })
          .from('.contact-underline', { drawSVG: '0%', duration: 1.4, ease: 'power2.inOut' }, 0.5)
          .from('.contact-copy > *', { y: 30, autoAlpha: 0, stagger: 0.12, duration: 1 }, 0.4)
          .from('.contact-cta', { y: 50, autoAlpha: 0, duration: 1.1, ease: 'expo.out' }, 0.7);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contact" className="relative px-6 py-10 md:py-14">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-purple-400">
          <T value="联系" />
        </p>
        <div className="relative mb-12 inline-block">
          <h2 className="contact-title text-5xl font-bold tracking-tight md:text-8xl">
            Let&apos;s Connect
          </h2>
          <svg
            className="absolute -bottom-4 left-0 w-full"
            viewBox="0 0 400 20"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="underline-grad" x1="0" x2="1">
                <stop offset="0%" stopColor="#b4d4e6" />
                <stop offset="50%" stopColor="#b7d4e4" />
                <stop offset="100%" stopColor="#c29a80" />
              </linearGradient>
            </defs>
            <path
              className="contact-underline"
              d="M2 14 C 60 4, 120 18, 200 10 S 340 4, 398 12"
              stroke="url(#underline-grad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="contact-copy space-y-6 text-lg leading-relaxed text-gray-300 md:text-xl">
          <p>
            <T value="让技术适应人，而不是让人适应工具。" />
          </p>
          <p className="text-gray-400">
            <T value="这里展示我的软件、AI 工作流与数字创作实践。欢迎在 GitHub 查看我的公开项目。" />
          </p>
        </div>

        <div className="contact-cta mt-14">
          <EnquiryForm />
          <p className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm leading-none text-gray-500">
            <span>
              <T value="联系方式" />
            </span>
            <a
              href={href('/resume')}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900 px-4 py-2.5 leading-none text-gray-200 transition-colors hover:border-purple-400/60 hover:text-purple-400"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <T value="正式简历" />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function EnquiryForm() {
  const { href } = useLocale();
  return (
    <div className="flex flex-wrap justify-center gap-5">
      <Magnetic>
        <a
          href="https://github.com/marsyuzhe"
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full bg-white px-9 py-4 font-semibold text-black"
        >
          <T value="在 GitHub 查看作品 ↗" />
        </a>
      </Magnetic>
      <a
        href={href('/resume')}
        className="inline-flex rounded-full border border-white/25 px-9 py-4 font-semibold"
      >
        <T value="查看完整经历 ↗" />
      </a>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
        <p className="text-sm text-gray-400">
          <T value="© 2026 Links Tam / 谭文睿" />
        </p>
        <div className="flex flex-wrap gap-5 text-sm text-gray-400">
          <a href="https://github.com/marsyuzhe" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <Link href="/resume">Resume</Link>
          <Link href="/community">Community</Link>
          <a
            href="https://github.com/ali-sazzad/sazzadali-portfolio"
            rel="noreferrer"
            target="_blank"
          >
            Based on Sazzad Ali · MIT ↗
          </a>
        </div>
      </div>
    </footer>
  );
}

export function BackToTop() {
  const ref = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const show = gsap
      .timeline({ paused: true })
      .fromTo(
        ref.current,
        { autoAlpha: 0, scale: 0, rotate: -180 },
        { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2)' },
      );

    ScrollTrigger.create({
      start: 600,
      end: 'max',
      onEnter: () => show.play(),
      onLeaveBack: () => show.reverse(),
    });
  });

  return (
    <button
      ref={ref}
      onClick={() => scrollToTarget(0)}
      className="invisible fixed bottom-8 right-8 z-40 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-3 text-[#fff] shadow-lg"
      aria-label="Back to top"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
}
