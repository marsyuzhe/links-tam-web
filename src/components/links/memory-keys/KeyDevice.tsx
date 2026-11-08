'use client';
import dynamic from 'next/dynamic';
import { LocaleLink as Link, useLocale } from '../Locale';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { KeyItem } from '@/content/keycaps';
import { deviceLayout, type HitRect } from './device-layout';
import { rememberExperience } from '@/lib/experience-return';
import { startExperienceTransition } from '../experience/ExperienceTransition';
const Scene = dynamic(() => import('./MemoryKeysScene'), { ssr: false });
class SceneBoundary extends Component<
  { children: ReactNode; failed: () => void },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch() {
    this.props.failed();
  }
  render() {
    return this.state.error ? null : this.props.children;
  }
}
export function KeyDevice({
  items,
  compact = false,
  demo = false,
  onActivate,
  exploded = false,
}: {
  items: KeyItem[];
  compact?: boolean;
  demo?: boolean;
  exploded?: boolean;
  onActivate?: () => void;
}) {
  const { locale, href, t } = useLocale();
  const en = locale === 'en';
  const [base, setBase] = useState<HitRect | null>(null);
  const [stageHeight, setStageHeight] = useState(compact ? 112 : 300);
  const root = useRef<HTMLDivElement>(null);
  const [pageVisible, setPageVisible] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);
  const [rects, setRects] = useState<HitRect[]>([]);
  const router = useRouter();
  const down = useRef<{ id: string; x: number; y: number } | null>(null);
  const cancelled = useRef(false);
  const fail = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);
  const loaded = useCallback(() => setReady(true), []);
  const hovered = useRef<string | null>(null);
  const focused = useRef<string | null>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const h = compact
        ? 112
        : w < 250
          ? items.length === 1
            ? 260
            : 680
          : w < 600
            ? Math.min(410, w * 1.04 + 40)
            : w > 1600
              ? Math.min(w * 0.43, innerHeight * 0.6)
              : 300;
      const layout = deviceLayout(w, h, items.length, compact);
      setStageHeight(h);
      setRects(layout.rects);
      setBase(layout.base);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [items.length, compact]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const check = () => {
      const nav = navigator as Navigator & { deviceMemory?: number };
      setEligible(
        !media.matches &&
          innerWidth >= 500 &&
          innerHeight >= 420 &&
          navigator.hardwareConcurrency > 2 &&
          (nav.deviceMemory === undefined || nav.deviceMemory > 2) &&
          new URLSearchParams(location.search).get('graphics') !== '2d',
      );
    };
    check();
    media.addEventListener('change', check);
    window.addEventListener('resize', check);
    const observer = new IntersectionObserver(
      (entries) => setNear(entries.some((e) => e.isIntersecting)),
      { rootMargin: '180px' },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      media.removeEventListener('change', check);
      window.removeEventListener('resize', check);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    const reset = () => {
      setPressed(null);
      setPageVisible(!document.hidden);
      down.current = null;
    };
    window.addEventListener('blur', reset);
    document.addEventListener('visibilitychange', reset);
    return () => {
      window.removeEventListener('blur', reset);
      document.removeEventListener('visibilitychange', reset);
    };
  }, []);
  const is3d = eligible && !failed && near && pageVisible;
  const shown = items.find((i) => i.id === active);
  return (
    <div
      ref={root}
      className={`key-device ${compact ? 'key-device-dock' : 'key-device-memory'} ${ready && is3d ? 'device-3d' : 'device-fallback'}`}
      data-layout={rects.length ? 'positioned' : 'grid'}
      data-renderer={ready && is3d ? 'webgl' : '2.5d'}
      data-active={active ?? ''}
      data-pressed={pressed ?? ''}
    >
      <div className="device-stage" style={{ height: stageHeight }}>
        <div
          className="device-css-base"
          aria-hidden="true"
          style={
            base
              ? {
                  left: base.left + '%',
                  top: base.top + '%',
                  width: base.width + '%',
                  height: base.height + '%',
                }
              : undefined
          }
        />
        {is3d && (
          <div className="device-canvas" aria-hidden="true">
            <SceneBoundary failed={fail}>
              <Scene
                items={items}
                compact={compact}
                active={active}
                pressed={pressed}
                exploded={exploded}
                onReady={loaded}
                onFail={fail}
                onRects={setRects}
              />
            </SceneBoundary>
          </div>
        )}
        <div className="device-inputs">
          {items.map((item, i) => {
            const rect = rects[i];
            const label = demo || compact ? item.label : en ? `Internship ${i + 1}` : item.label;
            return (
              <Link
                id={compact ? `dock-key-${item.id}` : `memory-key-${item.id}`}
                key={item.id}
                href={item.href}
                role={demo ? 'button' : undefined}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                aria-label={
                  demo
                    ? label
                    : compact
                      ? label
                      : en
                        ? `${label}, explore experience`
                        : `${label}，查看经历`
                }
                data-key-id={item.id}
                className={`device-key ${active === item.id ? 'key-active' : ''} ${pressed === item.id ? 'key-pressed' : ''}`}
                style={
                  rect
                    ? {
                        position: 'absolute',
                        left: rect.left + '%',
                        top: rect.top + '%',
                        width: rect.width + '%',
                        height: rect.height + '%',
                      }
                    : undefined
                }
                onPointerEnter={() => {
                  hovered.current = item.id;
                  setActive(item.id);
                }}
                onPointerLeave={() => {
                  hovered.current = null;
                  setActive(focused.current);
                  setPressed(null);
                  if (down.current) cancelled.current = true;
                  down.current = null;
                }}
                onFocus={() => {
                  focused.current = item.id;
                  setActive(item.id);
                }}
                onBlur={() => {
                  focused.current = null;
                  setActive(hovered.current);
                  setPressed((current) => (current === item.id ? null : current));
                }}
                onPointerDown={(e) => {
                  cancelled.current = false;
                  down.current = { id: item.id, x: e.clientX, y: e.clientY };
                  setPressed(item.id);
                }}
                onPointerMove={(e) => {
                  if (
                    down.current &&
                    Math.hypot(e.clientX - down.current.x, e.clientY - down.current.y) > 12
                  ) {
                    cancelled.current = true;
                    setPressed(null);
                  }
                }}
                onPointerUp={() => {
                  setPressed(null);
                  down.current = null;
                }}
                onPointerCancel={() => {
                  cancelled.current = true;
                  setPressed(null);
                  down.current = null;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || (demo && e.key === ' ')) {
                    if (e.repeat) {
                      e.preventDefault();
                      return;
                    }
                    if (demo && e.key === ' ') {
                      e.preventDefault();
                    }
                    cancelled.current = false;
                    setPressed(item.id);
                  }
                }}
                onKeyUp={(e) => {
                  setPressed(null);
                  // Space follows button semantics: commit once on release, never on repeat.
                  if (demo && e.key === ' ') {
                    e.preventDefault();
                    onActivate?.();
                  }
                }}
                onClick={(e) => {
                  if (cancelled.current) {
                    e.preventDefault();
                    cancelled.current = false;
                    return;
                  }
                  if (demo) {
                    e.preventDefault();
                    onActivate?.();
                    return;
                  }
                  if (compact || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)
                    return;
                  e.preventDefault();
                  rememberExperience(item.id);
                  startExperienceTransition(e.currentTarget.getBoundingClientRect(), item.style);
                  router.push(href(item.href));
                }}
              >
                <span className={`key-look key-${item.style}`} aria-hidden="true">
                  <Image
                    src={`/assets/keycaps/${item.style}.svg`}
                    alt=""
                    width={100}
                    height={100}
                  />
                </span>
                {compact && <span className="dock-key-label">{label}</span>}
              </Link>
            );
          })}
        </div>
      </div>
      {!compact && !demo && (
        <div className="memory-discovery" aria-live="polite">
          {shown ? (
            <>
              <strong>{en ? `Internship ${items.indexOf(shown) + 1}` : shown.label}</strong>
              <p>
                {en
                  ? [
                      'Connecting tools and business workflows.',
                      'From the product to the way it is seen.',
                      'Learning through documents and everyday records.',
                      'A short placement in a communications workplace.',
                    ][items.indexOf(shown)]
                  : shown.description}
              </p>
            </>
          ) : (
            <span>{t('四枚键帽，四段记忆。')}</span>
          )}
        </div>
      )}
    </div>
  );
}
