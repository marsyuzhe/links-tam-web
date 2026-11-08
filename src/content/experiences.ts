export type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  relationship: string;
  duties: string[];
  sourceNote: string;
  reviewStatus?: 'needs_review';
  related?: { label: string; href: string }[];
};
// Public narrative only. Original proof files, contacts and disputed history remain private.
export const experiences: Experience[] = [
  {
    id: 'sunyedisplay',
    company: '三叶展示 / Sunyedisplay',
    role: '数字内容与产品视觉项目',
    period: '2026.09 起',
    relationship: '项目协作',
    duties: [
      '围绕展示器材制作产品白底图、场景图，并整理产品信息。',
      '规划工厂主理人 IP 短视频、双语内容与多平台传播方案。',
      '整理产品手册、辅助展示视觉与交付模板，按实物、标识和参数校对。',
    ],
    sourceNote: '将产品信息、视觉表达与实际交付衔接起来，形成清晰、一致的内容。',
    related: [{ label: '产品视觉与数字内容', href: '/projects#sunyedisplay' }],
  },
  {
    id: 'kaian',
    company: '江门市凯岸电商有限责任公司',
    role: '总技术负责人 · AI 工作流与系统集成',
    period: '2026.06—2026.12',
    relationship: '技术统筹与项目交付',
    duties: [
      '参与跨境电商选品、商品分析与内容制作，梳理达人沟通、供应链、采购与利润空间。',
      '围绕商品图片、文案、脚本、分镜与视频生成设计 AI 工作流，规划可复用的批量内容生产流程。',
      '推进 n8n、ComfyUI、LLM API 与 Web 工具的方案验证、系统集成及 Linux / Docker 服务部署。',
      '承担需求拆解、技术选型、成本评估、MVP 规划、外包沟通与交付验收说明。',
      '参与店铺运营 SOP 与内容交付模板建设，将业务步骤整理为可执行流程。',
    ],
    sourceNote: '从业务需求到工具集成、部署与交接，让技术方案服务于日常工作。',
    related: [
      { label: 'AI Commerce Video Agent', href: '/projects/commerce-video-agent' },
      { label: '企业 AI Workspace', href: '/projects#enterprise-workspace' },
    ],
  },
  {
    id: 'crgas',
    company: '华润燃气江门分公司',
    role: '实习生 · 文书处理',
    period: '2023.11—2023.12',
    relationship: '一个月短期实习',
    duties: ['协助处理日常文书与基础行政材料。', '整理文件和工作记录，保持资料清晰、便于查找。'],
    sourceNote: '在日常文书与资料整理中，熟悉职场协作和基础行政工作的节奏。',
  },
  {
    id: 'unicom',
    company: '中国联通江门分公司',
    role: '实习生 · 文书处理',
    period: '一个月',
    relationship: '短期实习',
    duties: ['协助处理日常文书与基础行政材料。', '在通信业务环境中整理文件与工作记录。'],
    sourceNote: '以简单、细致的文书工作，积累基础行政与团队协作经验。',
  },
];
