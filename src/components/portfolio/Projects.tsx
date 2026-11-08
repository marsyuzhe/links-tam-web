'use client';
import { T, useLocale } from '@/components/links/Locale';

import { useRef } from 'react';
import Image from 'next/image';
import { LocaleLink as Link } from '@/components/links/Locale';
import { rememberHome } from '@/lib/return-home';
import { startProjectFlight } from '@/components/links/project-flight';
import { ArrowUpRight, Github } from 'lucide-react';
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '@/lib/gsap';
import { projects, type Project } from '@/data/portfolio';
import { asset } from '@/lib/utils';
import { SectionHeading } from './SectionHeading';

import { projectMedia } from '@/content/media';
import { englishProjects } from '@/content/projects-en';

const pad = (n: number) => String(n).padStart(2, '0');

export function Projects() {
  const { locale } = useLocale();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const track = root.current!.querySelector<HTMLElement>('.projects-track')!;
      const counter = root.current!.querySelector<HTMLElement>('.projects-counter')!;

      // Desktop: pin the section and scroll the track sideways.
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        gsap.set('.projects-viewport', { overflow: 'visible' });
        // Travel until the last card sits in the middle of the screen, so the section ends
        // settled rather than with the final card jammed against the right edge.
        const distance = () => {
          const cards = track.querySelectorAll<HTMLElement>('.project-card');
          const lastCard = cards[cards.length - 1];
          // Layout offsets, not bounding rects: the cards start rotated in 3D, which skews
          // getBoundingClientRect and would leave the last card off-centre. The track's 3D
          // perspective makes it the cards' offset parent, so offsetLeft is already track-relative.
          const cardCenter = lastCard.offsetLeft + lastCard.offsetWidth / 2;
          const trackLeft =
            track.getBoundingClientRect().left - Number(gsap.getProperty(track, 'x'));
          return Math.max(0, trackLeft + cardCenter - window.innerWidth / 2);
        };

        const horizontal = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.projects-pin',
            start: 'center center',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const i = Math.min(projects.length, Math.floor(self.progress * projects.length) + 1);
              counter.textContent = pad(i);
            },
          },
        });

        gsap.to('.projects-progress', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.projects-pin',
            start: 'center center',
            end: () => `+=${distance()}`,
            scrub: true,
          },
        });

        // Each card's image drifts inside its frame, driven by the horizontal tween.
        gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
          gsap.fromTo(
            card.querySelector('.project-img'),
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontal,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          );
          gsap.from(card, {
            rotateY: () => -Math.max(8, Math.min(25, 36000 / innerWidth)),
            autoAlpha: 0.2,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontal,
              start: 'left 110%',
              end: 'left 70%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });
      });

      // Mobile / tablet: a deck being dealt. Each card pins a little lower than the one before
      // (so earlier cards peek out above), and as the next card slides up over it, the card
      // underneath shrinks, tilts back and darkens. GSAP pins rather than CSS sticky, because
      // ScrollSmoother moves the page with transforms, which breaks position: sticky.
      // A narrow mouse/keyboard viewport is often desktop zoom. Use normal reading
      // order there so the pinned heading cannot cover the enlarged case controls.
      mm.add(`(max-width: 1023px) and (pointer: coarse) and ${MOTION_OK}`, () => {
        const cards = gsap.utils.toArray<HTMLElement>('.project-card');
        const last = cards.length - 1;
        const head = root.current!.querySelector<HTMLElement>('.projects-head')!;
        // Account for the full heading, including a wrapped description on small phones.
        const headTop = () =>
          (document.querySelector<HTMLElement>('.site-nav')?.offsetHeight ?? 64) + 8;
        const top = (i: number) => headTop() + head.offsetHeight + 12 + i * 9;

        ScrollTrigger.create({
          trigger: head,
          start: () => `top top+=${headTop()}`,
          endTrigger: cards[last],
          end: () => `top top+=${top(last)}`,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });

        cards.forEach((card, i) => {
          ScrollTrigger.create({
            trigger: card,
            start: () => `top top+=${top(i)}`,
            endTrigger: cards[last],
            end: () => `top top+=${top(last)}`,
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
          });
          if (i === last) return;
          gsap
            .timeline({
              scrollTrigger: {
                trigger: cards[i + 1],
                start: 'top bottom',
                end: () => `top top+=${top(i + 1)}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .to(card.querySelector('.project-inner'), { scale: 0.9, rotateX: 10, ease: 'none' }, 0)
            .to(card.querySelector('.stack-shade'), { opacity: 0.55, ease: 'none' }, 0);
        });

        // First card deals in as the section arrives.
        gsap.from(cards[0], {
          y: 60,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: cards[0], start: 'top 90%' },
        });
      });

      // Pointer tilt on every card (fine pointers only).
      mm.add(`(pointer: fine) and ${MOTION_OK}`, () => {
        const cleanups = gsap.utils.toArray<HTMLElement>('.project-card').map((card) => {
          const inner = card.querySelector<HTMLElement>('.project-inner')!;
          const rx = gsap.quickTo(inner, 'rotationX', { duration: 0.6, ease: 'power3' });
          const ry = gsap.quickTo(inner, 'rotationY', { duration: 0.6, ease: 'power3' });
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 12);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener('pointermove', move);
          card.addEventListener('pointerleave', leave);
          return () => {
            card.removeEventListener('pointermove', move);
            card.removeEventListener('pointerleave', leave);
          };
        });
        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="projects" className="relative px-6 py-10 md:py-14 lg:overflow-x-clip">
      <div className="projects-head mx-auto w-full max-w-7xl">
        <Link className="archive-home-link" href="/projects">
          <T value="浏览全部项目档案 ↗" />
        </Link>
        <SectionHeading eyebrow="02 — Selected work" lead="My" accent="Projects" lag={false}>
          <T value="从漫画排版、电商视频工作流到个人工具。项目状态按已有资料标注，艺术封面不作为产品截图。" />
        </SectionHeading>
      </div>

      <div className="projects-pin lg:flex lg:flex-col">
        <div className="projects-viewport lg:-mx-6 lg:overflow-x-auto lg:px-12">
          <div className="projects-track mx-auto flex max-w-xl flex-col gap-6 [perspective:1400px] lg:mx-0 lg:w-max lg:max-w-none lg:flex-row lg:gap-10">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 hidden w-full max-w-7xl items-center gap-6 px-6 font-mono text-sm text-gray-400 lg:flex">
          <span>
            <span className="projects-counter text-white">01</span> / {pad(projects.length)}
          </span>
          <div className="h-px flex-1 bg-white/10">
            <div className="projects-progress h-full origin-left scale-x-0 bg-gradient-to-r from-blue-400 to-purple-400" />
          </div>
          <span>{locale === 'en' ? 'Scroll' : '滚动'} →</span>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: original }: { project: Project }) {
  const { locale } = useLocale();
  const project =
    locale === 'en' ? englishProjects.find((p) => p.slug === original.slug)! : original;
  const secondaryMedia = projectMedia.find((media) => media.id === project.media[0]);
  const openCase = (event: React.MouseEvent) => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    rememberHome(project.slug);
    startProjectFlight(event, project.slug);
  };
  return (
    <article
      data-project-slug={project.slug}
      className="project-card group lg:w-[400px] lg:shrink-0 xl:w-[440px]"
      data-cursor={project.link ? (locale === 'en' ? 'View' : '查看') : undefined}
    >
      <div className="project-inner relative flex h-full origin-top flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl shadow-black/40 transition-colors duration-300 [transform-style:preserve-3d] group-hover:border-blue-500/50 lg:bg-neutral-900/90 lg:shadow-none">
        {/* Darkens a card as the next one stacks over it (mobile). */}
        <span
          className="stack-shade pointer-events-none absolute inset-0 z-20 bg-[#000] opacity-0 lg:hidden"
          aria-hidden="true"
        />
        <div className="project-card-media relative h-52 overflow-hidden">
          {project.image ? (
            <>
              <div className="project-img absolute -inset-x-[10%] inset-y-0">
                <Image
                  src={asset(project.image)}
                  alt={
                    locale === 'en'
                      ? `${project.title} concept artwork, not a product screenshot`
                      : `${project.title} 原创艺术封面，非产品截图`
                  }
                  fill
                  sizes="(min-width: 1280px) 520px, (min-width: 1024px) 480px, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              {secondaryMedia && (
                <Image
                  src={secondaryMedia.src}
                  width={secondaryMedia.width}
                  height={secondaryMedia.height}
                  alt={secondaryMedia.caption}
                  className="project-real-preview absolute inset-0 h-full w-full object-contain bg-neutral-950 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgb(0_0_0/0.7)] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute right-3 top-3 z-10 flex gap-2.5">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-white/70 bg-black/85 px-4 text-sm font-bold text-white shadow-xl shadow-black/60 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    aria-label={
                      locale === 'en'
                        ? `${project.title} on GitHub`
                        : `在 GitHub 查看 ${project.title}`
                    }
                  >
                    <Github className="h-5 w-5" />
                    GitHub
                  </a>
                )}
                {project.link && (
                  <Link
                    href={project.link}
                    onClick={openCase}
                    className="group/live inline-flex min-h-11 items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 pl-4 pr-3 text-sm font-extrabold text-black shadow-xl shadow-black/60 ring-2 ring-white/80 transition duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
                    aria-label={
                      locale === 'en'
                        ? `Explore case: ${project.title}`
                        : `查看案例：${project.title}`
                    }
                  >
                    {locale === 'en' ? 'Explore case' : '查看案例'}
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5" />
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="h-full animate-pulse bg-gradient-to-br from-neutral-800 to-neutral-900" />
          )}
          <span className="absolute top-3 left-4 z-10 rounded-full bg-black/75 px-3 py-1 text-[10px] text-[#fff]">
            <span className={secondaryMedia ? 'group-hover:hidden group-focus-within:hidden' : ''}>
              <T value="艺术封面" />
            </span>
            {secondaryMedia && (
              <span className="hidden group-hover:inline group-focus-within:inline">
                <T value="真实截图" />
              </span>
            )}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="mb-2 text-xl font-bold">
            {project.link ? (
              <Link href={project.link} onClick={openCase} className="hover:text-blue-300">
                {project.title}
              </Link>
            ) : (
              project.title
            )}
          </h3>
          <p className="mb-5 line-clamp-3 flex-1 text-gray-400">{project.description}</p>
          <p className="mb-4 text-xs leading-relaxed text-purple-300">{project.status}</p>
          <ul className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
