import { profile } from './profile';
const dictionary: Record<string, string> = {
  '这里展示我的软件、AI 工作流与数字创作实践。欢迎在 GitHub 查看我的公开项目。':
    'Explore my software, AI workflows and digital creations on GitHub.',
  正式简历: 'Professional resume',
  聊聊想法: 'Let’s talk',
  查看简历: 'Preview CV',

  '© 2026 Links Tam / 谭文睿': '© 2026 Links Tam / Tan Wenrui',
  联系: 'Contact',
  '相关实践：': 'Related work: ',

  [profile.headline]: 'From real problems to practical tools and expressive experiences.',
  [profile.short]:
    "I'm Links Tam. My work started with cross-border commerce and grew into AI automation, software development and creative technology. I study existing open-source solutions and adapt them into tools that fit the people using them.",
  [profile.story]:
    'It began with everyday problems in product content, media and business processes. I started connecting workflows, models, software and servers, then built my own manga translation workspace, toolbox and other independent applications.',
  [profile.mobileStory]:
    'Everyday problems in commerce led me to connect workflows, models and software—and to build my own manga translation workspace and toolbox. Making technology fit people is where it begins.',
  [profile.motto]: 'Technology should adapt to people.',
  'AI 应用 / 独立软件 / 数字创作': 'AI applications / Independent software / Digital creation',
  '从使用工具，': 'From using tools,',
  '到为自己制作工具。': 'to building my own.',
  '跨境电子商务背景。喜欢使用 AI 辅助编程、改造开源项目，制作适应生活与工作需求的软件。':
    'A background in cross-border commerce. I use AI-assisted development and open source to build software around everyday needs.',
  '原创 IP 概念，并非真实面貌复刻。': 'An original fictional character, not a portrait.',
  '查看正式简历 ↗': 'Read my resume ↗',
  '查看完整经历 ↗': 'Read my experience ↗',
  '完整简历 ↗': 'Full resume ↗',
  '从实际需求出发，理清业务输入与人的操作习惯。':
    'Understand the real need, business inputs and the way people work.',
  '使用 AI 辅助编程与开源工具，把想法变为可调整的软件和工作流。':
    'Turn ideas into adaptable software and workflows with AI-assisted development and open source.',
  '通过真实运行、测试和迭代确认工具能解决什么问题。':
    'Run, test and refine the tools to understand what they can actually solve.',
  '把反复的操作，': 'Turn repetitive tasks',
  '做成自己的工作台。': 'into a workspace of your own.',
  '从漫画排版开始，探索我的作品 ↓': 'Start with manga typesetting. Explore the work below ↓',
  '浏览全部项目档案 ↗': 'Browse all projects ↗',
  '从漫画排版、电商视频工作流到个人工具。项目状态按已有资料标注，艺术封面不作为产品截图。':
    'Manga typesetting, commerce video workflows and personal tools. Real interfaces and concept artwork are clearly distinguished.',
  艺术封面: 'Concept artwork',
  'Explore case': 'Explore case',
  '我的工具与实践领域。研究、工具验证与实践分别标注，不统一宣称精通。':
    'Tools and areas I work with. Project use, experiments and ongoing research are distinguished.',
  '视频生成 · 实践': 'Video generation · Practice',
  'Android · 探索': 'Android · Exploration',
  商品内容: 'Product content',
  双语素材: 'Bilingual content',
  短视频: 'Short video',
  'Remotion · 工具验证': 'Remotion · Experiments',
  开源改造: 'Open-source adaptation',
  'AI 辅助编程': 'AI-assisted development',
  'Aseprite · 研究': 'Aseprite · Research',
  '这里展示我的软件、AI 工作流与数字创作实践。可以在 GitHub 查看我的公开项目。对外邮箱及其他联系方式仍待本人确认。':
    'Explore my software, AI workflows and digital creations. Public projects are available on GitHub.',
  联系方式: 'Get in touch',
  '正式简历 / 联系资料待确认': 'Professional resume',
  '在 GitHub 查看作品 ↗': 'Explore my work on GitHub ↗',
  个人简历: 'Resume',
  开源项目: 'Open source',
  游戏服务器: 'Game servers',
  '代码是起点。滑动，探索我的实践 →': 'Code is a starting point. Swipe to explore →',
  '按下，看看我走过的地方。': 'Press a key. Discover a chapter.',
  '四枚键帽，四段记忆。': 'Four keys. Four memories.',
  '完整个人简历 ↗': 'Full resume ↗',
  '经历，让想法落地。': 'Experience brings ideas to life.',
  'AI 应用 · 独立软件 · 数字创作': 'AI applications · Independent software · Digital creation',
  '跨境电子商务专业背景。': 'A background in cross-border e-commerce.',
  业务与内容: 'Business & content',
  实际实践: 'Practice',
  'AI 与自动化': 'AI & automation',
  项目使用: 'Project experience',
  软件与交互: 'Software & interaction',
  系统与创作: 'Infrastructure & creation',
  '实践 / 研究': 'Practice / Research',
  '商品内容、视频脚本、双语素材、B2B 产品视觉与业务需求梳理。':
    'Product content, video scripts, bilingual media, B2B visuals and requirements.',
  'n8n、ComfyUI、LLM API 与内容生产工作流；Agent 架构持续研究。':
    'n8n, ComfyUI, LLM APIs and content workflows; ongoing research into agents.',
  'Python / PySide6、TypeScript / React / Next.js、Android 工程与开源改造。':
    'Python / PySide6, TypeScript / React / Next.js, Android and open-source adaptation.',
  'Linux、Docker、服务集成；Remotion、像素创作与交互动画。':
    'Linux, Docker and service integration; Remotion, pixel art and interactive animation.',
};
export function translateText(s: string) {
  return dictionary[s] ?? s;
}
