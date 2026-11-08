import { projectArchive, type Project } from './projects';
// Editorial translations; identity, links, ownership flags and media stay in the shared archive.
const copy: Record<string, [string, string, string, string]> = {
  'manga-studio': [
    'Links Manga Studio',
    'A Windows manga translation and typesetting workspace, bringing import, OCR, translation and layout into a controlled workflow.',
    'Designed and integrated the desktop workflow, translation management, text replacement and layout interactions. Models and third-party components retain their own attribution.',
    'Repository screenshots use synthetic demonstration content. Installers have not been retested for this portfolio; language, OCR and layout coverage vary.',
  ],
  'commerce-video-agent': [
    'AI Commerce Video Agent',
    'A commerce video workflow connecting product assets, n8n, ComfyUI and generative models.',
    'Worked on AI workflow design, model and API orchestration, systems integration and development.',
    'The full production process is not claimed to be open source. Model services and commercial assets have separate usage terms.',
  ],
  'links-toolbox': [
    'Links Toolbox / KADO Desk',
    'A personal toolbox evolving into KADO Desk: bookmarks, developer tools, files, notes and a local pixel office.',
    'Developed the toolbox structure and KADO workspace experience. The repository retains Links Toolbox storage compatibility and licensing notes.',
    'Windows coverage is documented in the repository. Android builds lack device validation; iOS is unverified. AI, SSH and FFmpeg integrations require configuration.',
  ],
  'realtime-ledger': [
    'RealtimeLedger',
    'An Android ledger exploring payment notifications, duplicate detection and records awaiting user confirmation.',
    'Explored an Android workflow and local data handling for personal bookkeeping.',
    'Payment-app coverage varies. Notification permissions, recognition quality and background behaviour require device testing. No real bills are collected by this site.',
  ],
  'agent-gateway-next': [
    'Links Agent Gateway Next',
    'An open-source-based exploration of agent access, model aggregation, connection policies and console interaction.',
    'Explored interface adaptation, configuration and interaction on an open-source base.',
    'Upstream lineage and exact contributions require repository-level review; this is not presented as a wholly original commercial product.',
  ],
  'links-daily': [
    'Links Daily',
    'An Android concept combining daily schedules and habit-based check-ins.',
    'Explored requirements and prototypes.',
    'Stability, permissions and device coverage remain experimental.',
  ],
  'pixel-office': [
    'Links Studio / Pixel Agent Office',
    'A local pixel office and character interaction module inside KADO Desk.',
    'Organised the module, local characters and task interactions.',
    'A KADO module, not a separate completed product. External AI services are optional.',
  ],
  'context-manager': [
    'Personal AI OS / Context Manager',
    'Portable AI context packs and workflow documentation across models.',
    'Designed context structures, documentation and usage scenarios.',
    'Document packs and an automatic live-sync system represent different stages; this is not a finished cloud platform.',
  ],
  'links-audio': [
    'Links Audio · SILK Converter',
    'A Windows batch audio converter with import, queue, conversion and output workflows.',
    'Developed the C# / XAML application and audio pipeline integration, retaining component attribution.',
    'AMR-NB / WB output is currently unsupported. Format and preview compatibility follow the repository documentation.',
  ],
  packcheck: [
    'PackCheck / FinalCheck',
    'A workflow and naming concept for checking files before delivery.',
    'Planned requirements, naming and product direction.',
    'No verifiable source has been supplied; this remains a concept.',
  ],
  roomfit3d: [
    'RoomFit 3D',
    'A Windows room planner and local Cycles rendering pipeline extending openPlan3D.',
    'Extended sofa-length workflows, room types, furniture, door openings, packaging and high-quality rendering.',
    'The upstream editor and room algorithms are retained. Furniture dimensions need checking; the tool does not replace site measurement or construction drawings.',
  ],
  portfolio: [
    'Links Tam Portfolio',
    'This portfolio: an animated front end, reading pages and a factual project archive.',
    'Adapted the Sazzad Ali MIT-licensed foundation with personal content, media galleries, navigation and mobile reading.',
    'The earlier repository is archived. The current source snapshot is the authoritative local version; no deployment is implied.',
  ],
  'astrbot-terraria': [
    'AstrBot · Terraria Wiki',
    'An AstrBot plugin for Terraria Wiki lookups.',
    'Developed and maintained the plugin around lookup needs. Behaviour follows the repository version.',
    'Depends on AstrBot and third-party content sources.',
  ],
  'astrbot-earthmc': [
    'AstrBot · EarthMC VP',
    'An AstrBot plugin exploring EarthMC-related queries.',
    'Developed and maintained plugin features around external interfaces.',
    'External API availability is outside the portfolio’s control.',
  ],
  'astrbot-commands': [
    'AstrBot Command Conflict Investigation',
    'Notes on command organisation, conflicts and plugin debugging.',
    'Investigated issues and documented findings.',
    'This record comes from older materials; repository-level evidence is incomplete.',
  ],
  tieba: [
    'Tieba Automation Fork',
    'A Tieba-related open-source repository forked under my account.',
    'The fork relationship is established; personal code changes have not been attributed.',
    'Not presented as an independent original product. Automation outcomes are not guaranteed.',
  ],
  'actions-tasks': [
    'GitHub Actions Automation Experiments',
    'Platform-task experiments recorded in earlier materials.',
    'Collected automation approaches and usage notes.',
    'Workflow files, runs and platform rules require individual verification.',
  ],
  'my-life': [
    'My Life · Remotion Animation',
    'A creative direction for an animated series made with Remotion.',
    'Planned scripts, scenes and publishing workflow.',
    'No finished film or review clip is available to display.',
  ],
  'solo-ai-company': [
    'The AI Company Has Only Me',
    'A game design with story, event and character assets.',
    'Planned the story, events and asset structure.',
    'Design assets do not imply a completed playable game.',
  ],
  'beacon-plan': [
    'Lost Settlement · Beacon Plan',
    'A survival and building prototype direction using TapTap Maker.',
    'Explored game mechanics and prototype design.',
    'The available version and completed scope still need playtesting.',
  ],
  'science-animation': [
    'Science Animation Workflow',
    'Research into a mixed Remotion, Blender and local-tool animation workflow.',
    'Researched the pipeline and evaluated tools.',
    'Finished work and asset permissions are not yet available for presentation.',
  ],
  'pixel-animation': [
    'Story & Pixel Shorts',
    'Experiments in narrative shorts and pixel animation.',
    'Explored storytelling and animation workflows.',
    'Writing, storyboards and finished video are separate outputs; no finished video is claimed.',
  ],
  'revival-era': [
    'Revival Era',
    'A Minecraft / Terraria modpack concept and name.',
    'Designed modpack direction and naming.',
    'Compatibility and real gameplay require testing.',
  ],
  'community-worlds': [
    'Game Servers & Community Worlds',
    'Community entry pages for Minecraft, Terraria and Project Zomboid.',
    'Created page prototypes, status structures and navigation.',
    'Live servers are not connected and player counts are unknown.',
  ],
  sunyedisplay: [
    'Sunyedisplay · Product Visuals',
    'White-background and scene images, bilingual content and product materials for display equipment.',
    'Prepared product visuals, video plans and delivery templates.',
    'Customer originals, logos, models and internal materials remain private without permission.',
  ],
  'tim-live': [
    'Tim · Cloud / AI & Livestream Planning',
    'Commerce-brand and livestream planning recorded in March–April 2026.',
    'Planned brand communication and livestream content.',
    'Specific results and role boundaries are not asserted beyond the available planning record.',
  ],
  'sme-ai': [
    'AI Service Packages for Small Businesses',
    'AI consulting and technology proposals for B2B, education and local services.',
    'Analysed requirements, selected tools and wrote service proposals.',
    'Consulting proposals are distinguished from a functioning SaaS product.',
  ],
  'gas-industry': [
    'Gas Industry Digitalisation Research',
    'Background research on industry digitalisation and drone inspection.',
    'Collected and reviewed industry background materials.',
    'Industry research is separate from my administrative internship. No patents or team engineering achievements are attributed to me.',
  ],
  utopia: [
    'Project Utopia',
    'A long-term idea about open tools, knowledge sharing and community collaboration.',
    'Developed the concept and direction.',
    'An ongoing idea rather than a current website feature.',
  ],
  'jiangmen-market-drama': [
    'Jiangmen Market Drama',
    'A narrative game project inspired by everyday life in Jiangmen’s local markets.',
    'Worked on project organisation and narrative direction; code contributions follow the repository.',
    'The public repository has no verified media gallery, so no game assets are invented here.',
  ],
  'enterprise-workspace': [
    'Enterprise AI Workspace',
    'A workspace proposal for internal knowledge, SOPs, task collaboration and AI content tools.',
    'Analysed requirements, planned the MVP and explored integrations.',
    'Internal knowledge remains private. A proposal is not described as a launched SaaS service.',
  ],
  'video-backend-rfp': [
    'AI Video Platform · Backend RFP',
    'Backend requirements for video queues, payments and security.',
    'Defined scope, discussed procurement and coordinated technical proposals.',
    'An RFP and procurement discussion are distinct from an implemented backend.',
  ],
  'comfy-local': [
    'ComfyUI · Local AI Video System',
    'Experiments in a local video-generation environment and content workflow.',
    'Explored tool integration, environment setup and workflow evaluation.',
    'Device-specific results are not general performance benchmarks. Review media is not available.',
  ],
};
const stages: Record<string, string> = {
  公开工程: 'Public source',
  开发中: 'In development',
  原型: 'Prototype',
  子项目: 'Module',
  文档与方案: 'Documentation & proposal',
  构想: 'Concept',
  本地完成: 'Local implementation',
  创作记录: 'Creative study',
  设计稿: 'Design',
  研究: 'Research',
  项目协作: 'Collaboration',
  背景研究: 'Background research',
  资料研究: 'Research notes',
  资料与方案: 'Notes & proposal',
};
const ownership: Record<string, string> = {
  个人工程: 'Personal project',
  个人项目: 'Personal project',
  业务工作流与个人方案: 'Business workflow & personal design',
  'Links Toolbox / KADO 子模块': 'Links Toolbox / KADO module',
  '开源二次开发 · openPlan3D': 'Open-source adaptation · openPlan3D',
  '基于 Sazzad Ali MIT 源码': 'Based on Sazzad Ali · MIT',
  'Fork · 上游项目': 'Fork · upstream project',
  客户协作: 'Client collaboration',
  历史业务实践: 'Earlier business practice',
  服务方案: 'Service proposal',
  '行业背景 · 非个人研发成果': 'Industry background · no personal R&D claim',
  业务需求方案: 'Business requirements proposal',
  业务方案: 'Business proposal',
};
const workflow: Record<string, string[]> = {
  'manga-studio': [
    'Import images or PDFs',
    'Recognise and prepare source text',
    'Manage translations, erase and refill text',
    'Refine layouts and export',
  ],
  'commerce-video-agent': [
    'Organise product assets and requirements',
    'Draft scripts with language models',
    'Orchestrate generation and media processing',
    'Review, refine and export',
  ],
  'links-toolbox': [
    'Collect everyday tasks',
    'Organise tools into modules',
    'Configure local and optional services',
    'Test desktop workflows',
  ],
  'realtime-ledger': [
    'Parse notifications locally',
    'Detect duplicate records',
    'Ask for user confirmation',
    'Store and review entries',
  ],
  'agent-gateway-next': [
    'Study upstream interfaces',
    'Configure connections and policies',
    'Adapt console interactions',
    'Evaluate integration behaviour',
  ],
  'links-audio': [
    'Import audio',
    'Configure the conversion queue',
    'Run the local pipeline',
    'Inspect and export output',
  ],
  roomfit3d: [
    'Set room dimensions',
    'Arrange furniture and openings',
    'Prepare a scene',
    'Render locally with Cycles',
  ],
};
export const englishProjects: Project[] = projectArchive.map((p) => {
  const c = copy[p.slug];
  return {
    ...p,
    title: c[0],
    description: c[1],
    responsibility: c[2],
    boundary: c[3],
    ownership: ownership[p.ownership] ?? p.ownership,
    stage: stages[p.stage] ?? p.stage,
    status: stages[p.stage] ?? p.stage,
    evidence: p.github
      ? 'Public repository and project documentation'
      : 'Project notes and planning materials',
    why: c[1],
    process: workflow[p.slug] ?? [
      'Define the practical need',
      'Explore and document an approach',
      'Review the current scope',
    ],
  };
});
export const getProjects = (locale: 'zh' | 'en') =>
  locale === 'en' ? englishProjects : projectArchive;
