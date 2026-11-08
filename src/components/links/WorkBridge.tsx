'use client';
import { T } from './Locale';
import Image from 'next/image';
import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';
export function WorkBridge() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: 'top 95%',
              end: 'bottom 25%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            '.bridge-media',
            { clipPath: 'inset(12% 18% 12% 18%)', y: 70, scale: 0.92 },
            { clipPath: 'inset(0% 0% 0% 0%)', y: 0, scale: 1, duration: 1, ease: 'none' },
            0,
          )
          .fromTo('.bridge-copy', { y: 40 }, { y: -20, duration: 1, ease: 'none' }, 0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className="work-bridge">
      <p className="bridge-copy">
        <T value="把反复的操作，" />
        <br />
        <T value="做成自己的工作台。" />
      </p>
      <div className="bridge-media">
        <Image
          src="/assets/manga-workspace.png"
          width={1600}
          height={900}
          alt="Links Manga Studio 真实工作区截图，内容为项目合成演示素材"
        />
        <span>
          <T value="从漫画排版开始，探索我的作品 ↓" />
        </span>
      </div>
    </div>
  );
}
