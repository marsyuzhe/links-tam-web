// Public editorial content distilled from the user-provided final resume.
// Contacts, account procedures and private operational details are intentionally excluded.
export const resumeEditorial = {
  intro: [
    '我从跨境电商的具体业务问题出发，逐渐把工作延伸到 AI 应用、产品方案与软件工具。我习惯先拆清需求，再组织模型、API 与工作流，推进原型、部署验证和交付；也在意产品的设计、交互与日常使用体验。',
    'I started with practical problems in cross-border commerce and expanded into AI applications, product design and software tools. I clarify requirements, connect models, APIs and workflows, then work through prototypes, deployment validation and handover—with equal care for design and everyday usability.',
  ],
  focus: [
    'AI 应用落地 · AI 产品与解决方案 · 跨境电商自动化',
    'AI applications · Product & solution design · Commerce automation',
  ],
  method: [
    '把业务问题，转化为可执行的产品与技术方案。',
    'Turning business problems into actionable product and technical plans.',
  ],
  businessSlugs: [
    'commerce-video-agent',
    'enterprise-workspace',
    'video-backend-rfp',
    'comfy-local',
  ],
  capabilities: [
    {
      name: ['AI 应用与工作流', 'AI applications & workflows'],
      text: [
        '组合 LLM、API、n8n 与 ComfyUI，将内容任务组织为可复用流程。',
        'Connect LLMs, APIs, n8n and ComfyUI into reusable content workflows.',
      ],
      project: 'commerce-video-agent',
    },
    {
      name: ['产品与解决方案', 'Product & solution design'],
      text: [
        '需求拆解、MVP 设计、技术选型、成本比较与交付验收。',
        'Requirements, MVP design, technology choices, cost comparison and acceptance criteria.',
      ],
      project: 'enterprise-workspace',
    },
    {
      name: ['跨境电商业务', 'Cross-border commerce'],
      text: [
        '选品、商品数据、内容与达人沟通，以及采购、供应链和利润空间分析。',
        'Product selection, data, content, influencer outreach, sourcing and margin analysis.',
      ],
      project: 'commerce-video-agent',
    },
    {
      name: ['项目统筹与协作', 'Project coordination'],
      text: [
        '拆分技术任务、沟通外包与交付边界，在业务与研发之间澄清需求。',
        'Break down tasks, coordinate external development and clarify delivery boundaries.',
      ],
      project: 'video-backend-rfp',
    },
    {
      name: ['部署与技术验证', 'Deployment & validation'],
      text: [
        'Linux、Docker、Nginx 与本地 AI 工作流部署，关注性能、成本和运维边界。',
        'Linux, Docker, Nginx and local AI deployment, with attention to performance, cost and maintenance.',
      ],
      project: 'comfy-local',
    },
    {
      name: ['软件与交互实践', 'Software & interaction'],
      text: [
        '使用 AI 辅助开发与开源工具，制作桌面工作台、Web 页面和个人软件。',
        'Build desktop workspaces, web experiences and personal tools with AI-assisted development and open source.',
      ],
      project: 'manga-studio',
    },
  ],
} as const;
