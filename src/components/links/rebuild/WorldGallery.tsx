'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { WorldScreenshot } from '@/content/worlds';
export function WorldGallery({ items, en }: { items: WorldScreenshot[]; en: boolean }) {
  const [active, setActive] = useState<WorldScreenshot | null>(null),
    dialog = useRef<HTMLDialogElement>(null),
    origin = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (active) dialog.current?.showModal();
  }, [active]);
  const close = () => {
    dialog.current?.close();
    setActive(null);
    requestAnimationFrame(() => origin.current?.focus({ preventScroll: true }));
  };
  return (
    <>
      <div className="world-shot-grid">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={(e) => {
              origin.current = e.currentTarget;
              setActive(item);
            }}
          >
            <Image src={item.src} width={1200} height={800} alt={item.caption[en ? 1 : 0]} />
            <span>
              {item.caption[en ? 1 : 0]} ·{' '}
              {item.kind === 'screenshot'
                ? en
                  ? 'Real screenshot'
                  : '真实截图'
                : en
                  ? 'Concept'
                  : '概念图'}
            </span>
          </button>
        ))}
      </div>
      {active && (
        <dialog
          ref={dialog}
          className="rebuild-dialog"
          onCancel={(e) => {
            e.preventDefault();
            close();
          }}
          aria-label={active.caption[en ? 1 : 0]}
        >
          <button autoFocus onClick={close}>
            {en ? 'Close' : '关闭'} ×
          </button>
          <Image src={active.src} width={1600} height={1000} alt={active.caption[en ? 1 : 0]} />
          <p>{active.caption[en ? 1 : 0]}</p>
          <a href={active.source} target="_blank" rel="noreferrer">
            {en ? 'Source' : '来源'} ↗
          </a>
        </dialog>
      )}
    </>
  );
}
