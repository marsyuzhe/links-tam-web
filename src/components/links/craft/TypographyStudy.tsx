'use client';
import Image from 'next/image';
import { LocaleLink as Link, useLocale } from '../Locale';
import { HowItWorks } from './HowItWorks';
import { useTypographyMotion, type TypeAction } from './useTypographyMotion';

export function TypographyStudy() {
  const { locale } = useLocale(),
    en = locale === 'en';
  const type = useTypographyMotion();
  const controls: { action: TypeAction; label: string }[] = [
    { action: 'reveal', label: en ? 'Reveal' : '揭示' },
    { action: 'reassemble', label: en ? 'Reassemble' : '重组' },
    { action: 'reset', label: en ? 'Reset' : '复原' },
  ];
  return (
    <section className="craft-section" id="craft-type">
      <header className="craft-section-heading">
        <h2>{en ? 'Type, with a pulse.' : '文字，也有触感。'}</h2>
        <p>
          {en
            ? 'Move across the letters. Then give them a fresh start.'
            : '划过字母，再试着让它们重新出现。'}
        </p>
      </header>
      <div
        ref={type.root}
        className="craft-type-stage"
        data-action={type.action}
        onPointerMove={type.move}
        onPointerLeave={type.leave}
      >
        <p className="craft-type-phrase">Links Tam</p>
        <Image
          className="craft-type-signature"
          src="/assets/brand/Links-signature.png"
          width={500}
          height={328}
          alt={en ? 'Original Links signature' : 'Links 原始签名'}
        />
      </div>
      <div className="craft-controls" aria-label={en ? 'Typography controls' : '文字交互控制'}>
        {controls.map((control) => (
          <button
            key={control.action}
            aria-pressed={type.action === control.action}
            onClick={() => type.play(control.action)}
          >
            {control.label}
            <span aria-hidden="true"> ↗</span>
          </button>
        ))}
      </div>
      <HowItWorks>
        <p>
          {en
            ? 'SplitText separates the name into accessible character masks. Pointer movement is limited to a small lift and tilt; the controls replay or reassemble the reveal.'
            : 'SplitText 将姓名分为可访问的字符蒙版。指针只触发小幅抬起和倾斜；按钮控制揭示、局部重组与复原。'}
        </p>
        <p>
          {en
            ? 'The signature is the original PNG revealed by a mask, not a reconstruction of handwriting. With reduced motion, controls change state immediately. Timelines and pointer frames are cleaned up on exit.'
            : '签名使用原始 PNG 的蒙版揭示，不是笔迹轨迹复刻。减少动态效果时切换为即时状态；离开页面会清理时间轴与指针帧。'}
        </p>
        <Link href="/">{en ? 'Back to the portfolio' : '回到个人主页'} ↗</Link>
      </HowItWorks>
    </section>
  );
}
