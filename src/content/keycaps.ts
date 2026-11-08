export type KeyStyle = 'circuit' | 'display' | 'document' | 'signal' | 'resume' | 'code' | 'server';
export type KeyItem = {
  id: string;
  href: string;
  label: string;
  description: string;
  style: KeyStyle;
  external?: boolean;
};
export const memoryPresentation = [
  { id: 'kaian', slug: 'kaian', style: 'circuit', description: '连接工具，也连接业务中的环节。' },
  {
    id: 'sunyedisplay',
    slug: 'sunyedisplay',
    style: 'display',
    description: '从产品本身，到被看见的方式。',
  },
  { id: 'crgas', slug: 'cr-gas', style: 'document', description: '在文书与工作记录中积累经验。' },
  {
    id: 'unicom',
    slug: 'china-unicom',
    style: 'signal',
    description: '通信业务环境中的短期实习。',
  },
] as const;
export const memoryKeys: KeyItem[] = memoryPresentation.map((p, i) => ({
  id: p.id,
  href: '/experience/' + p.slug,
  label: `实习 ${i + 1}`,
  description: p.description,
  style: p.style,
}));
export const dockKeys: KeyItem[] = [
  { id: 'resume', href: '/resume', label: 'Resume', description: '完整个人简历', style: 'resume' },
  {
    id: 'github',
    href: 'https://github.com/marsyuzhe',
    label: 'GitHub',
    description: '开源项目与仓库',
    style: 'code',
    external: true,
  },
  {
    id: 'servers',
    href: '/community',
    label: 'Game Servers',
    description: '游戏与社区入口',
    style: 'server',
  },
];
export const keyColors: Record<KeyStyle, string> = {
  circuit: '#43505b',
  display: '#bdd0da',
  document: '#78838e',
  signal: '#90a4b4',
  resume: '#9cabb6',
  code: '#414d59',
  server: '#8c9ea9',
};
