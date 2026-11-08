export const EMAIL = '联系方式待本人确认';
export const CV_PATH = '/api/resume/file';
export const socials = {
  linkedin: '/resume',
  github: 'https://github.com/marsyuzhe',
  email: '/#contact',
};
export const navItems = ['About', 'Projects', 'Skills', 'Community', 'Contact'] as const;
export const roles = [
  'Creative Technologist',
  'Independent Creator',
  'AI Application Builder',
  'Digital Maker',
];
export type { Project } from '@/content/projects';
export { featuredProjects as projects } from '@/content/projects';
export const skillClusters = [
  {
    title: 'AI & Automation',
    accent: 'from-blue-500/30 to-cyan-400/5',
    items: ['n8n', 'ComfyUI', 'LLM APIs', '视频生成 · 实践'],
  },
  {
    title: 'Software Development',
    accent: 'from-blue-500/30 to-cyan-400/5',
    items: ['Python', 'PySide6', 'OCR', 'Android · 探索'],
  },
  {
    title: 'Web & Interaction',
    accent: 'from-blue-500/30 to-cyan-400/5',
    items: ['TypeScript', 'React', 'Next.js', 'GSAP'],
  },
  {
    title: 'Infrastructure',
    accent: 'from-blue-500/30 to-cyan-400/5',
    items: ['Docker', 'Linux', 'Cloud Servers', 'API Integration'],
  },
  {
    title: 'Creative Media',
    accent: 'from-blue-500/30 to-cyan-400/5',
    items: ['商品内容', '双语素材', '短视频', 'Remotion · 工具验证'],
  },
  {
    title: 'Open Source',
    accent: 'from-blue-500/30 to-cyan-400/5',
    items: ['Git', '开源改造', 'AI 辅助编程', 'Aseprite · 研究'],
  },
];
export const techIcons: { slug: string; name: string; variant?: string }[] = [
  {
    slug: 'python',
    name: 'Python',
  },
  {
    slug: 'pyside6',
    name: 'PySide6',
  },
  {
    slug: 'n8n',
    name: 'n8n',
  },
  {
    slug: 'comfyui',
    name: 'ComfyUI',
  },
  {
    slug: 'typescript',
    name: 'TypeScript',
  },
  {
    slug: 'react',
    name: 'React',
  },
  {
    slug: 'nextjs',
    name: 'Next.js',
  },
  {
    slug: 'gsap',
    name: 'GSAP',
  },
  {
    slug: 'docker',
    name: 'Docker',
  },
  {
    slug: 'linux',
    name: 'Linux',
  },
  {
    slug: 'git',
    name: 'Git',
  },
  {
    slug: 'ocr',
    name: 'OCR',
  },
];
export const deviconUrl = (slug: string, _variant = 'original') => {
  void _variant;
  return `/assets/tech/${slug}.svg`;
};
