import { experiences, type Experience } from './experiences';
const english: Record<
  string,
  Pick<Experience, 'company' | 'role' | 'relationship' | 'duties' | 'sourceNote'>
> = {
  kaian: {
    company: 'Jiangmen Kaian E-commerce',
    role: 'Head of Technology · AI Workflows & Systems Integration',
    relationship: 'Technology leadership',
    duties: [
      'Worked on commerce product selection, data, content, influencer outreach, sourcing and margin analysis.',
      'Designed repeatable content workflows across product images, copy, scripts, storyboards and video generation.',
      'Validated and integrated n8n, ComfyUI, LLM APIs and web tools, with Linux and Docker deployment.',
      'Handled requirements, technology choices, cost evaluation, MVP planning, external development coordination and acceptance criteria.',
      'Contributed to store-operation procedures and content delivery templates.',
    ],
    sourceNote:
      'Connected business requirements with practical implementation, from content workflows to deployment and handover.',
  },
  sunyedisplay: {
    company: 'Sunyedisplay',
    role: 'Digital Content & Product Visuals',
    relationship: 'Project collaboration',
    duties: [
      'Created product visuals, white-background and scene images, and organised product information.',
      'Planned founder-led short videos, bilingual content and distribution.',
      'Prepared manuals, presentation visuals and reusable delivery templates, checking them against products and specifications.',
    ],
    sourceNote:
      'Brought product information, visual communication and practical delivery into one consistent process.',
  },
  crgas: {
    company: 'China Resources Gas · Jiangmen',
    role: 'Administrative Intern',
    relationship: 'One-month internship',
    duties: [
      'Assisted with everyday documents and basic administrative materials.',
      'Organised files and records so information remained clear and easy to retrieve.',
    ],
    sourceNote:
      'A short placement focused on routine document handling and workplace administration.',
  },
  unicom: {
    company: 'China Unicom · Jiangmen',
    role: 'Administrative Intern',
    relationship: 'One-month internship',
    duties: [
      'Assisted with routine documents and administrative materials.',
      'Organised files and records within a telecommunications business environment.',
    ],
    sourceNote:
      'A short placement focused on straightforward document work and day-to-day administration.',
  },
};
export function getExperiences(locale: 'zh' | 'en'): Experience[] {
  return locale === 'zh'
    ? experiences
    : experiences.map((e) => ({
        ...e,
        ...english[e.id],
        period:
          e.id === 'sunyedisplay' ? '2026.09–Present' : e.id === 'unicom' ? 'One month' : e.period,
        related: e.related?.map((p) => ({
          ...p,
          label: p.href.includes('sunyedisplay')
            ? 'Product visuals & digital content'
            : p.href.includes('enterprise')
              ? 'Enterprise AI Workspace'
              : p.label,
        })),
      }));
}
