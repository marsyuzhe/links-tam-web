'use client';
import { useMemo, useState } from 'react';
import { KeyDevice } from '../memory-keys/KeyDevice';
import type { KeyStyle } from '@/content/keycaps';
import { LocaleLink as Link, useLocale } from '../Locale';
import { HowItWorks } from './HowItWorks';

export function KeyEngineering() {
  const { locale } = useLocale(),
    en = locale === 'en';
  const [material, setMaterial] = useState<KeyStyle>('circuit'),
    [structure, setStructure] = useState(false),
    [presses, setPresses] = useState(0);
  const items = useMemo(
    () => [
      {
        id: 'craft',
        href: '#craft-key',
        label: en ? 'Press the key' : '按下键帽',
        description: '',
        style: material,
      },
    ],
    [material, en],
  );
  return (
    <section className="craft-section craft-key-section" id="craft-key">
      <header className="craft-section-heading">
        <h2>{en ? 'A little resistance.' : '指尖的一点阻力。'}</h2>
        <p>
          {en
            ? 'The same Memory Key. A closer look at its construction.'
            : '同一枚 Memory Key，换个角度看看它的构造。'}
        </p>
      </header>
      <div className="craft-key-layout">
        <div className={structure ? 'craft-key-cutaway' : ''}>
          <KeyDevice
            items={items}
            exploded={structure}
            demo
            onActivate={() => setPresses((value) => value + 1)}
          />
        </div>
        <div className="craft-key-options">
          <p>{en ? 'Surface' : '表面材质'}</p>
          <div className="craft-controls">
            {(['circuit', 'display', 'document', 'signal'] as KeyStyle[]).map((style, index) => (
              <button
                key={style}
                aria-pressed={material === style}
                onClick={() => setMaterial(style)}
              >
                {
                  (en
                    ? ['Graphite', 'Frosted', 'Satin silver', 'Cool silver']
                    : ['石墨', '磨砂', '哑银', '冷银'])[index]
                }
              </button>
            ))}
          </div>
          <button
            className="reading-button"
            aria-pressed={structure}
            onClick={() => setStructure((value) => !value)}
          >
            {structure ? (en ? 'Assembled view' : '合拢结构') : en ? 'Show layers' : '显示结构'}
          </button>
          <p className="craft-key-legend">
            {structure
              ? en
                ? 'Legend / Cap / Socket / Base'
                : '图案 / 键面 / 键座 / 底座'
              : en
                ? 'Hover. Press. Release.'
                : '靠近。按下。松开。'}
          </p>
          <p role="status">
            {presses
              ? en
                ? `${presses} presses`
                : `已按下 ${presses} 次`
              : en
                ? 'Mouse, touch or keyboard.'
                : '支持鼠标、触摸与键盘。'}
          </p>
        </div>
      </div>
      <HowItWorks>
        <p>
          {en
            ? 'This reuses the homepage geometry, lights, materials and HTML input layer. It is a non-navigating demonstration, with no career records or private documents.'
            : '复用首页的原创几何、灯光、材质与 HTML 输入层。此处只演示触感，不加载职业记录或私人证明。'}
        </p>
        <p>
          {en
            ? 'R3F renders on demand; GSAP requests frames only during key movement. The canvas loads near the viewport and stops when hidden. Reduced motion, weak devices and WebGL failures use the same 2.5D input surface.'
            : 'R3F 按需渲染，GSAP 只在按键移动时请求绘制。Canvas 接近视口才加载，隐藏时停止。减少动态效果、低性能设备和 WebGL 失败时使用同一输入表面的 2.5D 版本。'}
        </p>
        <Link href="/#memory-keys">{en ? 'Explore Memory Keys' : '探索记忆键帽'} ↗</Link>
      </HowItWorks>
    </section>
  );
}
