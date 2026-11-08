export type WorldId = 'minecraft' | 'terraria' | 'project-zomboid';
export type Mod = {
  name: string;
  state: 'planned' | 'enabled' | 'compatibility' | 'removed';
  version: string | null;
  gameVersion: string | null;
  dependencies: string[];
  purpose: [string, string];
  source: string;
};
export type World = {
  id: WorldId;
  name: string;
  title: [string, string];
  intro: [string, string];
  accent: string;
  loader: string | null;
  version: string | null;
  modpackVersion: string | null;
  address: string | null;
  joinEnabled: boolean;
  lanes: { title: [string, string]; text: [string, string]; mods: Mod[] }[];
};
export const worlds: World[] = [
  {
    id: 'minecraft',
    name: 'Minecraft',
    title: ['大复活时代', 'Revival Era'],
    intro: [
      '让机械运转，让冒险发生。与朋友一起搭建一个逐渐生长的世界。',
      'Automation, adventure and a world built together.',
    ],
    accent: '#a9c5b4',
    loader: null,
    version: null,
    modpackVersion: null,
    address: null,
    joinEnabled: false,
    lanes: [
      {
        title: ['机械自动化', 'Mechanical automation'],
        text: [
          '规划以生产线与机械装置连接资源、加工和建造。',
          'A planned route connecting resources, processing and construction.',
        ],
        mods: [
          {
            name: 'Create',
            state: 'planned',
            version: null,
            gameVersion: null,
            dependencies: [],
            purpose: [
              '机械动力与自动化方向；尚未确认安装。',
              'Mechanical automation direction; not confirmed installed.',
            ],
            source: 'https://github.com/Creators-of-Create/Create',
          },
        ],
      },
      {
        title: ['冒险与建造', 'Adventure & building'],
        text: [
          '探索、生存、建筑与任务引导的组合，整合清单尚未配置。',
          'Exploration, survival, building and quest guidance; pack not configured.',
        ],
        mods: [],
      },
      {
        title: ['共同创造', 'Build together'],
        text: [
          '共同规划基地、分工建设；具体服务器规则将在开放前发布。',
          'Plan bases and build together. Server rules will be published before opening.',
        ],
        mods: [],
      },
    ],
  },
  {
    id: 'terraria',
    name: 'Terraria',
    title: ['灾厄探索', 'Calamity Expedition'],
    intro: [
      '从第一次探索到更有挑战的战斗。围绕成长、收集与协作规划旅程。',
      'A planned journey of exploration, growth, collecting and cooperative challenges.',
    ],
    accent: '#bba5d0',
    loader: null,
    version: null,
    modpackVersion: null,
    address: null,
    joinEnabled: false,
    lanes: [
      {
        title: ['启程与准备', 'Prepare & explore'],
        text: [
          '规划探索地形、收集资源、建立基础补给。这里展示路线，不代表服务器已完成进度。',
          'Plan exploration, resources and supplies. This is a route, not live server progress.',
        ],
        mods: [
          {
            name: 'Calamity',
            state: 'planned',
            version: null,
            gameVersion: null,
            dependencies: [],
            purpose: [
              '灾厄主线与角色成长；依赖和版本需随实际整合包确定。',
              'Calamity progression; dependencies and versions follow the eventual pack.',
            ],
            source: 'https://github.com/CalamityTeam/CalamityModPublic',
          },
        ],
      },
      {
        title: ['装备与挑战', 'Equipment & challenges'],
        text: [
          '为多人 Boss 战斗准备装备与分工；不显示虚构击杀记录。',
          'Prepare equipment and roles for cooperative boss encounters. No kill records are claimed.',
        ],
        mods: [],
      },
      {
        title: ['扩展与兼容', 'Expansion & compatibility'],
        text: [
          'Infernum 仅作为可选研究方向，未确认启用；需要验证多人兼容性。',
          'Infernum is an optional research direction, not enabled; multiplayer compatibility needs testing.',
        ],
        mods: [],
      },
    ],
  },
  {
    id: 'project-zomboid',
    name: 'Project Zomboid',
    title: ['共同生存', 'Survive Together'],
    intro: [
      '先活下来，再一起重建。关注物资、基地与长期合作的末日生存方向。',
      'Survive first. Rebuild together through resources, bases and long-term cooperation.',
    ],
    accent: '#c3b39b',
    loader: null,
    version: null,
    modpackVersion: null,
    address: null,
    joinEnabled: false,
    lanes: [
      {
        title: ['初期生存', 'First days'],
        text: [
          '规划以食物、饮水与安全落脚点开始合作；具体规则未发布。',
          'Plan food, water and a safe base. Server-specific rules have not been published.',
        ],
        mods: [],
      },
      {
        title: ['基地与资源', 'Bases & resources'],
        text: [
          '规划共同储备物资、维护基地和探索交通线路。地图及存档尚未配置。',
          'Plan shared supplies, base maintenance and routes. Maps and saves are not configured.',
        ],
        mods: [],
      },
      {
        title: ['模组与合作', 'Mods & cooperation'],
        text: [
          '载具、生活与地图扩展为候选类别，不代表任何具体模组已安装。',
          'Vehicles, quality of life and maps are candidate categories, not installed mods.',
        ],
        mods: [],
      },
    ],
  },
];
export type Announcement = {
  id: string;
  world: WorldId;
  title: [string, string];
  summary: [string, string];
  body: [string, string];
  publishedAt: string;
  priority: 'normal' | 'important';
  state: 'published' | 'withdrawn' | 'expired';
};
export type CommunityEvent = {
  id: string;
  world: WorldId;
  title: [string, string];
  startsAt: string | null;
  rules: [string, string];
  registration: 'closed' | 'open';
  state: 'planned' | 'published' | 'cancelled';
};
export type WorldScreenshot = {
  id: string;
  world: WorldId;
  src: string;
  caption: [string, string];
  source: string;
  kind: 'screenshot' | 'concept';
  approved: boolean;
};
export const announcements: Announcement[] = [];
export const communityEvents: CommunityEvent[] = [];
export const worldScreenshots: WorldScreenshot[] = [];
