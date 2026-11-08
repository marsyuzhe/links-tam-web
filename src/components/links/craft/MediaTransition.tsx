'use client';
import Image from 'next/image';
import { useRef, useEffect, useCallback } from 'react';
import { Flip } from 'gsap/Flip';
import { gsap } from '@/lib/gsap';
import { projectMedia } from '@/content/media';
import { LocaleLink as Link, useLocale } from '../Locale';
import { HowItWorks } from './HowItWorks';

export function MediaTransition() {
  const { locale } = useLocale(),
    en = locale === 'en';
  const media = projectMedia.find((item) => item.id === 'manga-workspace')!;
  const trigger = useRef<HTMLButtonElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    surface = useRef<HTMLDivElement>(null),
    closing = useRef(false),
    transition = useRef<gsap.core.Animation | null>(null),
    bodyOverflow = useRef('');
  const finish = useCallback(() => {
    dialog.current?.close();
    gsap.set(surface.current, { clearProps: 'transform,width,height' });
    document.body.style.overflow = bodyOverflow.current;
    closing.current = false;
    trigger.current?.focus({ preventScroll: true });
  }, []);
  const animateClose = useCallback(() => {
    if (!dialog.current?.open || closing.current) return;
    closing.current = true;
    // A rapid Back/ESC must stop the entering FLIP before returning the same surface.
    transition.current?.kill();
    gsap.killTweensOf(surface.current);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }
    transition.current = Flip.fit(
      surface.current,
      trigger.current?.querySelector('img') ?? trigger.current,
      {
        scale: true,
        duration: 0.38,
        ease: 'power3.inOut',
        onComplete: finish,
      },
    ) as gsap.core.Tween;
  }, [finish]);
  const open = useCallback((push = true) => {
    if (dialog.current?.open && !closing.current) return;
    gsap.registerPlugin(Flip);
    closing.current = false;
    transition.current?.kill();
    gsap.killTweensOf(surface.current);
    gsap.set(surface.current, { clearProps: 'transform,width,height' });
    if (!dialog.current?.open) {
      bodyOverflow.current = document.body.style.overflow;
      dialog.current?.showModal();
    }
    document.body.style.overflow = 'hidden';
    if (push) {
      const url = new URL(location.href);
      url.searchParams.set('media', 'manga');
      history.pushState({ ...history.state, craftMedia: true }, '', url);
    }
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const destination = Flip.getState(surface.current);
      Flip.fit(surface.current, trigger.current?.querySelector('img') ?? trigger.current, {
        scale: true,
      });
      transition.current = Flip.to(destination, {
        targets: surface.current,
        scale: true,
        duration: 0.55,
        ease: 'power3.inOut',
        onComplete: () => gsap.set(surface.current, { clearProps: 'transform,width,height' }),
      });
    }
  }, []);
  const close = () => {
    if (history.state?.craftMedia) history.back();
    else {
      const url = new URL(location.href);
      url.searchParams.delete('media');
      history.replaceState(history.state, '', url);
      animateClose();
    }
  };
  useEffect(() => {
    const mediaSurface = surface.current;
    // Preserve the caller's scroll lock instead of assuming the body was unlocked.
    const previousOverflow = document.body.style.overflow;
    const sync = () => {
      if (new URLSearchParams(location.search).get('media') === 'manga') open(false);
      else animateClose();
    };
    sync();
    const resize = () => {
      if (!dialog.current?.open) return;
      // The FLIP is measured in viewport coordinates. A native zoom/resize invalidates
      // both rectangles; settle to the real layout rather than stretching stale pixels.
      transition.current?.kill();
      if (closing.current) finish();
      else gsap.set(mediaSurface, { clearProps: 'transform,width,height' });
    };
    window.addEventListener('popstate', sync);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('resize', resize);
      transition.current?.kill();
      gsap.killTweensOf(mediaSurface);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, animateClose, finish]);
  return (
    <section id="craft-media" className="craft-section">
      <header className="craft-section-heading">
        <h2>{en ? 'From a glimpse. To the details.' : '从预览，到看清。'}</h2>
        <p>
          {en
            ? 'An actual workspace. Open it, then bring it back.'
            : '一张真实的工作台截图。展开，再回到原处。'}
        </p>
      </header>
      <button
        ref={trigger}
        className="craft-media-preview"
        onClick={() => open()}
        aria-label={en ? 'Expand Manga Studio screenshot' : '展开 Manga Studio 截图'}
      >
        <Image
          src={media.src}
          width={media.width}
          height={media.height}
          alt={en ? 'Links Manga Studio · Repository demonstration content' : media.caption}
        />
        <span>{en ? 'Open the workspace ↗' : '展开工作台 ↗'}</span>
      </button>
      <HowItWorks>
        <p>
          {en
            ? 'GSAP Flip measures the preview and the expanded image. The image keeps its original ratio. Escape and browser Back run the return transition and restore focus. Reduced motion uses an immediate change.'
            : 'GSAP Flip 测量预览与展开图的空间位置，保持原图比例。ESC 与浏览器后退触发返回转场，并恢复来源焦点。减少动态效果时即时切换。'}
        </p>
        <a href={media.sourceUrl} target="_blank" rel="noreferrer">
          {en ? 'Original screenshot source' : '原始截图来源'} ↗
        </a>
      </HowItWorks>
      <dialog
        ref={dialog}
        className="craft-media-dialog"
        aria-label="Links Manga Studio"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        <header>
          <h3>Links Manga Studio</h3>
          <button autoFocus onClick={close}>
            {en ? 'Close ×' : '关闭 ×'}
          </button>
        </header>
        <div ref={surface} className="craft-media-surface">
          <Image
            src={media.src}
            width={media.width}
            height={media.height}
            alt={en ? 'Actual repository screenshot with demonstration content' : media.caption}
          />
        </div>
        <p>
          {en
            ? 'A real software interface with synthetic demonstration content.'
            : '真实软件界面，使用合成演示内容。'}
        </p>
        <div className="craft-image-links">
          <a href={media.src} target="_blank" rel="noreferrer">
            {en ? 'Open full image' : '查看原尺寸'} ↗
          </a>
          <Link href="/projects/manga-studio">{en ? 'Read the project' : '查看项目'} ↗</Link>
        </div>
      </dialog>
    </section>
  );
}
