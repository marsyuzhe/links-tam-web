import { profile } from '@/content/profile';
import type { ReactNode } from 'react';
import { Code2, PenTool, Rocket } from 'lucide-react';

/** Shared About content: used by the desktop scene (About.tsx) and the mobile stories. */

export const pillars = [
  { Icon: PenTool, title: 'Understand', text: '从实际需求出发，理清业务输入与人的操作习惯。' },
  {
    Icon: Code2,
    title: 'Build',
    text: '使用 AI 辅助编程与开源工具，把想法变为可调整的软件和工作流。',
  },
  { Icon: Rocket, title: 'Iterate', text: '通过真实运行、测试和迭代确认工具能解决什么问题。' },
];

export const strengths = profile.strengths;
export const stack = [
  { slug: 'python', name: 'Python' },
  { slug: 'pyside6', name: 'PySide6', invert: false },
  { slug: 'n8n', name: 'n8n' },
  { slug: 'typescript', name: 'TypeScript' },
];

// Editor colours are fixed (code editors stay dark in both themes).
const K = ({ children }: { children: ReactNode }) => (
  <span className="text-[#b4d5e6]">{children}</span>
);
const V = ({ children }: { children: ReactNode }) => (
  <span className="text-[#b8c6cf]">{children}</span>
);
const P = ({ children }: { children: ReactNode }) => (
  <span className="text-[#6b7280]">{children}</span>
);
const S = ({ children }: { children: ReactNode }) => (
  <span className="text-[#cba289]">{children}</span>
);
const key = (k: string) => <span className="text-[#b8d9eb]">{k}</span>;

/** One line of code per piece of the profile card it renders. */
export const LINES: ReactNode[] = [
  <>
    <K>const</K> <V>links</V> <P>=</P> <P>{'{'}</P>
  </>,
  <>
    {'  '}
    {key('role')}
    <P>:</P> <S>&quot;{profile.role}&quot;</S>
    <P>,</P>
  </>,
  <>
    {'  '}
    {key('background')}
    <P>:</P> <S>&quot;{profile.backgroundEn}&quot;</S>
    <P>,</P>
  </>,
  <>
    {'  '}
    {key('strengths')}
    <P>: [</P>
    <S>&quot;AI Apps&quot;</S>
    <P>, </P>
    <S>&quot;Automation&quot;</S>
    <P>, </P>
    <S>&quot;Open Source&quot;</S>
    <P>],</P>
  </>,
  <>
    {'  '}
    {key('stack')}
    <P>: [</P>
    <S>&quot;Python&quot;</S>
    <P>, </P>
    <S>&quot;PySide6&quot;</S>
    <P>, </P>
    <S>&quot;n8n&quot;</S>
    <P>, </P>
    <S>&quot;TS&quot;</S>
    <P>],</P>
  </>,
  <>
    {'  '}
    {key('motto')}
    <P>:</P> <S>&quot;{profile.mottoEn}&quot;</S>
    <P>,</P>
  </>,
  <>
    <P>{'}'}</P>
  </>,
];
