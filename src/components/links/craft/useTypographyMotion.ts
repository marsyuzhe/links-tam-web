'use client';
import { useRef, useState, type PointerEvent } from 'react';
import { gsap, useGSAP, SplitText } from '@/lib/gsap';
import { motion } from '@/lib/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';

export type TypeAction = 'reveal' | 'reassemble' | 'reset';
export function useTypographyMotion() {
  const root = useRef<HTMLDivElement>(null),
    letters = useRef<HTMLElement[]>([]),
    timeline = useRef<gsap.core.Timeline | null>(null),
    frame = useRef(0);
  const [action, setAction] = useState<TypeAction>('reset');
  const reduced = useMotionPreference();
  useGSAP(
    () => {
      const phrase = root.current?.querySelector('.craft-type-phrase');
      if (!phrase || reduced) return;
      const split = SplitText.create(phrase, {
        type: 'chars',
        charsClass: 'craft-letter',
        mask: 'chars',
      });
      letters.current = split.chars as HTMLElement[];
      letters.current.forEach((letter, index) => {
        letter.dataset.craftOrder = String(index);
      });
      return () => {
        cancelAnimationFrame(frame.current);
        timeline.current?.kill();
        gsap.killTweensOf(split.chars);
        letters.current = [];
        split.revert();
      };
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  function play(next: TypeAction) {
    setAction(next);
    timeline.current?.kill();
    cancelAnimationFrame(frame.current);
    const signature = root.current?.querySelector('.craft-type-signature');
    if (!signature) return;
    gsap.killTweensOf(letters.current);
    if (reduced) return;
    gsap.set(letters.current, { x: 0, y: 0, yPercent: 0, rotation: 0, opacity: 1 });
    gsap.set(signature, { clearProps: 'clipPath' });
    const sequence = gsap.timeline();
    timeline.current = sequence;
    if (next === 'reveal') {
      sequence
        .fromTo(
          letters.current,
          { yPercent: 110 },
          { yPercent: 0, duration: motion.reveal, stagger: 0.045, ease: 'expo.out' },
        )
        .fromTo(
          signature,
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power2.inOut' },
          0.2,
        );
    } else if (next === 'reassemble') {
      sequence
        .to(letters.current, {
          yPercent: 110,
          rotation: (_, el) => (Number(el.dataset.craftOrder ?? 0) % 2 ? 8 : -8),
          duration: 0.28,
          stagger: 0.025,
          ease: 'power2.in',
        })
        .set(letters.current, { rotation: 0 })
        .to(letters.current, {
          yPercent: 0,
          duration: 0.65,
          stagger: { each: 0.055, from: 'center' },
          ease: 'expo.out',
        });
    } else {
      gsap.set(letters.current, { clearProps: 'transform,opacity' });
      gsap.set(signature, { clearProps: 'clipPath' });
    }
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== 'mouse' || timeline.current?.isActive()) return;
    const pointerX = event.clientX;
    cancelAnimationFrame(frame.current);
    // A single scheduled update owns each letter's transform; CSS never animates this layer.
    frame.current = requestAnimationFrame(() =>
      letters.current.forEach((letter) => {
        // Use the stationary mask, not the animated glyph, for pointer distance.
        const rect = (letter.parentElement ?? letter).getBoundingClientRect(),
          distance = pointerX - rect.left - rect.width / 2,
          strength = Math.max(0, 1 - Math.abs(distance) / 150);
        gsap.to(letter, {
          y: -12 * strength,
          rotation: distance * 0.04 * strength,
          duration: 0.24,
          ease: 'power3.out',
          overwrite: true,
        });
      }),
    );
  }
  function leave() {
    cancelAnimationFrame(frame.current);
    if (!timeline.current?.isActive())
      gsap.to(letters.current, { y: 0, rotation: 0, duration: 0.3, overwrite: true });
  }
  return { root, action, play, move, leave };
}
