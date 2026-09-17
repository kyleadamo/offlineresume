import { Resume, SectionConfig, DEFAULT_SECTION_ORDER } from '@/schema/resume';

export function getVisibleSections(resume: Resume): string[] {
  const order = resume.sectionOrder ?? DEFAULT_SECTION_ORDER;
  return order.filter(s => s.visible).map(s => s.id);
}
