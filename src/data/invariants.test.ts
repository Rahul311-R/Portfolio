import { describe, expect, it } from 'vitest';
import { PROJECTS } from './projects';
import { EXPERIENCES } from './experience';
import { RESUME_DATA } from './resume';
import { SOCIAL_LINKS } from './social';
import { NAV_LINKS } from '@/components/layout/Navbar';

describe('data invariants', () => {
  it('every project has a unique id and slug', () => {
    const ids = new Set(PROJECTS.map((p) => p.id));
    const slugs = new Set(PROJECTS.map((p) => p.slug));
    expect(ids.size).toBe(PROJECTS.length);
    expect(slugs.size).toBe(PROJECTS.length);
  });

  it('every project has required display fields and sections', () => {
    for (const p of PROJECTS) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.shortDescription.length).toBeGreaterThan(0);
      expect(p.description.length).toBeGreaterThan(0);
      expect(p.categories.length).toBeGreaterThan(0);
      expect(p.technologies.length).toBeGreaterThan(0);
      expect(p.sections.length).toBeGreaterThan(0);
      expect(p.year).toMatch(/^\[|^\d{4}/); // '[CONFIRM]' or a year
    }
  });

  it('project categories use only whitelisted values', () => {
    const allowed = ['AI', 'Computer Vision', 'Data', 'Web', 'Experiments', 'IoT', 'Road Safety'];
    for (const p of PROJECTS) {
      for (const c of p.categories) {
        expect(allowed).toContain(c);
      }
    }
  });

  it('each project has the full 9-section case-study structure', () => {
    for (const p of PROJECTS) {
      expect(p.sections).toHaveLength(9);
      expect(p.sections.every((s) => s.title.length > 0 && s.content.length > 0)).toBe(true);
    }
  });

  it('experience entries have unique ids and ordered content', () => {
    const ids = new Set(EXPERIENCES.map((e) => e.id));
    expect(ids.size).toBe(EXPERIENCES.length);
    for (const e of EXPERIENCES) {
      expect(e.company.length).toBeGreaterThan(0);
      expect(e.role.length).toBeGreaterThan(0);
      expect(e.highlights.length).toBeGreaterThan(0);
      expect(e.skills.length).toBeGreaterThan(0);
    }
  });

  it('resume data is complete', () => {
    expect(RESUME_DATA.name).toBe('RAHUL R');
    expect(RESUME_DATA.education.cgpa).toMatch(/8\.3/);
    expect(RESUME_DATA.skills.programming.length).toBeGreaterThan(0);
    expect(RESUME_DATA.certifications.length).toBeGreaterThan(0);
  });

  it('social links are well-formed and deduplicated', () => {
    const hrefs = new Set(SOCIAL_LINKS.map((l) => l.href));
    expect(hrefs.size).toBe(SOCIAL_LINKS.length);
    for (const link of SOCIAL_LINKS) {
      expect(link.href.startsWith('http') || link.href.startsWith('mailto:')).toBe(true);
      expect(link.label.length).toBeGreaterThan(0);
    }
  });

  it('nav links cover every primary route exactly once', () => {
    const paths = NAV_LINKS.map((l) => l.path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const path of paths) {
      expect(path.startsWith('/')).toBe(true);
    }
    expect(paths).toContain('/');
    expect(paths).toContain('/projects');
    expect(paths).toContain('/contact');
  });
});
