export type MediaItem = {
  id: string;
  src: string;
  caption: string;
  purpose: string;
  width: number;
  height: number;
  sourceUrl: string;
  repo: string;
  commit: string;
};
export const projectMedia: MediaItem[] = [
  {
    id: 'manga-workspace',
    src: '/assets/projects/manga-workspace.webp',
    caption: '漫画翻译工作台 · 合成演示素材',
    purpose: 'Real Product Screenshot',
    width: 1366,
    height: 768,
    sourceUrl:
      'https://github.com/marsyuzhe/links-manga-studio/blob/b13d79a31da28e310557617e0c93eca965806076/docs/images/workspace-dark.png',
    repo: 'links-manga-studio',
    commit: 'b13d79a31da28e310557617e0c93eca965806076',
  },
  {
    id: 'manga-translation',
    src: '/assets/projects/manga-translation.webp',
    caption: '翻译中心 · 仓库演示素材',
    purpose: 'Real Product Screenshot',
    width: 1366,
    height: 768,
    sourceUrl:
      'https://github.com/marsyuzhe/links-manga-studio/blob/b13d79a31da28e310557617e0c93eca965806076/docs/images/translation-center.png',
    repo: 'links-manga-studio',
    commit: 'b13d79a31da28e310557617e0c93eca965806076',
  },
  {
    id: 'ledger-dashboard',
    src: '/assets/projects/ledger-dashboard.webp',
    caption: '本地记账仪表盘 · 演示数据',
    purpose: 'Real Product Screenshot',
    width: 1823,
    height: 863,
    sourceUrl:
      'https://github.com/marsyuzhe/RealtimeLedger/blob/b23593b3cecc671689377a94ce895caad85082bc/docs/images/dashboard-landscape.png',
    repo: 'RealtimeLedger',
    commit: 'b23593b3cecc671689377a94ce895caad85082bc',
  },
  {
    id: 'kado-dashboard',
    src: '/assets/projects/kado-dashboard.webp',
    caption: 'KADO Desk Windows 工作台 · 合成演示数据',
    purpose: 'Real Product Screenshot',
    width: 1600,
    height: 900,
    sourceUrl:
      'https://github.com/marsyuzhe/kado-workspace/blob/f0258b1f66ea02888bf2e3c7bc73d346cf2c8846/docs/images/01_dashboard.png',
    repo: 'kado-workspace',
    commit: 'f0258b1f66ea02888bf2e3c7bc73d346cf2c8846',
  },
  {
    id: 'kado-office',
    src: '/assets/projects/kado-office.webp',
    caption: 'Pixel Office · 本地演示角色与任务',
    purpose: 'Real Product Screenshot',
    width: 1600,
    height: 900,
    sourceUrl:
      'https://github.com/marsyuzhe/kado-workspace/blob/f0258b1f66ea02888bf2e3c7bc73d346cf2c8846/docs/images/04_pixel_office.png',
    repo: 'kado-workspace',
    commit: 'f0258b1f66ea02888bf2e3c7bc73d346cf2c8846',
  },
  {
    id: 'audio-dark',
    src: '/assets/projects/audio-dark.webp',
    caption: 'Links Audio 转换队列 · 无语音合成样本',
    purpose: 'Real Product Screenshot',
    width: 1040,
    height: 791,
    sourceUrl:
      'https://github.com/marsyuzhe/Voice-Audio-Converter/blob/3dc869e2ee5e45aebcf76d6bd25512456a256b65/docs/screenshots/main-dark.png',
    repo: 'Voice-Audio-Converter',
    commit: '3dc869e2ee5e45aebcf76d6bd25512456a256b65',
  },
  {
    id: 'audio-light',
    src: '/assets/projects/audio-light.webp',
    caption: 'Links Audio 浅色模式 · 通用演示路径',
    purpose: 'Real Product Screenshot',
    width: 820,
    height: 700,
    sourceUrl:
      'https://github.com/marsyuzhe/Voice-Audio-Converter/blob/3dc869e2ee5e45aebcf76d6bd25512456a256b65/docs/screenshots/main-light.png',
    repo: 'Voice-Audio-Converter',
    commit: '3dc869e2ee5e45aebcf76d6bd25512456a256b65',
  },
  {
    id: 'roomfit-plan',
    src: '/assets/projects/roomfit-plan.webp',
    caption: 'RoomFit 3D 二维户型编辑',
    purpose: 'Real Product Screenshot',
    width: 1520,
    height: 980,
    sourceUrl:
      'https://github.com/marsyuzhe/RoomFit3D/blob/fbe1a6521473acbd1e1ff346ae62db9b86f98b82/docs/media/screenshots/plan-2d.png',
    repo: 'RoomFit3D',
    commit: 'fbe1a6521473acbd1e1ff346ae62db9b86f98b82',
  },
  {
    id: 'roomfit-gaming',
    src: '/assets/projects/roomfit-gaming.webp',
    caption: 'RoomFit 3D 电竞空间三维预览',
    purpose: 'Real Product Screenshot',
    width: 1520,
    height: 980,
    sourceUrl:
      'https://github.com/marsyuzhe/RoomFit3D/blob/fbe1a6521473acbd1e1ff346ae62db9b86f98b82/docs/media/screenshots/gaming-3d.png',
    repo: 'RoomFit3D',
    commit: 'fbe1a6521473acbd1e1ff346ae62db9b86f98b82',
  },
];
