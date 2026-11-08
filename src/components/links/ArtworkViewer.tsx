'use client';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
export function ArtworkViewer({
  src,
  title,
  screenshot = false,
}: {
  src: string;
  title: string;
  screenshot?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        className="artwork-open"
        ref={trigger}
        onClick={() => setOpen(true)}
        aria-label={`放大 ${title} ${screenshot ? '界面截图' : '艺术封面'}`}
      >
        <Image
          src={src}
          alt={`${title} 原创艺术封面，非产品截图`}
          width={1600}
          height={900}
          priority
        />
        <span>
          {screenshot
            ? '来自项目仓库的真实界面 · 点击放大 ↗'
            : '原创艺术封面 / 非产品截图 · 点击放大 ↗'}
        </span>
      </button>
      {open && (
        <Modal
          src={src}
          title={title}
          screenshot={screenshot}
          onClose={() => {
            setOpen(false);
            requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
          }}
        />
      )}
    </>
  );
}
function Modal({
  src,
  title,
  screenshot,
  onClose,
}: {
  src: string;
  title: string;
  screenshot: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    const y = scrollY;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    d.showModal();
    return () => {
      d.close();
      document.body.style.overflow = old;
      window.scrollTo(0, y);
    };
  }, []);
  return (
    <dialog
      className="art-dialog"
      ref={ref}
      aria-label={`${title} 艺术封面查看器`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button onClick={onClose} autoFocus>
        关闭 × / ESC
      </button>
      <Image src={src} alt={`${title} 原创艺术封面，非产品截图`} width={1600} height={900} />
      <p>
        {screenshot
          ? '真实界面截图，来源为本人公开项目仓库。'
          : '原创项目艺术封面，并非实际软件界面。'}
      </p>
    </dialog>
  );
}
