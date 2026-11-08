'use client';
import { LocaleLink as Link, useLocale } from '../Locale';
import { getExperiences } from '@/content/experience-localized';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { memoryPresentation } from '@/content/keycaps';
import { EXPERIENCE_PENDING, requestExperienceRestore } from '@/lib/experience-return';
import { gsap } from '@/lib/gsap';
import Image from 'next/image';
import { WorkEvidence } from './WorkEvidence';
import { startExperienceTransition } from './ExperienceTransition';
export function ExperienceDetail({ id }: { id: string }) {
  const { locale } = useLocale();
  const en = locale === 'en';
  const e = getExperiences(locale).find((e) => e.id === id)!;
  const presentation = memoryPresentation.find((p) => p.id === id)!;
  const root = useRef<HTMLElement>(null);
  const router = useRouter();
  useEffect(() => {
    const leave = () => {
      if (history.state?.fromMemoryKeys || sessionStorage.getItem(EXPERIENCE_PENDING))
        requestExperienceRestore();
    };
    const wasFromMemory = () => {
      requestExperienceRestore();
      const anchor = root.current?.querySelector<HTMLElement>('[data-experience-anchor]');
      if (anchor)
        startExperienceTransition(
          anchor.getBoundingClientRect(),
          presentation.style,
          `#memory-key-${id}`,
        );
    };
    const timer = setTimeout(() => {
      if (history.state?.fromMemoryKeys) window.addEventListener('popstate', wasFromMemory);
    }, 0);
    window.addEventListener('pagehide', leave);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pagehide', leave);
      window.removeEventListener('popstate', wasFromMemory);
    };
  }, [id, presentation.style]);
  useEffect(() => {
    try {
      const pending = JSON.parse(sessionStorage.getItem(EXPERIENCE_PENDING) || 'null');
      if (pending?.experienceId === id && Date.now() - pending.time < 15000) {
        history.replaceState({ ...history.state, fromMemoryKeys: true }, '');
        sessionStorage.removeItem(EXPERIENCE_PENDING);
      }
    } catch {}
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = gsap.fromTo(
        root.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, delay: 0.12, clearProps: 'all' },
      );
      return () => {
        t.kill();
      };
    }
  }, [id]);
  return (
    <article ref={root} className="experience-detail">
      <Link
        className="reading-button memory-back"
        href="/#memory-keys"
        onClick={(ev) => {
          if (
            ev.button === 0 &&
            !ev.ctrlKey &&
            !ev.metaKey &&
            !ev.shiftKey &&
            !ev.altKey &&
            history.state?.fromMemoryKeys
          ) {
            ev.preventDefault();
            requestExperienceRestore();
            router.back();
          }
        }}
      >
        {en ? '↖ Back to memory keys' : '↖ 返回记忆键帽'}
      </Link>
      <header className="experience-detail-header">
        <div>
          <h1>{e.company}</h1>
          <p className="experience-detail-role">{e.role}</p>
          <p className="experience-detail-meta">
            {e.period}
            <br />
            {e.relationship}
          </p>
        </div>
        <div
          className={`experience-key-anchor key-look key-${presentation.style}`}
          data-experience-anchor
          aria-hidden="true"
        >
          <Image
            src={`/assets/keycaps/${presentation.style}.svg`}
            alt=""
            width={220}
            height={200}
          />
        </div>
      </header>
      <div className="experience-detail-copy">
        <section>
          <h2>{en ? 'My work' : '我参与的工作'}</h2>
          <ul>
            {e.duties.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
        {e.related?.length && (
          <section>
            <h2>{en ? 'Related projects' : '相关项目'}</h2>
            <div className="experience-project-links">
              {e.related.map((p) => (
                <Link href={p.href} key={p.href}>
                  {p.label} ↗
                </Link>
              ))}
            </div>
          </section>
        )}
        <WorkEvidence id={id} />
        <section>
          <h2>{en ? 'What I took from it' : '这段经历带给我的'}</h2>
          <p>{e.sourceNote}</p>
        </section>
        <Link className="reading-button" href="/resume">
          {en ? 'Full resume ↗' : '完整个人简历 ↗'}
        </Link>
      </div>
    </article>
  );
}
