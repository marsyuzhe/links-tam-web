'use client';
import Image from 'next/image';
import { useLocale } from './Locale';
import { useState, useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { Flip } from 'gsap/Flip';
import { finishProjectFlight } from './project-flight';
import type { MediaItem } from '@/content/media';
type Slide = {
  id: string;
  src: string;
  caption: string;
  purpose: string;
  width: number;
  height: number;
  sourceUrl?: string;
};
export function MediaGallery({
  media,
  artwork,
  title,
  slug,
}: {
  media: MediaItem[];
  artwork?: string;
  title: string;
  slug: string;
}) {
  const { locale } = useLocale();
  const en = locale === 'en';
  const [kind, setKind] = useState<'real' | 'art'>(media.length ? 'real' : 'art');
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const image = trigger.current?.querySelector('img');
    return image ? finishProjectFlight(slug, image) : undefined;
  }, [slug]);
  const slides: Slide[] =
    kind === 'real'
      ? media.map((m) => ({
          ...m,
          caption: en ? (captions[m.id] ?? title + ' · Repository screenshot') : m.caption,
        }))
      : artwork
        ? [
            {
              id: 'art',
              src: artwork,
              caption: en
                ? `${title} · Original concept artwork, not a product interface`
                : `${title} 原创艺术封面，非实际软件界面`,
              purpose: 'Concept Artwork',
              width: 1600,
              height: 900,
            },
          ]
        : [];
  const active = slides[index] || slides[0];
  const move = (n: number) => setIndex((i) => (i + n + slides.length) % slides.length);
  if (!active)
    return (
      <p className="evidence-pending">
        {en
          ? 'No public media is available. See the project sources.'
          : '尚无可公开媒体。查看项目来源与当前记录。'}
      </p>
    );
  return (
    <section
      className="media-gallery"
      aria-label={en ? `${title} media gallery` : `${title} 媒体画廊`}
    >
      <div className="media-top">
        <div className="media-kinds">
          {media.length > 0 && (
            <button
              aria-pressed={kind === 'real'}
              onClick={() => {
                setKind('real');
                setIndex(0);
              }}
            >
              {en ? 'Real screenshots' : '真实截图'}
            </button>
          )}
          {artwork && (
            <button
              aria-pressed={kind === 'art'}
              onClick={() => {
                setKind('art');
                setIndex(0);
              }}
            >
              {en ? 'Concept artwork' : '艺术封面'}
            </button>
          )}
        </div>
        <span>{active.purpose}</span>
      </div>
      <button
        ref={trigger}
        className="media-frame"
        aria-label={
          en ? `Enlarge ${title}` : `放大 ${title} ${kind === 'real' ? '界面截图' : '艺术封面'}`
        }
        onClick={() => setOpen(true)}
      >
        <Image
          src={active.src}
          width={active.width}
          height={active.height}
          alt={active.caption}
          priority
        />
        <span>{en ? 'View image ↗' : '查看大图 ↗'}</span>
      </button>
      <div className="media-caption">
        <div>
          <p>{active.caption}</p>
          <small>
            {en ? 'Source' : '源图'} {active.width} × {active.height}
            {active.sourceUrl && (
              <>
                {' '}
                ·{' '}
                <a href={active.sourceUrl} target="_blank" rel="noreferrer">
                  {en ? 'View source ↗' : '查看来源 ↗'}
                </a>
              </>
            )}
          </small>
        </div>
        <div className="gallery-controls">
          <button
            onClick={() => move(-1)}
            disabled={slides.length < 2}
            aria-label={en ? 'Previous image' : '上一张'}
          >
            ←
          </button>
          <span>
            {index + 1} / {slides.length}
          </span>
          <button
            onClick={() => move(1)}
            disabled={slides.length < 2}
            aria-label={en ? 'Next image' : '下一张'}
          >
            →
          </button>
        </div>
      </div>
      {open && (
        <GalleryModal
          source={trigger.current?.querySelector('img') ?? null}
          active={active}
          index={index}
          total={slides.length}
          move={move}
          title={title}
          close={() => {
            setOpen(false);
            requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
          }}
        />
      )}
    </section>
  );
}
function GalleryModal({
  source,
  active,
  index,
  total,
  move,
  title,
  close,
}: {
  source: HTMLImageElement | null;
  active: Slide;
  index: number;
  total: number;
  move: (n: number) => void;
  title: string;
  close: () => void;
}) {
  const { locale } = useLocale();
  const en = locale === 'en';
  const ref = useRef<HTMLDialogElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const d = ref.current!;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    d.showModal();
    return () => {
      d.close();
      document.body.style.overflow = old;
    };
  }, []);
  useEffect(() => {
    const image = imageRef.current;
    if (
      !source ||
      !image ||
      source.src !== image.src ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    gsap.registerPlugin(Flip);
    const end = Flip.getState(image);
    Flip.fit(image, source, { scale: true });
    const animation = Flip.to(end, {
      targets: image,
      scale: true,
      duration: 0.46,
      ease: 'power3.inOut',
      onComplete: () => gsap.set(image, { clearProps: 'transform,width,height' }),
    });
    const settle = () => {
      animation.kill();
      gsap.set(image, { clearProps: 'transform,width,height' });
    };
    window.addEventListener('resize', settle, { once: true });
    return () => {
      window.removeEventListener('resize', settle);
      settle();
    };
  }, [source]);
  return (
    <dialog
      ref={ref}
      className="gallery-dialog"
      aria-label={en ? `${title} image viewer` : `${title} 图片查看器`}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          move(-1);
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          move(1);
        }
      }}
    >
      <div className="gallery-dialog-header">
        <span>
          {active.purpose} · {index + 1} / {total}
        </span>
        <button autoFocus onClick={close}>
          {en ? 'Close × / ESC' : '关闭 × / ESC'}
        </button>
      </div>
      <Image
        ref={imageRef}
        src={active.src}
        width={active.width}
        height={active.height}
        alt={active.caption}
      />
      <div className="media-caption">
        <p>
          {active.caption}
          <br />
          <small>
            {active.width} × {active.height}
          </small>
        </p>
        <div className="gallery-controls">
          <button
            disabled={total < 2}
            onClick={() => move(-1)}
            aria-label={en ? 'Previous image' : '上一张'}
          >
            ←
          </button>
          <button
            disabled={total < 2}
            onClick={() => move(1)}
            aria-label={en ? 'Next image' : '下一张'}
          >
            →
          </button>
        </div>
      </div>
    </dialog>
  );
}

const captions: Record<string, string> = {
  'manga-workspace': 'Manga translation workspace · Synthetic demonstration content',
  'manga-translation': 'Translation centre · Repository demonstration content',
  'ledger-dashboard': 'Local ledger dashboard · Demo data',
  'kado-dashboard': 'KADO Desk for Windows · Synthetic demonstration data',
  'kado-office': 'Pixel Office · Local demonstration characters and tasks',
  'audio-dark': 'Links Audio conversion queue · Synthetic non-speech sample',
  'audio-light': 'Links Audio light mode · Generic demonstration paths',
  'roomfit-editor': 'RoomFit 3D editor · Demonstration room',
  'roomfit-render': 'RoomFit 3D · Local rendering example',
};
